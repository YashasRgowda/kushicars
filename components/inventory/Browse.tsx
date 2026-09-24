'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import type { Brand, Car } from '@/lib/types';
import { activeCount, applyFilters, isDefault } from '@/lib/filters';
import { EASE } from '@/components/ui/motion';
import CarCard from '@/components/CarCard';
import FilterPanel from './FilterPanel';
import FilterSheet from './FilterSheet';
import SortSelect from './SortSelect';
import ActiveTokens from './ActiveTokens';
import { useCarFilters } from './useCarFilters';

/**
 * The collection browser.
 *
 * Two columns on desktop: a quiet rail that never scrolls away, and the grid.
 * One column on mobile, with the rail folded into a sheet. Both render the
 * same FilterPanel, so there is no second copy of the controls to drift.
 */
export default function Browse({ cars, brands }: { cars: Car[]; brands: Brand[] }) {
  const { filters, set, setMany, reset } = useCarFilters();
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => applyFilters(cars, filters), [cars, filters]);
  const count = activeCount(filters);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-10 lg:pb-44">
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[17rem_1fr]">
        {/* ---------------- Rail (desktop) ---------------- */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-600 text-white">Refine</h2>
              {!isDefault(filters) && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-slate-500 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="scroll-slim mt-7 max-h-[calc(100dvh-12rem)] overflow-y-auto pr-3">
              <FilterPanel
                scope="rail"
                cars={cars}
                brands={brands}
                filters={filters}
                set={set}
                setMany={setMany}
              />
            </div>
          </div>
        </aside>

        {/* ---------------- Results ---------------- */}
        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <p className="text-sm text-slate-400">
              <span className="font-600 tabular-nums text-white">{results.length}</span>{' '}
              {results.length === 1 ? 'car' : 'cars'}
              {!isDefault(filters) && (
                <span className="text-slate-500"> of {cars.length}</span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-4 pr-5 text-sm text-slate-200 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                Filters
                {count > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 font-mono text-[10px] tabular-nums text-white">
                    {count}
                  </span>
                )}
              </button>

              <SortSelect value={filters.sort} onChange={(v) => set('sort', v)} />
            </div>
          </div>

          {/* Active filters */}
          {!isDefault(filters) && (
            <div className="mt-5">
              <ActiveTokens
                filters={filters}
                clear={set}
                clearMany={setMany}
                reset={reset}
              />
            </div>
          )}

          {/* Grid */}
          {results.length > 0 ? (
            <motion.div
              layout
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {results.map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <Empty onReset={reset} />
          )}
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        cars={cars}
        brands={brands}
        filters={filters}
        set={set}
        setMany={setMany}
        reset={reset}
        resultCount={results.length}
      />
    </div>
  );
}

function Empty({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-10 rounded-3xl border border-dashed border-white/10 px-8 py-24 text-center"
    >
      <p className="font-display text-2xl text-white">Nothing matches that combination</p>
      <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-slate-400">
        Stock moves quickly here. Tell us what you are looking for and we will
        source it — most requests are filled within a fortnight.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-platinum px-6 py-3 text-sm font-500 text-ink-950 transition-transform duration-300 ease-premium hover:scale-[1.04]"
        >
          Clear filters
        </button>
        <Link
          href="/contact"
          className="rounded-full border border-white/12 px-6 py-3 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
        >
          Tell us what you want
        </Link>
      </div>
    </motion.div>
  );
}
