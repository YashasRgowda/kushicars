'use client';

import { useActionState, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import type { Car, Settings } from '@/lib/types';
import type { EnquiryKind } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { monthlyFrom } from '@/lib/emi';
import { telHref } from '@/lib/whatsapp';
import { submitEnquiry, type EnquiryState } from '@/app/(site)/actions';
import { EASE } from '@/components/ui/motion';
import { Honeypot, TextField } from '@/components/form/fields';

/**
 * The sticky column on a listing: the price, and the two things a buyer
 * might want to do about it.
 *
 * There is no WhatsApp button here any more. A hand-off to WhatsApp leaves
 * no record anywhere the showroom can work from — the conversation lives on
 * one phone, and whoever is holding it is the only person who knows the
 * enquiry exists. Both buttons below write a row instead, so every enquiry
 * is in the panel whether or not anybody replied to it yet.
 *
 * Both ask for two things only. A name and a number is everything needed to
 * ring somebody back; every field past that is a reason to abandon the form,
 * and the call itself is a better place to ask the rest.
 */
const INTENTS: { kind: Extract<EnquiryKind, 'general' | 'test_drive'>; label: string; icon: React.ElementType }[] = [
  { kind: 'general', label: 'Enquire about this car', icon: MessageSquare },
  { kind: 'test_drive', label: 'Book a test drive', icon: CalendarDays },
];

export default function EnquiryPanel({
  car,
  settings,
}: {
  car: Car;
  settings: Settings;
}) {
  const [intent, setIntent] = useState<'general' | 'test_drive' | null>(null);
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    {},
  );

  const label = `${car.year} ${car.brand} ${car.model} ${car.variant}`.trim();

  return (
    <div className="hairline rounded-2xl bg-paper p-7 shadow-card">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">
        Asking price
      </p>
      <p className="mt-2 font-display text-4xl font-600 tabular-nums leading-none text-ink-900">
        {formatPrice(car.price)}
      </p>
      <p className="mt-3 text-[13px] text-stone-700">
        Roughly{' '}
        <span className="tabular-nums text-ink-900">
          ₹{formatNumber(monthlyFrom(car.price))}
        </span>{' '}
        a month on a five-year loan at 12.5%, with 20% down.
      </p>

      {state.ok ? (
        <Done phone={state.submitted?.phone} />
      ) : (
        <>
          <div className="mt-7 space-y-2.5">
            {INTENTS.map((o, i) => {
              const active = intent === o.kind;
              const primary = i === 0;
              return (
                <button
                  key={o.kind}
                  type="button"
                  onClick={() => setIntent(o.kind)}
                  aria-expanded={active}
                  className={`flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm font-500 transition-all duration-300 ease-premium ${
                    primary
                      ? 'bg-accent text-white shadow-lift-accent hover:scale-[1.02]'
                      : active
                        ? 'border border-accent bg-accent-wash text-accent-ink'
                        : 'border border-line-strong text-stone-800 hover:border-accent hover:text-ink-900'
                  }`}
                >
                  <o.icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  {o.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {intent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <form action={formAction} className="relative space-y-4 pt-6">
                  <Honeypot />
                  {/* Which button opened the form is the only difference
                      between the two — the panel shows it as the chip on
                      the row. */}
                  <input type="hidden" name="kind" value={intent} />
                  <input type="hidden" name="car_id" value={car.id} />
                  <input type="hidden" name="car_label" value={label} />

                  <TextField
                    label="Your name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                  />
                  <TextField
                    label="Mobile number"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    prefix="+91"
                    maxLength={10}
                    placeholder="Enter your number"
                  />

                  {state.error && (
                    <p className="text-[13px] text-danger-ink">{state.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-500 text-white transition-all duration-300 ease-premium hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending
                      ? 'Sending…'
                      : intent === 'test_drive'
                        ? 'Request a test drive'
                        : 'Request a call back'}
                  </button>
                  <p className="text-[12px] leading-relaxed text-stone-600">
                    We will not pass your number to anyone else.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {settings.phone && (
        <a
          href={telHref(settings.phone)}
          className="mt-5 flex items-center justify-center gap-2.5 py-2 text-sm text-stone-700 transition-colors hover:text-ink-900"
        >
          <Phone className="h-4 w-4 text-accent" strokeWidth={1.6} />
          <span className="tabular-nums">{settings.phone}</span>
        </a>
      )}
    </div>
  );
}

/** Says when the call is coming, and to which number. */
function Done({ phone }: { phone?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-7 rounded-2xl border border-accent-line bg-accent-wash px-6 py-7 text-center"
    >
      <CheckCircle2 className="mx-auto h-9 w-9 text-accent" strokeWidth={1.5} />
      <p className="mt-4 font-display text-xl font-600 text-ink-900">
        Request received
      </p>
      <p className="mt-2.5 text-[14px] leading-relaxed text-stone-800">
        Our team will call you within 2 hours
        {phone ? (
          <>
            {' '}on <span className="tabular-nums text-ink-900">{phone}</span>
          </>
        ) : null}
        .
      </p>
      <p className="mt-3 text-[12px] leading-relaxed text-stone-600">
        If the showroom is closed, first thing after it opens.
      </p>
    </motion.div>
  );
}
