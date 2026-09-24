'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Brand, Car, CarFilters } from '@/lib/types';
import { EASE } from '@/components/ui/motion';
import FilterPanel from './FilterPanel';

/**
 * The mobile filter surface.
 *
 * A sheet rather than an inline block: on a phone the old chip row pushed the
 * first car three screens down. Here the grid stays at the top and filtering
 * is a deliberate, full-attention act that ends with one tap.
 *
 * Changes apply live — there is no Apply/Cancel pair, because the count on
 * the close button already tells you what you have done.
 */
export default function FilterSheet({
  open,
  onClose,
  cars,
  brands,
  filters,
  set,
  setMany,
  reset,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  cars: Car[];
  brands: Brand[];
  filters: CarFilters;
  set: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  setMany: (patch: Partial<CarFilters>) => void;
  reset: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-ink-1000/80 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter vehicles"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[95] flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-white/10 bg-ink-900 lg:hidden"
          >
            {/* Grab handle — tells the thumb this thing came from the bottom. */}
            <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-3">
              <span
                aria-hidden
                className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-white/15"
              />
              <h2 className="mt-3 font-display text-xl font-600 text-white">Filters</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="mt-3 grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              <FilterPanel
                scope="sheet"
                cars={cars}
                brands={brands}
                filters={filters}
                set={set}
                setMany={setMany}
              />
            </div>

            <div className="shrink-0 border-t border-white/[0.08] bg-ink-900 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full border border-white/12 px-5 py-3.5 text-sm text-slate-300"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-platinum px-5 py-3.5 text-sm font-500 text-ink-950"
                >
                  Show {resultCount} {resultCount === 1 ? 'car' : 'cars'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
