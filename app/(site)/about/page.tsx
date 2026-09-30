import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, Check, Clock, MapPin, Phone, Star } from 'lucide-react';
import { getCars, getSettings } from '@/lib/cars';
import { BUSINESS, fullAddress } from '@/lib/business';
import { telHref } from '@/lib/whatsapp';
import { siteUrl } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import Experience from '@/components/Experience';
import Testimonials from '@/components/Testimonials';
import { Eyebrow, Reveal } from '@/components/ui/motion';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Kushi Cars — Used Car Dealer in Nagarbhavi',
  description:
    'Kushi Cars is a used car showroom in Nagarbhavi, Bengaluru, rated 4.8 across 44 Google reviews. How we buy, what we check, and what we hand over with the keys.',
  alternates: { canonical: '/about' },
};

/**
 * How we buy, as four claims rather than four paragraphs.
 *
 * This was prose — a good argument, honestly made, and nobody read it. A
 * customer deciding whether to trust a used-car dealer is scanning for
 * facts, not following reasoning, and four ticked lines answer the question
 * in the time they were willing to give it. Each line is one claim: what we
 * do, and then the detail that makes it credible.
 */
const HOW_WE_BUY = [
  {
    title: 'We buy from owners, not auctions',
    body: 'Almost every car here came from somebody in west Bengaluru we met, whose service book we read, and whose car we drove before we bought it.',
  },
  {
    title: '140 checks before it reaches the floor',
    body: 'Engine, gearbox, suspension, electricals, underbody and paint depth. You get the full report — including whatever we found.',
  },
  {
    title: 'What needs fixing is fixed first',
    body: 'Before delivery, and the bill is ours, not yours.',
  },
  {
    title: 'The paperwork is ours too',
    body: 'Forms 29 and 30, the NOC if the car came from another state, the insurance transfer, and the RTO chased until it lands. Included in the price.',
  },
];

export default async function AboutPage() {
  const [cars, settings] = await Promise.all([getCars(), getSettings()]);

  const address = settings.address ?? fullAddress();
  const directions =
    settings.mapUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

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
        lede="We sell pre-owned cars in Nagarbhavi, Bengaluru. Most of our customers come in because somebody they know sent them."
      />

      {/* ---------------- Numbers ---------------- */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-10 gap-y-10 border-y border-line-soft py-14 sm:grid-cols-3">
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

      {/* ---------------- How we buy ---------------- */}
      <section className="section-y mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-display-sm font-600 leading-tight text-ink-900">
                How we buy
              </h2>
              <p className="mt-5 max-w-sm text-pretty leading-relaxed text-stone-700">
                A car nobody can tell you anything about is a car you end up
                apologising for later. So we do not buy those.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="max-w-2xl space-y-7">
              {HOW_WE_BUY.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-wash">
                    <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[17px] leading-snug text-ink-900">{item.title}</p>
                    <p className="mt-1.5 text-pretty text-[15px] leading-relaxed text-stone-700">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-9 max-w-xl text-pretty text-[15px] leading-relaxed text-stone-800">
              We are a showroom in Nagarbhavi with our name on the door. Sorting
              something out afterwards costs us less than a bad review — that is
              the whole business model, honestly stated.
            </p>
          </Reveal>
        </div>
      </section>

      <Experience />

      {/* ---------------- Where we work ----------------

           The eight areas used to be one long serif line with middots
           between them, which is a paragraph wearing a list's clothes: you
           have to read to the end to find out whether your own area is in
           it. As chips each name is its own object, so the eye finds
           "Rajajinagar" without reading "Nagarbhavi".

           Nagarbhavi is filled rather than outlined because it is not a
           place we travel to — it is where the cars are, which is the one
           fact in this whole section somebody might act on today. */}
      <section className="section-y mx-auto max-w-7xl px-6 lg:px-10">
        <Eyebrow>Where we work</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="mt-7 max-w-2xl font-display text-display-sm font-600 leading-tight text-ink-900">
            All of west Bengaluru
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-700">
            Most of our customers come from these neighbourhoods. Further out is
            fine too — people drive across the city for the right car.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {BUSINESS.servingAreas.map((area) => {
              const home = area === BUSINESS.locality;
              return (
                <li key={area}>
                  {home ? (
                    <span className="inline-flex items-center gap-2.5 rounded-full bg-accent py-2 pl-3.5 pr-4 text-[15px] font-500 text-white shadow-lift-accent">
                      <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                      {area}
                      <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-white/75 sm:inline">
                        Our showroom
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-line bg-paper px-4 py-2 text-[15px] text-stone-800">
                      {area}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* The one line in this section that asks for something back. */}
        <Reveal delay={0.2}>
          <div className="mt-10 inline-flex items-start gap-3.5 rounded-2xl border border-line bg-paper px-5 py-4 shadow-card">
            <Car className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
            <p className="text-pretty text-[15px] leading-relaxed text-ink-900">
              Selling your car?{' '}
              <span className="text-stone-700">
                We come to you — anywhere in west Bengaluru.
              </span>
            </p>
          </div>
        </Reveal>
      </section>

      <Testimonials />

      {/* ---------------- Close ----------------

           The last thing on the page, so it carries the three facts somebody
           needs in order to actually turn up — where, when, and the number to
           ring — instead of a line of warmth and a pair of buttons. It is the
           one panel on this page with the gold edge: the palette keeps gold
           for ornament, and a closing invitation is where a flourish earns
           its place. */}
      <section className="section-y mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="hairline hairline-accent relative overflow-hidden rounded-3xl bg-paper px-8 py-12 shadow-lift sm:px-14 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold/[0.10] blur-[110px]"
            />
            <div className="noise pointer-events-none absolute inset-0" />

            <div className="relative grid gap-x-14 gap-y-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
              <div>
                <Eyebrow>Come and see us</Eyebrow>
                <h2 className="mt-6 font-display text-display-sm font-600 leading-tight text-ink-900">
                  Come and have a look
                </h2>
                <p className="mt-5 max-w-md text-pretty text-[17px] leading-relaxed text-stone-700">
                  No appointment needed. Every car is on the floor — drive
                  whatever you like, and bring your own mechanic if you want one.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/cars"
                    className="rounded-full bg-accent px-7 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
                  >
                    See the stock
                  </Link>
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-7 py-3.5 text-sm text-stone-800 transition-colors hover:border-line-strong hover:text-ink-900"
                  >
                    Get directions
                  </a>
                </div>
              </div>

              {/* Where, when, and the number — the three things somebody
                  actually needs before they get in the car. */}
              <dl className="space-y-6 lg:border-l lg:border-line-soft lg:pl-12">
                <Fact icon={MapPin} label="Where">
                  <span className="text-pretty">{address}</span>
                </Fact>
                {settings.hours && (
                  <Fact icon={Clock} label="Open">
                    {settings.hours}
                  </Fact>
                )}
                {settings.phone && (
                  <Fact icon={Phone} label="Call">
                    <a
                      href={telHref(settings.phone)}
                      className="tabular-nums transition-colors hover:text-accent"
                    >
                      {settings.phone}
                    </a>
                  </Fact>
                )}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
      <div className="min-w-0">
        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">
          {label}
        </dt>
        <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-900">{children}</dd>
      </div>
    </div>
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
          <p className="font-display text-5xl font-600 tabular-nums leading-none text-ink-900">
            {value}
          </p>
          {stars && (
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </span>
          )}
        </div>
        <p className="mt-5 text-[15px] text-stone-800">{label}</p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {note}
        </p>
      </div>
    </Reveal>
  );
}
