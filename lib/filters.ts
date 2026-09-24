import type { Car, CarFilters, SortKey } from '@/lib/types';

/**
 * Inventory filtering, kept out of the components.
 *
 * The filter state lives in the URL rather than in React state, so a filtered
 * view can be sent over WhatsApp — which is how half this dealership's traffic
 * will arrive — and so the back button does what people expect.
 */

export const DEFAULT_FILTERS: CarFilters = {
  brand: 'All',
  body: 'All',
  fuel: 'All',
  transmission: 'All',
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxKm: null,
  maxOwners: null,
  sort: 'featured',
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'km-asc', label: 'Lowest kilometres' },
  { value: 'year-desc', label: 'Newest first' },
];

const SORT_KEYS = new Set(SORT_OPTIONS.map((o) => o.value));

/* ------------------------------------------------------------------
   URL <-> filters
   ------------------------------------------------------------------ */

/** Only non-default values are written, so a clean URL stays clean. */
export function filtersToParams(f: CarFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.brand !== 'All') p.set('brand', f.brand);
  if (f.body !== 'All') p.set('body', f.body);
  if (f.fuel !== 'All') p.set('fuel', f.fuel);
  if (f.transmission !== 'All') p.set('gear', f.transmission);
  if (f.minPrice !== null) p.set('min', String(f.minPrice));
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice));
  if (f.minYear !== null) p.set('year', String(f.minYear));
  if (f.maxKm !== null) p.set('km', String(f.maxKm));
  if (f.maxOwners !== null) p.set('owners', String(f.maxOwners));
  if (f.sort !== 'featured') p.set('sort', f.sort);
  return p;
}

export function filtersFromParams(p: URLSearchParams | ReadonlyURLSearchParamsLike): CarFilters {
  const num = (k: string) => {
    const v = p.get(k);
    if (v === null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const sort = p.get('sort');

  return {
    brand: p.get('brand') || 'All',
    body: (p.get('body') as CarFilters['body']) || 'All',
    fuel: (p.get('fuel') as CarFilters['fuel']) || 'All',
    transmission: p.get('gear') || 'All',
    minPrice: num('min'),
    maxPrice: num('max'),
    minYear: num('year'),
    maxKm: num('km'),
    maxOwners: num('owners'),
    sort: sort && SORT_KEYS.has(sort as SortKey) ? (sort as SortKey) : 'featured',
  };
}

/** Next's ReadonlyURLSearchParams is structurally this much. */
interface ReadonlyURLSearchParamsLike {
  get(name: string): string | null;
}

/* ------------------------------------------------------------------
   Applying
   ------------------------------------------------------------------ */

const TAG_RANK: Record<string, number> = {
  Featured: 0,
  'Fresh Arrival': 1,
  Certified: 2,
};

export function matches(car: Car, f: CarFilters): boolean {
  if (f.brand !== 'All' && car.brand !== f.brand) return false;
  if (f.body !== 'All' && car.body !== f.body) return false;
  if (f.fuel !== 'All' && car.fuel !== f.fuel) return false;
  if (f.transmission !== 'All' && car.transmission !== f.transmission) return false;
  if (f.minPrice !== null && car.price < f.minPrice) return false;
  if (f.maxPrice !== null && car.price > f.maxPrice) return false;
  if (f.minYear !== null && car.year < f.minYear) return false;
  if (f.maxKm !== null && car.kmDriven > f.maxKm) return false;
  if (f.maxOwners !== null && car.owners > f.maxOwners) return false;
  return true;
}

export function applyFilters(cars: Car[], f: CarFilters): Car[] {
  const list = cars.filter((c) => matches(c, f));
  switch (f.sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'km-asc':
      return list.sort((a, b) => a.kmDriven - b.kmDriven);
    case 'year-desc':
      return list.sort((a, b) => b.year - a.year);
    default:
      // Tagged cars lead, in tag order; the rest keep the owner's showroom order.
      return list.sort(
        (a, b) => (TAG_RANK[a.tag ?? ''] ?? 9) - (TAG_RANK[b.tag ?? ''] ?? 9),
      );
  }
}

/**
 * Counts a facet as if that one filter were not set — so the brand list can
 * show "Hyundai 3" against the *rest* of your selection rather than against
 * the whole floor. Facets that count themselves always read the same as the
 * result count, which tells the user nothing.
 */
export function countWithout<K extends keyof CarFilters>(
  cars: Car[],
  f: CarFilters,
  key: K,
  value: CarFilters[K],
): number {
  const probe = { ...f, [key]: value } as CarFilters;
  return cars.reduce((n, c) => (matches(c, probe) ? n + 1 : n), 0);
}

export const isDefault = (f: CarFilters) =>
  f.brand === 'All' &&
  f.body === 'All' &&
  f.fuel === 'All' &&
  f.transmission === 'All' &&
  f.minPrice === null &&
  f.maxPrice === null &&
  f.minYear === null &&
  f.maxKm === null &&
  f.maxOwners === null;

/** How many filters are set — the number on the mobile "Filters" button. */
export const activeCount = (f: CarFilters) =>
  [
    f.brand !== 'All',
    f.body !== 'All',
    f.fuel !== 'All',
    f.transmission !== 'All',
    f.minPrice !== null || f.maxPrice !== null,
    f.minYear !== null,
    f.maxKm !== null,
    f.maxOwners !== null,
  ].filter(Boolean).length;

/** The price range to give the slider — derived from stock, not hardcoded. */
export function priceBounds(cars: Car[]): [number, number] {
  if (cars.length === 0) return [0, 2000000];
  const prices = cars.map((c) => c.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  // Round out to clean 50k steps so the handles land on readable numbers.
  const step = 50000;
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
}
