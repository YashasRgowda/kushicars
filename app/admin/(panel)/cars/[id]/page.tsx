import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getCarById } from '@/lib/cars';
import { updateCar, deleteCar } from '@/app/admin/cars/actions';
import CarForm from '@/components/admin/CarForm';
import DeleteCarButton from '@/components/admin/DeleteCarButton';
import { PageTitle } from '@/components/admin/ui';

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

  const name = `${car.brand} ${car.model}`;

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
        eyebrow={car.sold ? 'Sold · not on the website' : 'On the website'}
        title={name}
        sub={[car.year, car.variant || car.body].filter(Boolean).join(' · ')}
      />

      <CarForm action={action} car={car} submitLabel="Save changes" />

      {/* Below the save bar, deliberately: the last thing on the page, and
          the quietest thing on it. */}
      <div className="mt-14 border-t border-line-soft pt-8">
        <DeleteCarButton action={remove} name={name} />
      </div>
    </>
  );
}
