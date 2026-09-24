'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { EASE } from '@/components/ui/motion';

/* ==================================================================
   Form primitives.

   One set of inputs for the whole site. They are deliberately plain —
   a dark field, a hairline, a focused accent edge — because a form on a
   page this rich should recede and let the answers be the loud thing.
   ================================================================== */

const base =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-slate-600 outline-none transition-colors duration-200';

const ring = (invalid?: boolean) =>
  invalid
    ? 'border-accent/60 focus:border-accent'
    : 'border-white/10 hover:border-white/20 focus:border-white/35';

export function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.p
      id={id}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="mt-2 flex items-start gap-1.5 text-[13px] text-accent-soft"
    >
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {children}
    </motion.p>
  );
}

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2.5 flex items-baseline justify-between gap-3 text-[13px] font-500 text-slate-300"
    >
      <span>{children}</span>
      {optional && (
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
          Optional
        </span>
      )}
    </label>
  );
}

export function TextField({
  label,
  error,
  optional,
  hint,
  prefix,
  suffix,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  /** Static text inside the field's left edge, e.g. ₹ or +91. */
  prefix?: string;
  suffix?: string;
}) {
  const uid = useId();
  const id = props.id ?? uid;
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-500">
            {prefix}
          </span>
        )}
        <input
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          // The gap has to clear the prefix itself, and "₹" and "+91" are not
          // the same width. A fixed class had "+91" sitting on top of the
          // placeholder; ch units scale with whatever is actually in there.
          style={
            prefix
              ? { paddingLeft: `calc(1rem + ${prefix.length}ch + 0.45rem)` }
              : undefined
          }
          className={`${base} ${ring(!!error)} ${suffix ? 'pr-14' : ''}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-wider text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <ErrorText id={errId}>{error}</ErrorText>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-[13px] text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  error,
  optional,
  hint,
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
}) {
  const uid = useId();
  const id = props.id ?? uid;
  const errId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${base} ${ring(!!error)} min-h-28 resize-y leading-relaxed`}
      />
      {error ? (
        <ErrorText id={errId}>{error}</ErrorText>
      ) : hint ? (
        <p className="mt-2 text-[13px] text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  error,
  optional,
  options,
  placeholder,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  optional?: boolean;
  options: readonly string[] | { value: string; label: string }[];
  placeholder?: string;
}) {
  const uid = useId();
  const id = props.id ?? uid;
  const errId = `${id}-error`;
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${base} ${ring(!!error)} cursor-pointer appearance-none pr-11 [&>option]:bg-ink-850 [&>option]:text-white`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {items.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-slate-500"
          strokeWidth="1.6"
        >
          <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && <ErrorText id={errId}>{error}</ErrorText>}
    </div>
  );
}

/* ------------------------------------------------------------------
   Choice — the big tappable option rows used all through the sell flow.

   A radio group rendered as full-width cards. On a phone these are far
   easier to hit than a native radio, and the hint line is where the
   plain-English explanation of "hypothecation" actually fits.
   ------------------------------------------------------------------ */

export function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
  error,
  columns = 1,
  hint,
}: {
  legend: string;
  options: { value: T; label: string; hint?: string }[];
  value: T | '';
  onChange: (v: T) => void;
  error?: string;
  columns?: 1 | 2 | 3;
  hint?: string;
}) {
  const uid = useId();
  const errId = `${uid}-error`;

  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-1 text-[13px] font-500 text-slate-300">{legend}</legend>
      {hint && <p className="mb-3.5 text-[13px] text-slate-500">{hint}</p>}
      <div
        className={`mt-3 grid gap-2.5 ${
          columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : ''
        }`}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`group relative flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-300 ease-premium ${
                active
                  ? 'border-accent/60 bg-accent/[0.07]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25'
              }`}
            >
              <span
                aria-hidden
                className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  active ? 'border-accent bg-accent' : 'border-white/25'
                }`}
              >
                {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[15px] leading-snug transition-colors duration-300 ${
                    active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {o.label}
                </span>
                {o.hint && (
                  <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                    {o.hint}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {error && <ErrorText id={errId}>{error}</ErrorText>}
    </fieldset>
  );
}

/** A yes/no as a pair of pills — reads faster than a toggle switch. */
export function BoolChoice({
  legend,
  value,
  onChange,
  yes = 'Yes',
  no = 'No',
  hint,
}: {
  legend: string;
  value: boolean;
  onChange: (v: boolean) => void;
  yes?: string;
  no?: string;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-500 text-slate-300">{legend}</legend>
      {hint && <p className="mt-1.5 text-[13px] text-slate-500">{hint}</p>}
      <div className="mt-3 inline-flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {[
          { v: false, label: no },
          { v: true, label: yes },
        ].map((o) => (
          <button
            key={String(o.v)}
            type="button"
            role="radio"
            aria-checked={value === o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-lg px-6 py-2.5 text-sm transition-colors duration-300 ${
              value === o.v
                ? 'bg-platinum text-ink-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Checkbox({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  const uid = useId();
  const errId = `${uid}-error`;

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/70 ${
            checked ? 'border-accent bg-accent' : error ? 'border-accent/60' : 'border-white/25'
          }`}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[13px] leading-relaxed text-slate-400">{children}</span>
      </label>
      {error && <ErrorText id={errId}>{error}</ErrorText>}
    </div>
  );
}

/** Hidden from people, irresistible to bots. Paired with the server check. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
