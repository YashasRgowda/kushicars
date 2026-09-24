import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { brandsFrom, getCars } from '@/lib/cars';

// Always fetch fresh — the owner expects a new car to appear immediately.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const cars = await getCars();
  const brands = brandsFrom(cars);

  return <HomeClient cars={cars} brands={brands} />;
}
