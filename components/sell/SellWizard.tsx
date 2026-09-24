'use client';

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import {
  SELL_STEPS,
  validateAll,
  validateStep,
  type SellErrors,
  type SellFormValues,
} from '@/lib/sell';
import { submitSellRequest, type SellState } from '@/app/(site)/sell/actions';
import { EASE } from '@/components/ui/motion';
import { Honeypot } from '@/components/form/fields';
import ProgressRail from './ProgressRail';
import { StepCar, StepCondition, StepContact, StepPapers } from './Steps';
import {
  completeDraft,
  getServerSnapshot,
  getSnapshot,
  parseDraft,
  subscribe,
  withDraft,
  writeDraft,
} from './draft';

/**
 * The sell-your-car wizard.
 *
 * Four screens. The whole answer set lives in one piece of state and nothing
 * is written to the server until the last step, so a seller can walk back and
 * change an answer without losing anything.
 *
 * Validation runs per step on the way forward only. Validating as someone
 * types turns a form into an argument.
 */
export default function SellWizard() {
  // The answers are derived, not stored: whatever was left in the draft,
  // overlaid with whatever has been changed since. That keeps the restore
  // out of an effect, so there is no flash of an empty form on a refresh.
  const draft = parseDraft(
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
  );
  const [edits, setEdits] = useState<Partial<SellFormValues>>({});
  const v = useMemo(() => withDraft(draft, edits), [draft, edits]);

  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [errors, setErrors] = useState<SellErrors>({});
  const topRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState<SellState, FormData>(
    submitSellRequest,
    {},
  );

  // What goes over the wire, and what gets stashed against a refresh. A
  // string dependency, so the write only happens when an answer changes.
  const payload = JSON.stringify(v);

  // Nothing is saved until the seller has actually answered something.
  // Writing on mount would mean an empty form could overwrite a real draft
  // the moment this component appeared, which is the one thing a draft must
  // never do.
  const touched = Object.keys(edits).length > 0;
  useEffect(() => {
    if (touched) writeDraft(payload);
  }, [payload, touched]);

  const set = <K extends keyof SellFormValues>(key: K, value: SellFormValues[K]) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
    // Clear that field's error the moment it is touched — nagging about a
    // field somebody is actively fixing is the worst kind of feedback.
    setErrors((prev) => (key in prev ? { ...prev, [key]: undefined } : prev));
  };

  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const next = () => {
    const found = validateStep(step, v);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Put focus where the trouble is.
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus({ preventScroll: false });
      });
      return;
    }
    const n = Math.min(step + 1, SELL_STEPS.length);
    setStep(n);
    setFurthest((f) => Math.max(f, n));
    scrollToTop();
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    scrollToTop();
  };

  /**
   * Runs on the way out, before the request leaves the browser.
   *
   * It checks every step, not just the one on screen — somebody can reach
   * step 4 by clicking back through the rail and changing an answer on step
   * 2. If anything fails we land them on the step that holds it, so the
   * server's own re-validation is never the thing they hear about first.
   */
  const submit = () => {
    const found = validateAll(v);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const offending = SELL_STEPS.find((s) =>
        Object.keys(validateStep(s.id, v)).length > 0,
      );
      if (offending) setStep(offending.id);
      scrollToTop();
      return false;
    }
    setErrors({});
    // The success page builds the WhatsApp summary from this. It never
    // travels over the wire a second time.
    completeDraft(payload);
    return true;
  };

  const isLast = step === SELL_STEPS.length;
  const stepProps = { v, set, errors };

  return (
    <div ref={topRef} className="scroll-mt-28">
      <ProgressRail
        current={step}
        furthest={furthest}
        onJump={(s) => {
          setErrors({});
          setStep(s);
          scrollToTop();
        }}
      />

      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          if (!submit()) e.preventDefault();
        }}
        className="relative mt-12 lg:mt-16"
      >
        <Honeypot />
        <input type="hidden" name="payload" value={payload} />

        {/* Announces the step change for anyone not watching the rail. */}
        <p aria-live="polite" className="sr-only">
          Step {step} of {SELL_STEPS.length}: {SELL_STEPS[step - 1].title}
        </p>

        <div className="hairline rounded-3xl bg-ink-900/50 p-7 backdrop-blur-sm sm:p-10 lg:p-12">
          <header className="mb-10">
            <h2 className="font-display text-2xl font-600 text-white sm:text-3xl">
              {SELL_STEPS[step - 1].title}
            </h2>
            <p className="mt-2 text-[15px] text-slate-400">
              {SELL_STEPS[step - 1].blurb}
            </p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {step === 1 && <StepCar {...stepProps} />}
              {step === 2 && <StepCondition {...stepProps} />}
              {step === 3 && <StepPapers {...stepProps} />}
              {step === 4 && <StepContact {...stepProps} />}
            </motion.div>
          </AnimatePresence>

          {state.error && (
            <p
              role="alert"
              className="mt-8 rounded-xl border border-accent/30 bg-accent/[0.07] px-5 py-4 text-[14px] text-accent-soft"
            >
              {state.error}
              {state.fieldErrors && (
                <span className="mt-1.5 block text-slate-400">
                  {Object.values(state.fieldErrors).filter(Boolean).join(' ')}
                </span>
              )}
            </p>
          )}

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-8">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 rounded-full px-4 py-3 text-sm text-slate-400 transition-colors duration-300 hover:text-white disabled:pointer-events-none disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              Back
            </button>

            {isLast ? (
              <button
                type="submit"
                disabled={pending}
                className="flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03] disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Sending…
                  </>
                ) : (
                  <>
                    Get my quote
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2.5 rounded-full bg-platinum px-8 py-4 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                Continue
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </form>

      <p className="mt-6 text-center text-[13px] text-slate-500">
        Nothing is shared with anyone else, and there is no obligation to sell.
      </p>
    </div>
  );
}
