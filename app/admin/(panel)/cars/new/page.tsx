import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createCar } from '@/app/admin/cars/actions';
import CarForm from '@/components/admin/CarForm';
import { PageTitle } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function NewCarPage() {
  await requireUser();

  return (
    <>
      <Link
        href="/admin"
        className="group mb-10 inline-flex items-center gap-2 text-[13px] text-stone-600 transition-colors duration-300 hover:text-ink-900"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 ease-premium group-hover:-translate-x-0.5"
          strokeWidth={1.8}
        />
        All cars
      </Link>

      <PageTitle
        eyebrow="New listing"
        title="Add a car"
        sub="It goes live on the website the moment you save. Only the starred fields are needed — the rest can wait."
      />

      <CarForm action={createCar} submitLabel="Add this car" />
    </>
  );
}
