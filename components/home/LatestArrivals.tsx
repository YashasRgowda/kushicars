import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Car } from '@/lib/types';
import CarCard from '@/components/CarCard';
import { Eyebrow, Reveal, SplitText } from '@/components/ui/motion';

/**
 * The home page's slice of the stock.
 *
 * Six cars and a way through to the full list — no filters. The filtering
 * lives on /cars, where there is room for it. Putting nine filter chips above
 * the fold on the home page was what made the old collection block feel
 * cheap: a wall of equally loud controls before anyone had seen a car.
 */
export default function LatestArrivals({ cars }: { cars: Car[] }) {
  const shown = cars.slice(0, 6);
  if (shown.length === 0) return null;

  return (
    <section
      id="inventory"
      className="relative scroll-mt-20 overflow-hidden py-32 lg:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[380px] w-[760px] max-w-full -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>The collection</Eyebrow>
            <SplitText
              as="h2"
              text="Find your next car"
              className="mt-7 block max-w-2xl font-display text-display-sm font-600 text-white"
            />
          </div>

          <Reveal delay={0.1}>
            <Link
              href="/cars"
              className="group flex items-center gap-2.5 rounded-full border border-white/12 px-6 py-3.5 text-sm text-slate-200 transition-colors duration-300 hover:border-white/30 hover:text-white"
            >
              See all {cars.length} cars
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        {cars.length > shown.length && (
          <Reveal delay={0.1}>
            <div className="mt-14 text-center">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2.5 rounded-full bg-platinum px-8 py-4 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                Browse the full collection
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <p className="mt-5 text-[13px] text-slate-500">
                Filter by budget, brand, body style, fuel and ownership.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
