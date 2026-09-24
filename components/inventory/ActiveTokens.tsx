'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { CarFilters } from '@/lib/types';
import { formatNumber, formatPriceShort } from '@/lib/format';
import { EASE } from '@/components/ui/motion';

/**
 * What is currently narrowing the list, and a way out of each one.
 *
 * This row only exists when something is set — an empty toolbar that is
 * permanently present is dead weight on the page.
 */
export default function ActiveTokens({
  filters,
  clear,
  clearMany,
  reset,
}: {
  filters: CarFilters;
  clear: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  clearMany: (patch: Partial<CarFilters>) => void;
  reset: () => void;
}) {
  const tokens: { key: string; label: string; onClear: () => void }[] = [];

  if (filters.brand !== 'All')
    tokens.push({ key: 'brand', label: filters.brand, onClear: () => clear('brand', 'All') });
  if (filters.body !== 'All')
    tokens.push({ key: 'body', label: filters.body, onClear: () => clear('body', 'All') });
  if (filters.fuel !== 'All')
    tokens.push({ key: 'fuel', label: filters.fuel, onClear: () => clear('fuel', 'All') });
  if (filters.transmission !== 'All')
    tokens.push({
      key: 'gear',
      label: filters.transmission,
      onClear: () => clear('transmission', 'All'),
    });
  if (filters.minPrice !== null || filters.maxPrice !== null)
    tokens.push({
      key: 'price',
      label: priceLabel(filters),
      onClear: () => clearMany({ minPrice: null, maxPrice: null }),
    });
  if (filters.minYear !== null)
    tokens.push({
      key: 'year',
      label: `${filters.minYear} & newer`,
      onClear: () => clear('minYear', null),
    });
  if (filters.maxKm !== null)
    tokens.push({
      key: 'km',
      label: `Under ${formatNumber(filters.maxKm)} km`,
      onClear: () => clear('maxKm', null),
    });
  if (filters.maxOwners !== null)
    tokens.push({
      key: 'owners',
      label: filters.maxOwners === 1 ? 'First owner' : 'Up to second owner',
      onClear: () => clear('maxOwners', null),
    });

  if (tokens.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence mode="popLayout">
        {tokens.map((t) => (
          <motion.button
            key={t.key}
            layout
            type="button"
            onClick={t.onClear}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-3.5 pr-2.5 text-[13px] text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:text-white"
          >
            {t.label}
            <X
              aria-hidden
              className="h-3.5 w-3.5 text-slate-500 transition-colors duration-200 group-hover:text-accent"
              strokeWidth={2}
            />
            <span className="sr-only">Remove filter</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {tokens.length > 1 && (
        <button
          type="button"
          onClick={reset}
          className="ml-1 text-[13px] text-slate-500 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function priceLabel(f: CarFilters) {
  if (f.minPrice !== null && f.maxPrice !== null)
    return `${formatPriceShort(f.minPrice)} – ${formatPriceShort(f.maxPrice)}`;
  if (f.maxPrice !== null) return `Under ${formatPriceShort(f.maxPrice)}`;
  return `Over ${formatPriceShort(f.minPrice!)}`;
}
