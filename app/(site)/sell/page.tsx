import type { Metadata } from 'next';
import { BadgeIndianRupee, ClipboardCheck, FileCheck2, HandCoins } from 'lucide-react';
import { siteUrl } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import SellWizard from '@/components/sell/SellWizard';
import { Reveal } from '@/components/ui/motion';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Sell Your Car in Bengaluru — Free Valuation',
  description:
    'Sell your car to Kushi Cars, Nagarbhavi. Free inspection, a firm offer the same day, payment before the car leaves, and we handle the RC transfer and any outstanding loan.',
  alternates: { canonical: '/sell' },
};

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Tell us about the car',
    body: 'Four short screens. The paperwork questions matter more than they look — they are what let us quote accurately instead of low.',
    meta: 'About 3 minutes',
  },
  {
    icon: HandCoins,
    title: 'We inspect it, free',
    body: 'At the Nagarbhavi showroom, or we come to you anywhere in west Bengaluru. Around 40 minutes, and you watch the whole thing.',
    meta: 'No obligation',
  },
  {
    icon: BadgeIndianRupee,
    title: 'A firm offer, on the spot',
    body: 'Not a range, not "subject to". One number, explained — including what we marked it down for, if we did.',
    meta: 'Same day',
  },
  {
    icon: FileCheck2,
    title: 'Paid, and the paperwork done',
    body: 'Payment before the car leaves your hands. We close any running loan directly with the bank and file the RC transfer ourselves.',
    meta: 'RC transfer included',
  },
];

export default function SellPage() {
  return (
    <>
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Sell your car', path: '/sell' },
        ]}
      />

      <PageHeader
        eyebrow="Sell your car"
        title="Get a straight price for your car"
        lede="We buy as much as we sell. Tell us what you have and we will inspect it free, make you a firm offer the same day, and handle the loan closure and RC transfer ourselves."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Sell your car' }]}
      />

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
        <div className="grid gap-x-8 gap-y-12 border-t border-white/[0.07] pt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div>
                <div className="flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-slate-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-lg font-600 text-white">
                  {s.title}
                </h2>
                <p className="mt-3 text-pretty text-[14px] leading-relaxed text-slate-400">
                  {s.body}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">
                  {s.meta}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- The form ---------------- */}
      <section className="mx-auto max-w-3xl px-6 pb-32 pt-24 lg:pb-44 lg:pt-32">
        <SellWizard />
      </section>
    </>
  );
}
