import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { getCarBySlug, getCars, getSettings, pickSimilar } from '@/lib/cars';
import { formatPrice } from '@/lib/format';
import { siteUrl } from '@/lib/site';
import { BUSINESS } from '@/lib/business';
import PageHeader from '@/components/PageHeader';
import CarCard from '@/components/CarCard';
import Gallery from '@/components/car/Gallery';
import SpecSheet from '@/components/car/SpecSheet';
import EnquiryPanel from '@/components/car/EnquiryPanel';
import { BreadcrumbJsonLd, CarJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

/** Comes with every car, at no extra cost. Stated on the listing so nobody
 *  has to ask whether the price includes the paperwork. */
const included = [
  '140-point inspection report, shared before you pay',
  'RC transfer handled end to end',
  '1-year engine and gearbox warranty',
  'Finance and insurance arranged in-house',
  'Free first service',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: 'Car not found' };

  const name = `${car.year} ${car.brand} ${car.model} ${car.variant}`.trim();
  const title = `${name} — ${formatPrice(car.price)}`;
  const description = `${name} for sale at Kushi Cars, ${BUSINESS.locality}, ${BUSINESS.city}. ${new Intl.NumberFormat('en-IN').format(car.kmDriven)} km, ${car.owners === 1 ? 'first owner' : `${car.owners} owners`}, ${car.fuel}, ${car.transmission}. Inspected, with RC transfer included.`;

  return {
    title,
    description,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: car.image ? [{ url: car.image, alt: name }] : undefined,
    },
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [car, cars, settings] = await Promise.all([
    getCarBySlug(slug),
    getCars(),
    getSettings(),
  ]);

  if (!car) notFound();

  const similar = pickSimilar(cars, car);
  const name = `${car.brand} ${car.model}`;
  const subtitle = [car.year, car.variant].filter(Boolean).join(' · ');

  return (
    <>
      <CarJsonLd car={car} settings={settings} siteUrl={siteUrl} />
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Cars', path: '/cars' },
          { name: name, path: `/cars/${car.slug}` },
        ]}
      />

      <PageHeader
        eyebrow={car.tag ?? 'In stock'}
        title={name}
        lede={subtitle}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cars', href: '/cars' },
          { label: car.model },
        ]}
        compact
      />

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[1.55fr_1fr]">
          <div className="min-w-0">
            {/* Not wrapped in a Reveal: this is the largest thing above the
                fold, and holding it at opacity 0 until an observer fires is
                the slowest possible first paint for the page's main image. */}
            <Gallery car={car} />

            {car.sold && (
              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-300">
                This one has been sold. We usually have something similar
                arriving — ask us what is coming in.
              </p>
            )}
          </div>

          {/* Sticky so the price and the buttons stay reachable while the
              specs scroll past. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <EnquiryPanel car={car} settings={settings} />
          </div>
        </div>
      </section>

      {/* ---------------- Specification ---------------- */}
      <section className="mx-auto mt-24 max-w-7xl px-6 lg:mt-32 lg:px-10">
        <div className="grid gap-x-14 gap-y-14 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-600 text-white">
              Specification
            </h2>
            <div className="mt-9">
              <SpecSheet car={car} />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-600 text-white">
              Included in the price
            </h2>
            <ul className="mt-9 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15">
                    <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- Similar ---------------- */}
      {similar.length > 0 && (
        <section className="mx-auto mt-28 max-w-7xl px-6 pb-32 lg:mt-40 lg:px-10 lg:pb-44">
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/[0.07] pt-14">
            <h2 className="font-display text-2xl font-600 text-white">
              You might also consider
            </h2>
            <Link
              href="/cars"
              className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
            >
              See all {cars.length} cars
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c, i) => (
              <CarCard key={c.id} car={c} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
