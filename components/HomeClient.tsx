'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import Showcase from '@/components/Showcase';
import LatestArrivals from '@/components/home/LatestArrivals';
import SellBand from '@/components/home/SellBand';
import Experience from '@/components/Experience';
import FinanceCalculator from '@/components/FinanceCalculator';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import type { Brand, Car } from '@/lib/types';

/**
 * The home page's only piece of state is whether the intro curtain has
 * lifted — the hero holds its reveal until then.
 *
 * Everything else is now a real page. Cars link out to /cars/[slug], the
 * brand marquee links to a pre-filtered /cars, and the filter UI lives on
 * /cars where it has room. Site chrome comes from app/(site)/layout.tsx.
 */
export default function HomeClient({
  cars,
  brands,
}: {
  cars: Car[];
  brands: Brand[];
}) {
  const [ready, setReady] = useState(false);

  // The most expensive car in stock leads the showcase, unless one is tagged.
  const hero =
    cars.find((c) => c.tag === 'Featured' && c.image) ??
    [...cars].sort((a, b) => b.price - a.price)[0];

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Hero ready={ready} carCount={cars.length} brandCount={brands.length} />
      <BrandMarquee brands={brands} />
      {hero && <Showcase car={hero} />}
      <LatestArrivals cars={cars} />
      <SellBand />
      <Experience />
      <FinanceCalculator cars={cars} />
      <Testimonials />
      <FAQ />
    </>
  );
}
