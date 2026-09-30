import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { brandsFrom, getCars, pickShowcase } from '@/lib/cars';

// Always fetch fresh — the owner expects a new car to appear immediately.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const cars = await getCars();
  const brands = brandsFrom(cars);
  // Which car gets the feature panel is the owner's decision now, made on
  // the car itself in /admin. See pickShowcase().
  const hero = pickShowcase(cars);

  return <HomeClient cars={cars} brands={brands} hero={hero} />;
}
