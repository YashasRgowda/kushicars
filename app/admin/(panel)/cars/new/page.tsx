import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { createCar } from '@/app/admin/cars/actions';
import CarForm from '@/components/admin/CarForm';

export const dynamic = 'force-dynamic';

export default async function NewCarPage() {
  await requireUser();

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All cars
      </Link>

      <h1 className="mt-4 font-display text-3xl font-600 text-white">
        Add a car
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        It appears on the website as soon as you save.
      </p>

      <CarForm action={createCar} submitLabel="Add car" />
    </>
  );
}
