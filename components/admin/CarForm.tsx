'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';
import PhotoUploader from './PhotoUploader';
import { ListingPreview, ListingPreviewBar } from './ListingPreview';
import { Block } from './ui';
import { SelectField, TextField } from '@/components/form/fields';
import { MAX_YEAR, MIN_YEAR } from '@/lib/validation';
import type { CarFormState } from '@/app/admin/cars/actions';
import type { BodyType, Car, Fuel, Tag } from '@/lib/types';

/**
 * Add or edit one car.
 *
 * Two rules shaped this screen. First, anything that can be a choice from a
 * list is one — the owner types only the four things he alone knows: model,
 * variant, price and the odometer reading. Second, he never has to imagine
 * the result: the real listing card sits beside the form and keeps up with
 * him keystroke by keystroke.
 */

const BODIES = ['Hatchback', 'Sedan', 'SUV', 'MUV'];
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const GEARBOXES = [
  'Manual',
  'Automatic',
  'AMT',
  'CVT Automatic',
  'DCT Automatic',
  'DSG Automatic',
];
const TAGS = [
  { value: '', label: 'No badge' },
  { value: 'Fresh Arrival', label: 'Fresh Arrival' },
  { value: 'Certified', label: 'Certified' },
  { value: 'Featured', label: 'Featured' },
];
const OWNERS = [
  { value: '1', label: 'First owner' },
  { value: '2', label: 'Second owner' },
  { value: '3', label: 'Third owner' },
  { value: '4', label: 'Fourth owner' },
  { value: '5', label: 'Fifth owner or more' },
];

/** Newest first — nobody scrolls to 1990 to list a 2022 car. */
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) =>
  String(MAX_YEAR - i),
);

/** What the preview needs, held as the strings the inputs actually hold. */
interface Snapshot {
  brand: string;
  model: string;
  variant: string;
  year: string;
  price: string;
  body: string;
  fuel: string;
  km_driven: string;
  owners: string;
  transmission: string;
  mileage: string;
  registration: string;
  tag: string;
  sold: boolean;
  showcase: boolean;
}

const snapshotOf = (car?: Car): Snapshot => ({
  brand: car?.brand ?? '',
  model: car?.model ?? '',
  variant: car?.variant ?? '',
  year: car ? String(car.year) : '',
  price: car ? String(car.price) : '',
  body: car?.body ?? 'Hatchback',
  fuel: car?.fuel ?? 'Petrol',
  km_driven: car ? String(car.kmDriven) : '',
  owners: String(car?.owners ?? 1),
  transmission: car?.transmission ?? 'Manual',
  mileage: car?.mileage != null ? String(car.mileage) : '',
  registration: car?.registration ?? '',
  tag: car?.tag ?? '',
  sold: car?.sold ?? false,
  showcase: car?.showcase ?? false,
});

export default function CarForm({
  action,
  car,
  submitLabel = 'Save car',
}: {
  action: (prev: CarFormState, formData: FormData) => Promise<CarFormState>;
  car?: Car;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<CarFormState, FormData>(
    action,
    {},
  );

  // The fields stay uncontrolled — React never touches the caret, and the
  // form still submits as plain FormData. One handler on the <form> reads
  // the whole thing back out whenever anything changes, which is all the
  // preview needs.
  const [snap, setSnap] = useState<Snapshot>(() => snapshotOf(car));
  const [photos, setPhotos] = useState<string[]>(car?.photos ?? []);

  const sync = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '');
    setSnap({
      brand: get('brand'),
      model: get('model'),
      variant: get('variant'),
      year: get('year'),
      price: get('price'),
      body: get('body'),
      fuel: get('fuel'),
      km_driven: get('km_driven'),
      owners: get('owners'),
      transmission: get('transmission'),
      mileage: get('mileage'),
      registration: get('registration'),
      tag: get('tag'),
      sold: data.get('sold') === 'on',
      showcase: data.get('showcase') === 'on',
    });
  };

  const preview: Car = {
    id: car?.id ?? 'preview',
    slug: car?.slug ?? '',
    // Before anything is typed the card still has to read like a card,
    // not like a form with holes in it.
    brand: snap.brand.trim(),
    model: snap.model.trim() || 'Your new car',
    variant: snap.variant.trim(),
    year: Number(snap.year) || MAX_YEAR - 1,
    price: Number(snap.price) || 0,
    body: (snap.body as BodyType) || 'Hatchback',
    fuel: (snap.fuel as Fuel) || 'Petrol',
    kmDriven: Number(snap.km_driven) || 0,
    owners: Number(snap.owners) || 1,
    transmission: snap.transmission || 'Manual',
    mileage: snap.mileage ? Number(snap.mileage) : null,
    registration: snap.registration.trim() || null,
    tag: (snap.tag as Tag) || undefined,
    sold: snap.sold,
    showcase: snap.showcase,
    sortOrder: car?.sortOrder ?? 0,
    createdAt: car?.createdAt ?? '',
    photos,
    image: photos[0],
  };

  return (
    <form action={formAction} onChange={sync} className="mt-12 lg:mt-14">
      {/* On a phone the preview rides at the top as a strip, so the first
          field is still a thumb-flick away. */}
      <div className="lg:hidden">
        <ListingPreviewBar car={preview} />
      </div>

      <div className="mt-11 grid gap-x-12 lg:mt-0 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0 space-y-11">
          <Block
            title="Photos"
            note="The first one is the cover. Front three-quarter usually wins."
          >
            <PhotoUploader initial={car?.photos ?? []} onChange={setPhotos} />
          </Block>

          <Block title="The car">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Brand"
                name="brand"
                defaultValue={car?.brand}
                required
                placeholder="Maruti Suzuki"
                autoComplete="off"
              />
              <TextField
                label="Model"
                name="model"
                defaultValue={car?.model}
                required
                placeholder="Swift"
                autoComplete="off"
              />
              <TextField
                label="Variant"
                name="variant"
                optional
                defaultValue={car?.variant}
                placeholder="ZXi+"
                hint="On the boot lid, or in the RC."
                autoComplete="off"
                className="sm:col-span-2"
              />
              <SelectField
                label="Year"
                name="year"
                defaultValue={car ? String(car.year) : ''}
                placeholder="Select the year"
                required
                options={YEARS}
              />
              <SelectField
                label="Body style"
                name="body"
                defaultValue={car?.body ?? 'Hatchback'}
                options={BODIES}
              />
            </div>
          </Block>

          <Block
            title="Condition"
            note="The numbers every buyer checks before anything else."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Kilometres driven"
                name="km_driven"
                type="number"
                min={0}
                defaultValue={car?.kmDriven}
                required
                suffix="km"
                placeholder="31200"
                inputMode="numeric"
                className="no-spin"
              />
              <SelectField
                label="Owners"
                name="owners"
                defaultValue={String(car?.owners ?? 1)}
                options={OWNERS}
              />
              <SelectField
                label="Fuel"
                name="fuel"
                defaultValue={car?.fuel ?? 'Petrol'}
                options={FUELS}
              />
              <SelectField
                label="Transmission"
                name="transmission"
                defaultValue={car?.transmission ?? 'Manual'}
                options={GEARBOXES}
              />
              <TextField
                label="Mileage"
                name="mileage"
                optional
                type="number"
                step="0.1"
                min={0}
                defaultValue={car?.mileage ?? ''}
                suffix="kmpl"
                placeholder="22.4"
                className="no-spin"
              />
              <TextField
                label="Registration"
                name="registration"
                optional
                defaultValue={car?.registration ?? ''}
                placeholder="KA-03"
                hint="The RTO code from the number plate."
                autoComplete="off"
              />
            </div>
          </Block>

          <Block
            title="Price"
            note="What you are asking. The monthly EMI on the website is worked out from this."
          >
            <TextField
              label="Asking price"
              name="price"
              type="number"
              min={0}
              step={1000}
              defaultValue={car?.price}
              required
              prefix="₹"
              placeholder="725000"
              hint="In full rupees — 725000, not 7.25."
              inputMode="numeric"
              className="no-spin sm:max-w-xs"
            />
          </Block>

          <Block
            title="On the website"
            note="How this car sits among the others. Both are optional."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Badge"
                name="tag"
                defaultValue={car?.tag ?? ''}
                options={TAGS}
              />
              <TextField
                label="Position in the list"
                name="sort_order"
                type="number"
                defaultValue={car?.sortOrder ?? 0}
                hint="Lower numbers come first. Leave it at 0 if you do not mind."
                className="no-spin"
              />
            </div>

            <div className="mt-6 space-y-3">
              <Switch
                name="showcase"
                defaultChecked={car?.showcase}
                title="Lead the home page with this car"
                note="The large panel visitors meet first, with the photograph turning as they scroll. Only one car can hold it, so choosing this takes it from whichever car has it now."
              />
              <Switch
                name="sold"
                defaultChecked={car?.sold}
                title="This car has been sold"
                note="It comes off the website straight away, and stays in your list here so you keep the record."
              />
            </div>
          </Block>
        </div>

        {/* Laptop — the preview rides alongside. */}
        <aside className="hidden lg:block">
          <ListingPreview car={preview} />
        </aside>
      </div>

      {/* ---------------- Save ---------------- */}
      <div className="sticky bottom-0 z-30 -mx-6 mt-12 border-t border-line bg-paper-100/90 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 backdrop-blur-xl">
        {state.error && (
          <p
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-danger-line bg-danger-wash px-4 py-3 text-[13px] leading-relaxed text-danger-ink"
          >
            <AlertCircle className="mt-px h-4 w-4 shrink-0" strokeWidth={1.8} />
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium disabled:cursor-wait disabled:opacity-60 enabled:hover:scale-[1.02] sm:flex-none sm:py-3.5"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.8} />
                {submitLabel}
              </>
            )}
          </button>
          <Link
            href="/admin"
            className="rounded-full px-5 py-4 text-sm text-stone-600 transition-colors duration-300 hover:text-ink-900 sm:py-3.5"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

/**
 * A choice that is on or off.
 *
 * The browser's own checkbox is a bright grey square — the one thing on this
 * screen that would look borrowed — so this is the same mark the public
 * forms use, with the whole row as the target.
 */
function Switch({
  name,
  defaultChecked,
  title,
  note,
}: {
  name: string;
  defaultChecked?: boolean;
  title: string;
  note: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors duration-300 hover:border-line-strong">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border border-line-strong transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper"
      >
        <Check
          className="h-3 w-3 text-ink-900 opacity-0 transition-opacity duration-200"
          strokeWidth={3}
        />
      </span>
      <span>
        <span className="block text-[15px] text-ink-900">{title}</span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-stone-600">
          {note}
        </span>
      </span>
    </label>
  );
}
