'use client';

import { useId } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

/* ==================================================================
   Filter primitives.

   The old collection bar failed because everything was a pill with a
   border and a count badge, so nine equally loud objects wrapped across
   four lines. Here only one thing is ever loud — the selected value —
   and the rest is quiet type on quiet ground.
   ================================================================== */

/** The small caps label that opens every filter group. */
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-500 uppercase tracking-[0.22em] text-slate-500">
      {children}
    </p>
  );
}

/** A filter group: label, air, control. The air is the point. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="border-t border-white/[0.07] pt-6">
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-4">{children}</div>
      {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------
   Segmented — a row of options where the selected one is a solid slab
   that physically travels between positions.
   ------------------------------------------------------------------ */

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  scope,
  columns,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Namespaces the sliding pill. The rail and the mobile sheet are both
   *  mounted at once, and two live layoutIds with the same name fight. */
  scope: string;
  /** Force a grid instead of a wrapping row — keeps long labels tidy. */
  columns?: 2 | 3;
}) {
  const uid = useId();
  const layoutId = `${scope}-${uid}`;

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="group"
        className={
          columns
            ? `grid gap-1.5 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`
            : 'flex flex-wrap gap-1.5'
        }
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`relative rounded-lg px-3 py-2 text-[13px] font-400 transition-colors duration-300 ${
                active ? 'text-ink-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-lg bg-platinum"
                />
              )}
              <span className="relative whitespace-nowrap">{o.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------
   OptionList — brands. A list, not pills.

   Counts sit right-aligned in muted mono so they read as data, not as
   badges competing with the name.
   ------------------------------------------------------------------ */

export function OptionList({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; count: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ul className="-mx-2 space-y-px">
      {options.map((o) => {
        const active = o.value === value;
        const empty = o.count === 0 && !active;
        return (
          <li key={o.value}>
            <button
              type="button"
              onClick={() => onChange(o.value)}
              disabled={empty}
              aria-pressed={active}
              className={`group relative flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[13px] transition-colors duration-200 ${
                active
                  ? 'text-white'
                  : empty
                    ? 'cursor-not-allowed text-slate-700'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {/* The marker for the current selection — a lit edge, not a fill. */}
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className="truncate pl-2">{o.label}</span>
              <span
                className={`ml-3 shrink-0 font-mono text-[10px] tabular-nums ${
                  active ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {o.count}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------
   PriceRange — two native range inputs stacked over one painted track.

   Native inputs mean keyboard and screen-reader support come free; the
   visible track and fill are ours, so it can look like the rest of the site.
   ------------------------------------------------------------------ */

export function PriceRange({
  bounds,
  min,
  max,
  onChange,
  format,
}: {
  bounds: [number, number];
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  format: (n: number) => string;
}) {
  const [lo, hi] = bounds;
  const span = Math.max(1, hi - lo);
  const step = 50000;

  const pct = (v: number) => ((v - lo) / span) * 100;

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between font-mono text-xs tabular-nums text-slate-300">
        <span>{format(min)}</span>
        <span className="text-slate-600">—</span>
        <span>{format(max)}</span>
      </div>

      <div className="range-dual relative h-5">
        <span aria-hidden className="range-dual__track" />
        <span
          aria-hidden
          className="range-dual__fill"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={lo}
          max={hi}
          step={step}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max - step), max)}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={lo}
          max={hi}
          step={step}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min + step))}
        />
      </div>
    </div>
  );
}
