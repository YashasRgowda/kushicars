import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Phone } from 'lucide-react';
import { getSettings } from '@/lib/cars';
import { telHref } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/motion';
import WhatsAppHandoff from '@/components/sell/WhatsAppHandoff';

export const metadata: Metadata = {
  title: 'We have your details',
  // Nothing here should ever reach a search result.
  robots: { index: false, follow: false },
};

/**
 * The page after a sell request.
 *
 * It used to do work: quote a reference number, and offer a WhatsApp button
 * that built the summary all over again from a copy of the answers kept in
 * sessionStorage. Both are gone. The details now reach WhatsApp from the
 * press itself, so by the time anybody reads this the message is already
 * open in front of them — and a reference number is for the showroom's
 * records, not for a seller who has just been told someone will ring.
 *
 * What is left is a confirmation and what happens next.
 */
const next = [
  {
    when: 'Within a few working hours',
    what: 'One of us calls to confirm the details and fix a time.',
  },
  {
    when: 'At the inspection',
    what: 'About 40 minutes, at the showroom or at your place. You watch the whole thing.',
  },
  {
    when: 'The same day',
    what: 'One firm price, with the reasoning behind it. No obligation to take it.',
  },
  {
    when: 'If you say yes',
    what: 'Payment before the car leaves you. We close any loan and file the RC transfer ourselves.',
  },
];

export default async function SellSuccessPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-32 pt-40 lg:pb-44 lg:pt-48">
      <Reveal>
        <CheckCircle2 className="h-11 w-11 text-accent-soft" strokeWidth={1.25} />
        <h1 className="mt-8 font-display text-display-sm font-600 leading-tight text-ink-900">
          We have your car.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-700">
          Thank you — the details are with us, and someone will call you.
        </p>

        {/* Clears the draft as well as offering the button. */}
        <WhatsAppHandoff />
      </Reveal>

      <section className="mt-20 border-t border-line-soft pt-14">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
          What happens next
        </h2>

        <ol className="mt-10 space-y-10">
          {next.map((n, i) => (
            <Reveal key={n.when} delay={i * 0.07}>
              <li className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <p className="text-[13px] leading-relaxed text-accent">{n.when}</p>
                <p className="text-pretty leading-relaxed text-stone-800">{n.what}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line-soft pt-10">
        {settings.phone && (
          <a
            href={telHref(settings.phone)}
            className="flex items-center gap-2.5 rounded-full border border-line px-6 py-3.5 text-sm text-stone-800 transition-colors hover:border-line-strong hover:text-ink-900"
          >
            <Phone className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <span className="tabular-nums">{settings.phone}</span>
          </a>
        )}
        <Link
          href="/cars"
          className="text-sm text-stone-700 underline-offset-4 transition-colors hover:text-ink-900 hover:underline"
        >
          Have a look at what we have in stock
        </Link>
      </div>
    </div>
  );
}
