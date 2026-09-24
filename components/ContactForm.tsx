'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { submitEnquiry, type EnquiryState } from '@/app/(site)/actions';
import { EASE } from '@/components/ui/motion';
import { Honeypot, TextArea, TextField } from '@/components/form/fields';

/**
 * The general enquiry form.
 *
 * Four fields. A contact form for a used-car showroom competes with a phone
 * number sitting right beside it, and every extra field loses people to the
 * phone — which is fine, but then the form may as well not exist.
 */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    {},
  );

  if (state.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="hairline rounded-2xl bg-ink-850/60 p-10 text-center backdrop-blur-sm"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" strokeWidth={1.25} />
        <p className="mt-6 font-display text-2xl font-600 text-white">
          Message received
        </p>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-slate-400">
          We will get back to you today if the showroom is open, and first
          thing tomorrow if it is not.
        </p>
        {state.ref && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600">
            Ref {state.ref}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="kind" value="general" />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Your name"
          name="name"
          autoComplete="name"
          required
          placeholder="Name"
        />
        <TextField
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          prefix="+91"
          maxLength={10}
          placeholder="98765 43210"
        />
      </div>

      <TextField label="Email" name="email" type="email" optional autoComplete="email" />

      <TextArea
        label="What are you after?"
        name="message"
        optional
        maxLength={1200}
        placeholder="Looking for an automatic hatchback under 8 lakh, first owner if possible…"
        hint="The more specific you are, the more useful our reply will be."
      />

      {state.error && <p className="text-[13px] text-accent-soft">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-platinum px-8 py-4 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
