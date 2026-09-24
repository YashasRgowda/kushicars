'use client';

import { useActionState, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import type { Car, Settings } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { monthlyFrom } from '@/lib/emi';
import { messages, telHref, waLink } from '@/lib/whatsapp';
import { SLOT_OPTIONS } from '@/lib/sell';
import { submitEnquiry, type EnquiryState } from '@/app/(site)/actions';
import { EASE } from '@/components/ui/motion';
import { Honeypot, SelectField, TextField } from '@/components/form/fields';

/**
 * The sticky column on a listing: price, then the three ways to act on it.
 *
 * WhatsApp comes first because that is how this dealership's customers
 * actually make contact. The form exists for the people who would rather not
 * start a conversation at 11 at night.
 */
export default function EnquiryPanel({
  car,
  settings,
}: {
  car: Car;
  settings: Settings;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    {},
  );

  const label = `${car.year} ${car.brand} ${car.model} ${car.variant}`.trim();
  const wa = waLink(settings, messages.car(settings.businessName, label, formatPrice(car.price)));

  return (
    <div className="hairline rounded-2xl bg-ink-850/60 p-7 backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Asking price
      </p>
      <p className="mt-2 font-display text-4xl font-600 tabular-nums leading-none text-white">
        {formatPrice(car.price)}
      </p>
      <p className="mt-3 text-[13px] text-slate-400">
        Roughly{' '}
        <span className="tabular-nums text-white">
          ₹{formatNumber(monthlyFrom(car.price))}
        </span>{' '}
        a month on a five-year loan at 12.5%, with 20% down.
      </p>

      <div className="mt-7 space-y-2.5">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            Ask about this car on WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full rounded-full border border-white/12 px-6 py-4 text-sm text-slate-200 transition-colors duration-300 hover:border-white/30 hover:text-white"
        >
          {open ? 'Hide the form' : 'Book a test drive'}
        </button>

        {settings.phone && (
          <a
            href={telHref(settings.phone)}
            className="flex w-full items-center justify-center gap-2.5 py-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            <span className="tabular-nums">{settings.phone}</span>
          </a>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-7 border-t border-white/[0.08] pt-7">
              {state.ok ? (
                <Done reference={state.ref} />
              ) : (
                <form action={formAction} className="relative space-y-4">
                  <Honeypot />
                  <input type="hidden" name="kind" value="test_drive" />
                  <input type="hidden" name="car_id" value={car.id} />
                  <input type="hidden" name="car_label" value={label} />

                  <TextField
                    label="Your name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="As it should appear on the paperwork"
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
                  <SelectField
                    label="When suits you?"
                    name="preferred_slot"
                    defaultValue=""
                    placeholder="Pick a time"
                    options={[...SLOT_OPTIONS]}
                  />

                  {state.error && (
                    <p className="text-[13px] text-accent-soft">{state.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-platinum px-6 py-3.5 text-sm font-500 text-ink-950 transition-all duration-300 ease-premium hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? 'Sending…' : 'Request a test drive'}
                  </button>
                  <p className="text-[12px] leading-relaxed text-slate-500">
                    We will call to confirm before you travel. Bring your licence —
                    you can take it onto the Outer Ring Road, not just around the block.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Done({ reference }: { reference?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="text-center"
    >
      <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" strokeWidth={1.5} />
      <p className="mt-4 font-display text-xl font-600 text-white">
        We have your request
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
        Someone will call you to fix a time. If it is urgent, WhatsApp us — that
        is the fastest way to reach the showroom.
      </p>
      {reference && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600">
          Ref {reference}
        </p>
      )}
    </motion.div>
  );
}
