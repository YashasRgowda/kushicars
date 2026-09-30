'use client';

import { useActionState } from 'react';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';
import { updateSettings, type SettingsState } from '@/app/admin/settings/actions';
import { Section } from './ui';
import { TextArea, TextField } from '@/components/form/fields';
import type { Settings } from '@/lib/types';

/**
 * The details the owner might change on a Tuesday afternoon.
 *
 * Grouped the way he would say them out loud — who we are, how to reach us,
 * where we are — rather than in the order the database happens to store them.
 */
export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateSettings,
    {},
  );

  return (
    <form action={formAction} className="mt-16 space-y-12">
      <Section title="The business" note="The name shown on the door, and in the browser tab.">
        <TextField
          label="Business name"
          name="business_name"
          defaultValue={settings.businessName}
          required
          className="sm:max-w-sm"
        />
      </Section>

      <Section
        title="Reaching you"
        note="The phone number sits in the header of every page. The WhatsApp number is what every green button opens."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={settings.phone ?? ''}
            placeholder="+91 96863 35559"
            hint="Written exactly as you want it read."
          />
          <TextField
            label="WhatsApp"
            name="whatsapp"
            type="tel"
            defaultValue={settings.whatsapp ?? ''}
            placeholder="+91 96863 35559"
            hint="Usually the same number. Spaces and +91 are fine."
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            optional
            defaultValue={settings.email ?? ''}
            placeholder="kushicars@gmail.com"
            hint="Leave it empty and the website simply will not mention email."
            className="sm:col-span-2 sm:max-w-sm"
          />
        </div>
      </Section>

      <Section
        title="Finding you"
        note="Used by the contact page, the map and the Directions button."
      >
        <div className="space-y-5">
          <TextArea
            label="Address"
            name="address"
            rows={3}
            defaultValue={settings.address ?? ''}
            placeholder="19/1, Near BDA Complex, Marilingappa Extension, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Opening hours"
              name="hours"
              defaultValue={settings.hours ?? ''}
              placeholder="Mon–Sat 9:30 am – 8:00 pm"
              hint="One line, in your own words."
            />
            <TextField
              label="Google Maps link"
              name="map_url"
              type="url"
              optional
              defaultValue={settings.mapUrl ?? ''}
              placeholder="https://maps.app.goo.gl/…"
              hint="From Google Maps → Share. Optional."
            />
          </div>
        </div>
      </Section>

      {/* ---------------- Save ---------------- */}
      <div className="sticky bottom-0 z-30 -mx-6 border-t border-line bg-paper-100/90 px-6 pb-6 pt-5 backdrop-blur-xl">
        {state.error && (
          <p
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-danger-line bg-danger-wash px-4 py-3 text-[13px] leading-relaxed text-danger-ink"
          >
            <AlertCircle className="mt-px h-4 w-4 shrink-0" strokeWidth={1.8} />
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium disabled:cursor-wait disabled:opacity-60 enabled:hover:scale-[1.03]"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.8} />
                Save details
              </>
            )}
          </button>

          {state.ok && !pending && (
            <p className="flex items-center gap-2 text-[13px] text-accent-soft">
              <Check className="h-4 w-4" strokeWidth={2} />
              Saved. The website is already showing it.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
