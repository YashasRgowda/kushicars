import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, Reveal, SplitText } from '@/components/ui/motion';

/**
 * The buy-your-car message on the home page.
 *
 * Kept to one idea and a single way in. It sits between the collection and
 * the finance section, where somebody who has just decided their current car
 * is the obstacle will meet it.
 */
export default function SellBand() {
  return (
    <section id="sell" className="relative scroll-mt-20 overflow-hidden py-32 lg:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-16 gap-y-12 border-y border-white/[0.07] py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Selling instead?</Eyebrow>
            <SplitText
              as="h2"
              text="We buy as much as we sell."
              className="mt-7 block max-w-xl font-display text-display-sm font-600 text-white"
            />
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-lg text-pretty text-[17px] leading-relaxed text-slate-400">
                Free inspection at the showroom or at your door, a firm offer
                the same day, and payment before the car leaves your hands.
                Running loan, duplicate RC, out-of-state registration — we have
                handled all of it before.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <Link
                href="/sell"
                className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                Get a free valuation
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          {/* The four questions that decide the price, stated plainly. It
              doubles as a preview of what the form will ask. */}
          <Reveal delay={0.1}>
            <dl className="space-y-8">
              {[
                ['Age and kilometres', 'The two biggest levers, and the two you cannot change.'],
                ['Service history', 'A stamped book from an authorised centre is worth real money.'],
                ['Accident record', 'Cosmetic work barely moves a quote. Structural work does.'],
                ['Paperwork', 'RC in hand, insurance valid, no open loan — that is a clean, fast sale.'],
              ].map(([term, def]) => (
                <div key={term} className="border-l border-white/10 pl-6">
                  <dt className="text-[15px] text-white">{term}</dt>
                  <dd className="mt-1.5 text-pretty text-[14px] leading-relaxed text-slate-500">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
