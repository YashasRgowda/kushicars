import Link from 'next/link';
import { Plus, Pencil, ImageOff } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getAllCars } from '@/lib/cars';
import { formatPrice, formatNumber } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminCarsPage() {
  // The real security boundary — not proxy.ts, not the layout.
  await requireUser();

  const cars = await getAllCars();
  const forSale = cars.filter((c) => !c.sold);
  const sold = cars.filter((c) => c.sold);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-600 text-white">
            Your cars
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {forSale.length} for sale
            {sold.length > 0 && ` · ${sold.length} sold`}
          </p>
        </div>

        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-500 text-white shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" /> Add a car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 py-20 text-center">
          <p className="text-slate-300">No cars yet.</p>
          <Link
            href="/admin/cars/new"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm text-white"
          >
            Add your first car
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-2.5">
          {cars.map((car) => (
            <li key={car.id}>
              <Link
                href={`/admin/cars/${car.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-ink-800/50 p-3 transition-colors hover:border-white/20 hover:bg-ink-800"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink-700">
                  {car.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={car.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-slate-600">
                      <ImageOff className="h-5 w-5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-600 text-white">
                      {car.brand} {car.model}
                    </span>
                    {car.sold && (
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-600 uppercase tracking-wider text-slate-300">
                        Sold
                      </span>
                    )}
                    {car.tag && !car.sold && (
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-600 uppercase tracking-wider text-accent-glow">
                        {car.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {car.year} · {car.variant || car.body} ·{' '}
                    {formatNumber(car.kmDriven)} km · {car.fuel}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-600 text-white">
                    {formatPrice(car.price)}
                  </p>
                  <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-slate-500 transition-colors group-hover:text-accent">
                    <Pencil className="h-3 w-3" /> Edit
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
