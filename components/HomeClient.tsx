'use client';

import { useEffect, useState } from 'react';
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
  hero,
}: {
  cars: Car[];
  brands: Brand[];
  /** The car in the feature panel — chosen in the admin panel, worked out
   *  on the server by pickShowcase(). */
  hero: Car | null;
}) {
  const [ready, setReady] = useState(false);

  // Clicking the mark while already on this page asks the hero to open
  // again — see Navbar. Bumping this remounts only the hero's type block,
  // so the words replay without the film restarting under them.
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const again = () => setReplay((n) => n + 1);
    window.addEventListener('kushi:replay-hero', again);
    return () => window.removeEventListener('kushi:replay-hero', again);
  }, []);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Hero
        ready={ready}
        replayKey={replay}
        carCount={cars.length}
        brandCount={brands.length}
      />
      <BrandMarquee brands={brands} />
      {/* The monthly figure comes before the cars on purpose: almost everyone
          here buys on finance, so "what will it cost me a month" is the
          question being asked while they scroll, and the cars underneath are
          then read against an answer they already have. */}
      <FinanceCalculator cars={cars} />
      {hero && <Showcase car={hero} />}
      <LatestArrivals cars={cars} />
      <SellBand />
      <Experience />
      <Testimonials />
      <FAQ />
    </>
  );
}
