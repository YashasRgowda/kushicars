'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SELL_STEPS } from '@/lib/sell';
import { EASE } from '@/components/ui/motion';

/**
 * Where you are in the four steps.
 *
 * A filling bar with named stations rather than "Step 2 of 4" — people
 * abandon forms whose end they cannot see, and a station they have already
 * cleared is a small piece of sunk cost that keeps them going.
 *
 * Completed steps are clickable; steps ahead are not, because they have not
 * been validated yet.
 */
export default function ProgressRail({
  current,
  furthest,
  onJump,
}: {
  current: number;
  /** The highest step reached so far — everything below it is revisitable. */
  furthest: number;
  onJump: (step: number) => void;
}) {
  const pct = ((current - 1) / (SELL_STEPS.length - 1)) * 100;

  return (
    <div>
      {/* Mobile: a bar and a caption. The full rail does not fit, and a
          squashed one reads as clutter. */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-lg font-600 text-white">
            {SELL_STEPS[current - 1].title}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Step {current} of {SELL_STEPS.length}
          </p>
        </div>
        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${(current / SELL_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden sm:block">
        <div className="absolute left-0 right-0 top-[15px] h-px bg-white/10" />
        <motion.div
          className="absolute left-0 top-[15px] h-px bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        <ol className="relative flex justify-between">
          {SELL_STEPS.map((s) => {
            const done = s.id < furthest || (s.id < current && s.id <= furthest);
            const active = s.id === current;
            const reachable = s.id <= furthest;

            return (
              <li key={s.id} className="flex flex-col items-center gap-3 text-center">
                <button
                  type="button"
                  onClick={() => reachable && onJump(s.id)}
                  disabled={!reachable}
                  aria-current={active ? 'step' : undefined}
                  className={`grid h-8 w-8 place-items-center rounded-full border text-[11px] font-500 tabular-nums transition-all duration-300 ease-premium ${
                    active
                      ? 'border-accent bg-accent text-white shadow-glow'
                      : done
                        ? 'border-accent/50 bg-ink-950 text-accent'
                        : 'border-white/15 bg-ink-950 text-slate-600'
                  } ${reachable ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.id}
                </button>
                <span className="w-24">
                  <span
                    className={`block text-[13px] transition-colors duration-300 ${
                      active ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
