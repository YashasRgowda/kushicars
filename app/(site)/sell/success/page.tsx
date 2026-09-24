import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Phone } from 'lucide-react';
import { getSettings } from '@/lib/cars';
import { telHref } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/motion';
import SuccessHandoff from '@/components/sell/SuccessHandoff';

export const metadata: Metadata = {
  title: 'We have your details',
  // Nothing here should ever reach a search result.
  robots: { index: false, follow: false },
};

const next = [
  {
    when: 'Within a few working hours',
    what: 'One of us calls you to confirm the details and fix a time for the inspection.',
  },
  {
    when: 'At the inspection',
    what: 'About 40 minutes, at the showroom or at your place. You watch the whole thing, and we tell you what we find as we find it.',
  },
  {
    when: 'The same day',
    what: 'A firm offer — one number, with the reasoning behind it. No obligation to take it.',
  },
  {
    when: 'If you say yes',
    what: 'Payment before the car leaves you. We close any running loan with the bank and file the RC transfer ourselves.',
  },
];

export default async function SellSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const [{ ref }, settings] = await Promise.all([searchParams, getSettings()]);
  const reference = ref ?? '—';

  return (
    <div className="mx-auto max-w-3xl px-6 pb-32 pt-40 lg:pb-44 lg:pt-48">
      <Reveal>
        <CheckCircle2 className="h-11 w-11 text-emerald-400" strokeWidth={1.25} />
        <h1 className="mt-8 font-display text-display-sm font-600 leading-tight text-white">
          We have your car.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-slate-400">
          Thank you — the details are with us. Keep this reference handy if you
          call; it saves you repeating everything.
        </p>

        <p className="mt-8 inline-flex items-baseline gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Reference
          </span>
          <span className="font-display text-xl font-600 tracking-wide text-white">
            {reference}
          </span>
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12">
          <SuccessHandoff settings={settings} reference={reference} />
        </div>
      </Reveal>

      {/* ---------------- What happens next ---------------- */}
      <section className="mt-24 border-t border-white/[0.07] pt-14">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
          What happens next
        </h2>

        <ol className="mt-10 space-y-10">
          {next.map((n, i) => (
            <Reveal key={n.when} delay={i * 0.07}>
              <li className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-8">
                <p className="text-[13px] leading-relaxed text-accent">{n.when}</p>
                <p className="text-pretty leading-relaxed text-slate-300">{n.what}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/[0.07] pt-10">
        {settings.phone && (
          <a
            href={telHref(settings.phone)}
            className="flex items-center gap-2.5 rounded-full border border-white/12 px-6 py-3.5 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
          >
            <Phone className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <span className="tabular-nums">{settings.phone}</span>
          </a>
        )}
        <Link
          href="/cars"
          className="text-sm text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Have a look at what we have in stock
        </Link>
      </div>
    </div>
  );
}
