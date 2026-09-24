'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CarFilters } from '@/lib/types';
import { DEFAULT_FILTERS, filtersFromParams, filtersToParams } from '@/lib/filters';

/**
 * Filter state, held in the URL.
 *
 * Nothing about the selection lives in React state. That means a filtered
 * view survives a refresh, can be pasted into WhatsApp — which is how most
 * of this dealership's traffic moves — and the back button steps through
 * selections the way people expect.
 *
 * `replace` with `scroll: false` keeps the grid still while you tick boxes;
 * a `push` here would fill the history with every intermediate state.
 */
export function useCarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters = useMemo(() => filtersFromParams(params), [params]);

  const write = useCallback(
    (next: CarFilters) => {
      const qs = filtersToParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const set = useCallback(
    <K extends keyof CarFilters>(key: K, value: CarFilters[K]) =>
      write({ ...filters, [key]: value }),
    [filters, write],
  );

  const setMany = useCallback(
    (patch: Partial<CarFilters>) => write({ ...filters, ...patch }),
    [filters, write],
  );

  /** Clears the selection but keeps the sort — that is a preference, not a filter. */
  const reset = useCallback(
    () => write({ ...DEFAULT_FILTERS, sort: filters.sort }),
    [write, filters.sort],
  );

  return { filters, set, setMany, reset };
}
