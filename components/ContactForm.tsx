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
        className="hairline rounded-2xl bg-paper p-10 text-center shadow-card"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent-soft" strokeWidth={1.25} />
        <p className="mt-6 font-display text-2xl font-600 text-ink-900">
          Message received
        </p>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-stone-700">
          We will get back to you today if the showroom is open, and first
          thing tomorrow if it is not.
        </p>
        {state.ref && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
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
          placeholder="Enter your name"
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
          placeholder="Enter your number"
        />
      </div>

      <TextField label="Email" name="email" type="email" autoComplete="email" />

      <TextArea
        label="What are you after?"
        name="message"
        maxLength={1200}
        placeholder="Tell us what you are looking for"
        hint="The more specific you are, the more useful our reply will be."
      />

      {state.error && <p className="text-[13px] text-danger-ink">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
