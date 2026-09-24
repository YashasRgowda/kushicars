import { Suspense } from 'react';
import type { Metadata } from 'next';
import { brandsFrom, getCars } from '@/lib/cars';
import { siteUrl } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import Browse from '@/components/inventory/Browse';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

// Stock changes on the floor; the page should never be stale.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Used Cars for Sale in Nagarbhavi, Bengaluru',
  description:
    'Browse every pre-owned car currently on the floor at Kushi Cars, Nagarbhavi. Filter by budget, brand, body style, fuel, kilometres and ownership. Inspected, priced honestly, RC transfer included.',
  alternates: { canonical: '/cars' },
};

export default async function CarsPage() {
  const cars = await getCars();
  const brands = brandsFrom(cars);

  return (
    <>
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Cars', path: '/cars' },
        ]}
      />

      <PageHeader
        eyebrow="The collection"
        title="Every car on the floor"
        lede={
          cars.length > 0
            ? `${cars.length} cars, each one inspected before it earned a place here. Filter down to what you actually want — the list updates as you go.`
            : 'Our floor is between shipments. Tell us what you are looking for and we will source it.'
        }
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Cars' }]}
      />

      {/* Browse reads its state from the URL, which needs a Suspense boundary. */}
      <Suspense fallback={<GridSkeleton />}>
        <Browse cars={cars} brands={brands} />
      </Suspense>
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
      <div className="grid gap-x-16 lg:grid-cols-[17rem_1fr]">
        <div className="hidden lg:block">
          <div className="h-[520px] rounded-2xl bg-white/[0.02]" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shimmer h-[420px] rounded-2xl border border-white/[0.06] bg-ink-850/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
