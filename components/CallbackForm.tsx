'use client';

import { useActionState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Settings } from '@/lib/types';
import { messages, waLink } from '@/lib/whatsapp';
import { submitEnquiry, type EnquiryState } from '@/app/(site)/actions';
import { Honeypot, TextField } from '@/components/form/fields';

/**
 * The callback request in the footer.
 *
 * The previous version opened WhatsApp and kept no record — if the customer
 * changed their mind at the WhatsApp screen, the lead was gone and the
 * showroom never knew it existed. This writes the enquiry first and then
 * offers the WhatsApp hand-off, so the lead survives either way.
 */
export default function CallbackForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    {},
  );
  if (state.ok) {
    // The action hands the answers back so the message can quote them —
    // by this point React has already reset the form.
    const s = state.submitted;
    const wa = waLink(
      settings,
      s
        ? `${messages.callback(settings.businessName, s.name, s.phone)}${
            s.message ? `\nLooking for: ${s.message}` : ''
          }`
        : messages.general(settings.businessName),
    );

    return (
      <div className="hairline flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/[0.03] p-10 text-center">
        <CheckCircle2 className="h-9 w-9 text-emerald-400" strokeWidth={1.25} />
        <p className="font-display text-2xl font-600 text-white">
          We will call you back
        </p>
        <p className="max-w-xs text-pretty text-sm leading-relaxed text-slate-400">
          Usually the same day. If you would rather not wait, message us
          directly — the showroom answers WhatsApp faster than the phone.
        </p>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
          >
            Message us now
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="relative flex flex-col justify-center gap-5">
      <Honeypot />
      <input type="hidden" name="kind" value="callback" />

      <TextField label="Your name" name="name" autoComplete="name" required placeholder="Ravi Kumar" />
      <TextField
        label="Phone number"
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        required
        prefix="+91"
        maxLength={10}
        placeholder="98450 00000"
      />
      <TextField
        label="What are you looking for?"
        name="message"
        optional
        placeholder="Automatic SUV under ₹15 lakh"
      />

      {state.error && <p className="text-[13px] text-accent-soft">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="group mt-1 flex items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? 'Sending…' : 'Request a callback'}
        {!pending && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1" />
        )}
      </button>
      <p className="text-center text-xs text-slate-500">
        No spam, and no follow-up calls you did not ask for.
      </p>
    </form>
  );
}
