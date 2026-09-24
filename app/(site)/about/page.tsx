import type { Metadata } from 'next';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getCars, getSettings } from '@/lib/cars';
import { BUSINESS } from '@/lib/business';
import { siteUrl } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import Experience from '@/components/Experience';
import Testimonials from '@/components/Testimonials';
import { Reveal } from '@/components/ui/motion';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Kushi Cars — Used Car Dealer in Nagarbhavi',
  description:
    'Kushi Cars is a used car showroom in Nagarbhavi, Bengaluru, rated 4.8 across 44 Google reviews. How we buy, what we check, and what we hand over with the keys.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [cars, settings] = await Promise.all([getCars(), getSettings()]);

  return (
    <>
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <PageHeader
        eyebrow="About us"
        title="A showroom with its name on the door"
        lede="Kushi Cars has been selling pre-owned cars out of Nagarbhavi long enough that most of our business now walks in on someone else's recommendation. That only works one way: by not selling anybody a car we would not put our own family in."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* ---------------- Numbers ---------------- */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-10 gap-y-10 border-y border-white/[0.07] py-14 sm:grid-cols-3">
          <Stat
            value={BUSINESS.rating.toFixed(1)}
            label="Google rating"
            note={`${BUSINESS.reviewCount} reviews`}
            stars
          />
          <Stat
            value={String(cars.length)}
            label="Cars on the floor"
            note="Updated as stock moves"
          />
          <Stat value="140" label="Point inspection" note="Report shared before you pay" />
        </div>
      </section>

      {/* ---------------- The story ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 className="font-display text-display-sm font-600 leading-tight text-white">
              How we buy
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl space-y-6 text-pretty text-[17px] leading-relaxed text-slate-400">
              <p>
                Most of what is on our floor came from an owner in west
                Bengaluru who we met, whose service history we read, and whose
                car we drove before we bought it. We do not buy blind at
                auction, because a car nobody can tell you anything about is a
                car you end up apologising for later.
              </p>
              <p>
                Every car is checked on 140 points before it earns a place
                here — engine, gearbox, suspension, electricals, underbody and
                paint depth. The report goes to you in full, including whatever
                we found. If something needed fixing, it is fixed before
                delivery and the bill is ours, not yours.
              </p>
              <p>
                Then there is the part nobody enjoys: Form 29 and 30, the NOC
                if the car came from another state, the insurance transfer, and
                chasing the RTO until it lands. We file it, we follow it up,
                and we message you when it is done. It is included in the price
                because charging separately for it would be a strange way to
                say we stand behind the car.
              </p>
              <p className="text-slate-300">
                We are a showroom in Nagarbhavi with our name on the door.
                Sorting something out afterwards costs us less than a bad
                review — and that is the whole business model, honestly stated.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Experience />

      {/* ---------------- Where we work ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="border-t border-white/[0.07] pt-14">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
            Where our customers come from
          </h2>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-4xl text-pretty font-display text-2xl font-400 leading-snug text-slate-300 sm:text-3xl">
              {BUSINESS.servingAreas.join(' · ')}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 max-w-xl text-pretty leading-relaxed text-slate-500">
              Further out is fine too — people drive across the city for the
              right car. If you are selling, we will come to you anywhere in
              west Bengaluru.
            </p>
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* ---------------- Close ---------------- */}
      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10 lg:pb-44">
        <Reveal>
          <div className="hairline flex flex-col items-start gap-8 rounded-3xl bg-ink-900/50 px-8 py-14 backdrop-blur-sm sm:px-14 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-3xl font-600 text-white">
                Come and have a look
              </h2>
              <p className="mt-3 max-w-lg text-pretty leading-relaxed text-slate-400">
                {settings.hours ?? 'Open six days a week.'} Drop in without an
                appointment — the cars are all here.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/cars"
                className="rounded-full bg-platinum px-7 py-3.5 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                See the stock
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/12 px-7 py-3.5 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
              >
                Directions
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({
  value,
  label,
  note,
  stars = false,
}: {
  value: string;
  label: string;
  note: string;
  stars?: boolean;
}) {
  return (
    <Reveal>
      <div>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-5xl font-600 tabular-nums leading-none text-white">
            {value}
          </p>
          {stars && (
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
          )}
        </div>
        <p className="mt-5 text-[15px] text-slate-300">{label}</p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">
          {note}
        </p>
      </div>
    </Reveal>
  );
}
