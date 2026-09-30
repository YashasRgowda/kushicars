import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, Reveal, SplitText } from '@/components/ui/motion';

/**
 * The we-buy-cars message on the home page.
 *
 * Somebody scrolling past has about three seconds to work out that this
 * showroom BUYS cars as well as selling them. So the heading asks them
 * outright, and the four steps beside it answer the only question that
 * follows — what actually happens if I say yes.
 *
 * Every trade word is gone. "Valuation", "obligation" and "inspection" all
 * lost to plain ones: a price, you can say no, we check it. The person this
 * has to land on is standing in a forecourt with his own car outside, not
 * reading a brochure.
 */
const steps: [string, string][] = [
  ['Tell us about your car', 'Three minutes on your phone. No papers needed yet.'],
  ['We check it, free', 'At our showroom, or we come to your home.'],
  ['You get one price, the same day', 'A firm number, not a range. You can still say no.'],
  ['We pay, and do the paperwork', 'Money first. Then the RC transfer and any running loan — our job, not yours.'],
];

export default function SellBand() {
  return (
    <section id="sell" className="section-y relative scroll-mt-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-16 gap-y-12 border-y border-line-soft py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-14">
          <div>
            <Eyebrow>We buy cars too</Eyebrow>
            <SplitText
              as="h2"
              text="Want to sell your car?"
              className="mt-7 block max-w-xl font-display text-display-sm font-600 text-ink-900"
            />
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-lg text-pretty text-[17px] leading-relaxed text-stone-700">
                Sell it to us. We check it for free, give you a firm price the
                same day, and pay you before the car leaves your hands. Loan
                still running, RC lost, number plate from another state — we
                have handled all of it before.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <Link
                href="/sell"
                className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                Get a free price for my car
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          {/* What happens, in the order it happens. Numbered, because a list
              of four steps with numbers on it reads as a process you can
              finish; the same four without them read as conditions. */}
          <Reveal delay={0.1}>
            <ol className="space-y-7">
              {steps.map(([title, body], i) => (
                <li key={title} className="flex gap-5">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-wash font-mono text-[11px] tabular-nums text-accent-ink">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[16px] leading-snug text-ink-900">{title}</p>
                    <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-stone-700">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
