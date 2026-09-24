'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Calculator, ChevronDown } from 'lucide-react';
import type { Car } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Eyebrow, Reveal, SplitText } from './ui/motion';

export default function FinanceCalculator({ cars }: { cars: Car[] }) {
  // Open on something representative of the floor rather than a round number.
  const median = useMemo(() => {
    if (cars.length === 0) return 1000000;
    const sorted = [...cars].map((c) => c.price).sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }, [cars]);

  const [price, setPrice] = useState(median);
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(12.5);

  const down = Math.round((price * downPct) / 100);
  const principal = Math.max(0, price - down);

  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    if (principal === 0) return 0;
    if (r === 0) return principal / term;
    return (principal * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  }, [principal, rate, term]);

  const totalInterest = Math.max(0, monthly * term - principal);
  const totalPayable = principal + totalInterest;
  // How much of what you repay is interest — the number people never check.
  const interestShare = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;

  return (
    <section
      id="finance"
      className="relative scroll-mt-20 overflow-hidden py-28 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/[0.08] blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div>
            <Eyebrow>Finance</Eyebrow>
            <SplitText
              as="h2"
              text="Work out the EMI first"
              className="mt-6 block max-w-xl font-display text-display-sm font-600 text-white"
            />
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-pretty leading-relaxed text-slate-300/85">
                Before you fall for the car, see what it costs each month.
                Move the sliders for an indicative figure — we work with leading
                banks and NBFCs and can usually arrange a sanction the same day.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-4">
                <Figure label="Loan amount" value={formatPrice(principal)} />
                <Figure
                  label="Total interest"
                  value={formatPrice(Math.round(totalInterest))}
                  accent
                />
              </div>

              {/* What you actually repay, split */}
              <div className="mt-6">
                <div className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="bg-platinum transition-[width] duration-500 ease-premium"
                    style={{ width: `${100 - interestShare}%` }}
                  />
                  <div
                    className="bg-accent transition-[width] duration-500 ease-premium"
                    style={{ width: `${interestShare}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-platinum" />
                    Principal
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Interest · {interestShare.toFixed(0)}% of repayment
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Calculator */}
          <Reveal delay={0.1}>
            <div className="hairline relative rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 p-7 shadow-lift sm:p-9">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <Calculator className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  Payment estimator
                </span>
                <label htmlFor="fin-model" className="sr-only">
                  Choose a model
                </label>
                <div className="relative">
                  <select
                    id="fin-model"
                    onChange={(e) =>
                      e.target.value && setPrice(Number(e.target.value))
                    }
                    className="cursor-pointer appearance-none rounded-full border border-white/10 bg-ink-950 py-2 pl-4 pr-9 text-xs text-white outline-none transition-colors hover:border-white/25"
                    defaultValue=""
                  >
                    <option value="">Choose a model…</option>
                    {cars.map((c) => (
                      <option key={c.id} value={c.price}>
                        {c.brand} {c.model} — {formatPrice(c.price)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="hairline relative rounded-2xl bg-ink-1000/70 p-7 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Your estimated EMI
                </p>
                <p className="mt-3 font-display text-5xl font-700 tabular-nums text-white">
                  <span className="chrome-text">
                    {formatPrice(Math.round(monthly))}
                  </span>
                  <span className="ml-1 font-sans text-lg font-400 text-slate-500">
                    /mo
                  </span>
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {term} months · {formatPrice(down)} down
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <Slider
                  label="Vehicle price"
                  value={formatPrice(price)}
                  min={100000}
                  max={5000000}
                  step={10000}
                  current={price}
                  onChange={setPrice}
                />
                <Slider
                  label="Down payment"
                  value={`${downPct}% · ${formatPrice(down)}`}
                  min={0}
                  max={60}
                  step={5}
                  current={downPct}
                  onChange={setDownPct}
                />
                <Slider
                  label="Tenure"
                  value={`${term} months`}
                  min={12}
                  max={84}
                  step={6}
                  current={term}
                  onChange={setTerm}
                />
                <Slider
                  label="Interest rate (p.a.)"
                  value={`${rate.toFixed(2)}%`}
                  min={8}
                  max={18}
                  step={0.25}
                  current={rate}
                  onChange={setRate}
                />
              </div>

              <Link
                href="/contact"
                className="mt-8 block rounded-xl bg-accent py-4 text-center text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.02]"
              >
                Check what you qualify for
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">
                Indicative only. Not a finance offer.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Figure({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="hairline rounded-2xl bg-white/[0.03] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl font-600 tabular-nums ${
          accent ? 'text-accent-glow' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  const pct = ((current - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">{label}</label>
        <span className="text-sm font-500 tabular-nums text-white">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="range-premium w-full"
        style={{
          background: `linear-gradient(to right, #DC2626 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
        }}
      />
    </div>
  );
}
