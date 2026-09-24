import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getCarById } from '@/lib/cars';
import { updateCar, deleteCar } from '@/app/admin/cars/actions';
import CarForm from '@/components/admin/CarForm';

export const dynamic = 'force-dynamic';

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();

  const { id } = await params;
  const car = await getCarById(id);
  if (!car) notFound();

  // Bind the id so the form only has to supply (prevState, formData).
  const action = updateCar.bind(null, id);
  const remove = deleteCar.bind(null, id);

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All cars
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-600 text-white">
            {car.brand} {car.model}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {car.year} · {car.variant || car.body}
          </p>
        </div>

        <form action={remove}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full border border-accent/30 px-4 py-2.5 text-sm text-accent-glow transition-colors hover:bg-accent/10"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </form>
      </div>

      <CarForm action={action} car={car} submitLabel="Save changes" />
    </>
  );
}
