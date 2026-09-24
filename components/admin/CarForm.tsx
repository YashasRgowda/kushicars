'use client';

import { useActionState } from 'react';
import { Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import PhotoUploader from './PhotoUploader';
import type { CarFormState } from '@/app/admin/cars/actions';
import type { Car } from '@/lib/types';

const BODIES = ['Hatchback', 'Sedan', 'SUV', 'MUV'];
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const TAGS = ['', 'Fresh Arrival', 'Certified', 'Featured'];
const GEARBOXES = [
  'Manual',
  'Automatic',
  'AMT',
  'CVT Automatic',
  'DCT Automatic',
  'DSG Automatic',
];

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

  return (
    <form action={formAction} className="mt-8 space-y-8">
      <Section title="Photos">
        <PhotoUploader initial={car?.photos ?? []} />
      </Section>

      <Section title="The car">
        <Grid>
          <Field label="Brand" required>
            <Input name="brand" defaultValue={car?.brand} required
              placeholder="Maruti Suzuki" />
          </Field>
          <Field label="Model" required>
            <Input name="model" defaultValue={car?.model} required
              placeholder="Swift" />
          </Field>
          <Field label="Variant" hint="e.g. ZXi+, SX(O), GT TSI">
            <Input name="variant" defaultValue={car?.variant} placeholder="ZXi+" />
          </Field>
          <Field label="Year" required>
            <Input name="year" type="number" min={1990} max={2100}
              defaultValue={car?.year} required placeholder="2022" />
          </Field>
          <Field label="Body type" required>
            <Select name="body" defaultValue={car?.body ?? 'Hatchback'}>
              {BODIES.map((b) => <option key={b}>{b}</option>)}
            </Select>
          </Field>
          <Field label="Fuel" required>
            <Select name="fuel" defaultValue={car?.fuel ?? 'Petrol'}>
              {FUELS.map((f) => <option key={f}>{f}</option>)}
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title="Condition & price">
        <Grid>
          <Field label="Asking price" hint="In rupees — 725000, not 7.25" required>
            <Input name="price" type="number" min={0} step={1000}
              defaultValue={car?.price} required placeholder="725000" />
          </Field>
          <Field label="Km driven" required>
            <Input name="km_driven" type="number" min={0}
              defaultValue={car?.kmDriven} required placeholder="31200" />
          </Field>
          <Field label="Owners" required>
            <Input name="owners" type="number" min={1} max={10}
              defaultValue={car?.owners ?? 1} required />
          </Field>
          <Field label="Transmission" required>
            <Select name="transmission" defaultValue={car?.transmission ?? 'Manual'}>
              {GEARBOXES.map((g) => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Mileage" hint="kmpl — optional">
            <Input name="mileage" type="number" step="0.1" min={0}
              defaultValue={car?.mileage ?? ''} placeholder="22.4" />
          </Field>
          <Field label="Registration" hint="RTO code — optional">
            <Input name="registration" defaultValue={car?.registration ?? ''}
              placeholder="KA-03" />
          </Field>
        </Grid>
      </Section>

      <Section title="Listing">
        <Grid>
          <Field label="Badge" hint="Shown on the card — optional">
            <Select name="tag" defaultValue={car?.tag ?? ''}>
              {TAGS.map((t) => (
                <option key={t || 'none'} value={t}>{t || 'No badge'}</option>
              ))}
            </Select>
          </Field>
          <Field label="Order" hint="Lower numbers appear first">
            <Input name="sort_order" type="number" defaultValue={0} />
          </Field>
        </Grid>

        <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3">
          <input
            type="checkbox"
            name="sold"
            defaultChecked={car?.sold}
            className="h-4 w-4 accent-[#DC2626]"
          />
          <span className="text-sm text-slate-200">
            Mark as sold
            <span className="ml-2 text-xs text-slate-500">
              hides it from the website
            </span>
          </span>
        </label>
      </Section>

      {state.error && (
        <p role="alert"
          className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-glow">
          {state.error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 flex items-center gap-3 border-t border-white/8 bg-ink-950/90 px-5 py-4 backdrop-blur-xl">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-500 text-white shadow-glow transition-transform disabled:opacity-60 enabled:hover:scale-[1.03]"
        >
          {pending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> {submitLabel}</>
          )}
        </button>
        <Link href="/admin"
          className="rounded-full px-5 py-3 text-sm text-slate-400 transition-colors hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}

/* ---------- small presentational helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-500 uppercase tracking-[0.2em] text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Field({
  label, hint, required, children,
}: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-slate-300">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const fieldCls =
  'w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40';

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldCls} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldCls} cursor-pointer`} />;
}
