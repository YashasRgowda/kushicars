'use client';

import { useActionState } from 'react';
import { Loader2, Save, Check } from 'lucide-react';
import { updateSettings, type SettingsState } from '@/app/admin/settings/actions';
import type { Settings } from '@/lib/types';

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateSettings,
    {},
  );

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-6">
      <Field label="Business name" required>
        <Input name="business_name" defaultValue={settings.businessName} required />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone" hint="Shown in the header and footer">
          <Input
            name="phone"
            type="tel"
            defaultValue={settings.phone ?? ''}
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field label="WhatsApp" hint="Number only, no spaces — e.g. 919876543210">
          <Input
            name="whatsapp"
            defaultValue={settings.whatsapp ?? ''}
            placeholder="919876543210"
          />
        </Field>
      </div>

      <Field label="Email">
        <Input
          name="email"
          type="email"
          defaultValue={settings.email ?? ''}
          placeholder="hello@bmcars.in"
        />
      </Field>

      <Field label="Address">
        <textarea
          name="address"
          rows={3}
          defaultValue={settings.address ?? ''}
          className={fieldCls}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Opening hours" hint="e.g. Mon–Sat, 9am – 8pm">
          <Input
            name="hours"
            defaultValue={settings.hours ?? ''}
            placeholder="Mon–Sat, 9am – 8pm"
          />
        </Field>
        <Field label="Google Maps link" hint="Optional — used by the Directions button">
          <Input
            name="map_url"
            type="url"
            defaultValue={settings.mapUrl ?? ''}
            placeholder="https://maps.app.goo.gl/…"
          />
        </Field>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-glow"
        >
          {state.error}
        </p>
      )}

      {state.ok && !pending && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <Check className="h-4 w-4" /> Saved. The website is updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-500 text-white shadow-glow transition-transform disabled:opacity-60 enabled:hover:scale-[1.03]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save details
          </>
        )}
      </button>
    </form>
  );
}

const fieldCls =
  'w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40';

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldCls} />;
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
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
