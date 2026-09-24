'use client';

import type { Brand, Car, CarFilters } from '@/lib/types';
import { countWithout, priceBounds } from '@/lib/filters';
import { formatPriceShort } from '@/lib/format';
import { Field, OptionList, PriceRange, Segmented } from './controls';

/**
 * The filter controls themselves. Rendered twice — inside the desktop rail
 * and inside the mobile sheet — so every control lives here exactly once.
 *
 * Year, kilometres and owners are fixed bands rather than sliders on purpose.
 * Nobody filters for "cars under 63,000 km"; they filter for "not too many
 * kilometres", and three named bands say that faster than a slider does.
 */

const BODIES = ['Hatchback', 'Sedan', 'SUV', 'MUV'] as const;
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric'] as const;

export default function FilterPanel({
  cars,
  brands,
  filters,
  set,
  setMany,
  scope,
}: {
  cars: Car[];
  brands: Brand[];
  filters: CarFilters;
  set: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  setMany: (patch: Partial<CarFilters>) => void;
  scope: string;
}) {
  const [lo, hi] = priceBounds(cars);
  const minPrice = filters.minPrice ?? lo;
  const maxPrice = filters.maxPrice ?? hi;

  // Every count is computed as if that filter were open, so the brand list
  // answers "what else could I pick" rather than repeating the result count.
  const brandOptions = [
    { value: 'All', label: 'All brands', count: countWithout(cars, filters, 'brand', 'All') },
    ...brands.map((b) => ({
      value: b.name,
      label: b.name,
      count: countWithout(cars, filters, 'brand', b.name),
    })),
  ];

  const bodyOptions = [
    { value: 'All' as const, label: 'Any' },
    ...BODIES.map((b) => ({ value: b, label: b })),
  ];

  const fuelOptions = [
    { value: 'All' as const, label: 'Any' },
    ...FUELS.map((f) => ({ value: f, label: f })),
  ];

  return (
    <div className="space-y-7">
      <Field label="Budget">
        <PriceRange
          bounds={[lo, hi]}
          min={minPrice}
          max={maxPrice}
          format={formatPriceShort}
          onChange={(nmin, nmax) =>
            setMany({
              minPrice: nmin <= lo ? null : nmin,
              maxPrice: nmax >= hi ? null : nmax,
            })
          }
        />
      </Field>

      <Field label="Brand">
        <OptionList
          options={brandOptions}
          value={filters.brand}
          onChange={(v) => set('brand', v)}
        />
      </Field>

      <Field label="Body style">
        <Segmented
          scope={`${scope}-body`}
          options={bodyOptions}
          value={filters.body}
          onChange={(v) => set('body', v)}
        />
      </Field>

      <Field label="Fuel">
        <Segmented
          scope={`${scope}-fuel`}
          options={fuelOptions}
          value={filters.fuel}
          onChange={(v) => set('fuel', v)}
        />
      </Field>

      <Field label="Transmission">
        <Segmented
          scope={`${scope}-gear`}
          options={[
            { value: 'All', label: 'Any' },
            { value: 'Manual', label: 'Manual' },
            { value: 'Automatic', label: 'Automatic' },
          ]}
          value={filters.transmission}
          onChange={(v) => set('transmission', v)}
        />
      </Field>

      <Field label="Age">
        <Segmented
          scope={`${scope}-year`}
          columns={2}
          options={[
            { value: 0, label: 'Any year' },
            { value: 2016, label: '2016 & newer' },
            { value: 2019, label: '2019 & newer' },
            { value: 2021, label: '2021 & newer' },
          ]}
          value={filters.minYear ?? 0}
          onChange={(v) => set('minYear', v === 0 ? null : v)}
        />
      </Field>

      <Field label="Kilometres">
        <Segmented
          scope={`${scope}-km`}
          columns={2}
          options={[
            { value: 0, label: 'Any' },
            { value: 30000, label: 'Under 30,000' },
            { value: 60000, label: 'Under 60,000' },
            { value: 100000, label: 'Under 1,00,000' },
          ]}
          value={filters.maxKm ?? 0}
          onChange={(v) => set('maxKm', v === 0 ? null : v)}
        />
      </Field>

      <Field
        label="Ownership"
        hint="Fewer previous owners usually means better service records."
      >
        <Segmented
          scope={`${scope}-owners`}
          options={[
            { value: 0, label: 'Any' },
            { value: 1, label: 'First owner' },
            { value: 2, label: 'Up to second' },
          ]}
          value={filters.maxOwners ?? 0}
          onChange={(v) => set('maxOwners', v === 0 ? null : v)}
        />
      </Field>
    </div>
  );
}
