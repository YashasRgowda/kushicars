import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getAllCars } from '@/lib/cars';
import { PageTitle } from '@/components/admin/ui';
import CarList from '@/components/admin/CarList';

export const dynamic = 'force-dynamic';

export default async function AdminCarsPage() {
  // The real security boundary — not proxy.ts, not the layout.
  await requireUser();

  const cars = await getAllCars();

  return (
    <>
      <PageTitle
        eyebrow="Your showroom"
        title="Your cars"
        sub="Tap a car to change its details or photos."
        action={
          <Link
            href="/admin/cars/new"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03] sm:w-auto"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add a car
          </Link>
        }
      />

      <CarList cars={cars} />
    </>
  );
}
