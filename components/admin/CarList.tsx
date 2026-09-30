import Link from 'next/link';
import { ImageOff, Pencil, Plus } from 'lucide-react';
import { formatNumber, formatPrice } from '@/lib/format';
import { Rule } from './ui';
import type { Car } from '@/lib/types';

/**
 * The stock list, in two shapes.
 *
 * On a laptop it is a row per car: dense, scannable, price aligned down one
 * edge. On a phone it becomes a photograph with the name and price laid over
 * it — because the owner recognises his own cars by sight long before he
 * reads the model name, and because a 90px thumbnail beside three lines of
 * grey text is what makes a phone screen look cheap.
 *
 * Either way the whole card is the link. There is no small target to hit.
 */
export default function CarList({ cars }: { cars: Car[] }) {
  const forSale = cars.filter((c) => !c.sold);
  const sold = cars.filter((c) => c.sold);

  if (cars.length === 0) return <Empty />;

  return (
    <div className="mt-12 space-y-14">
      {forSale.length > 0 && <CarGroup label="On the website" cars={forSale} />}
      {sold.length > 0 && <CarGroup label="Sold" cars={sold} muted />}
    </div>
  );
}

function CarGroup({
  label,
  cars,
  muted = false,
}: {
  label: string;
  cars: Car[];
  muted?: boolean;
}) {
  return (
    <section>
      <Rule>
        {label} · {cars.length}
      </Rule>

      {/* Phone */}
      <ul className="mt-6 space-y-4 sm:hidden">
        {cars.map((car) => (
          <li key={car.id}>
            <CarTile car={car} muted={muted} />
          </li>
        ))}
      </ul>

      {/* Laptop */}
      <ul className="mt-6 hidden space-y-2.5 sm:block">
        {cars.map((car) => (
          <li key={car.id}>
            <CarRow car={car} muted={muted} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ==================================================================
   Phone — the photograph is the card
   ================================================================== */

function CarTile({ car, muted }: { car: Car; muted: boolean }) {
  return (
    <Link
      href={`/admin/cars/${car.id}`}
      className="group block overflow-hidden rounded-[1.4rem] border border-line bg-paper shadow-lift transition-transform duration-300 ease-premium active:scale-[0.985]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-300">
        {car.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.image}
            alt=""
            className={`h-full w-full object-cover ${
              muted ? 'opacity-50 grayscale' : ''
            }`}
          />
        ) : (
          <Plate model={car.model} />
        )}

        {/* Just enough shade under the type to keep it legible, and none
            higher up, so the car itself stays lit. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,5,7,0.92)_0%,rgba(4,5,7,0.45)_32%,transparent_62%)]"
        />

        <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-2">
          {car.showcase && !car.sold && (
            <Badge tone="feature" on="photo">
              Home page
            </Badge>
          )}
          {car.sold ? (
            <Badge tone="muted" on="photo">
              Sold
            </Badge>
          ) : (
            car.tag && (
              <Badge tone="accent" on="photo">
                {car.tag}
              </Badge>
            )
          )}
          {car.photos.length === 0 && (
            <Badge tone="warn" on="photo">
              No photos yet
            </Badge>
          )}
        </div>

        {/* The edit affordance. There is no hover on a phone, so it is
            always there — quiet, but never guessed at. */}
        <span className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md">
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span className="sr-only">Edit</span>
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-600 leading-tight text-ink-900">
              {car.brand} {car.model}
            </p>
            <p className="mt-1 truncate text-[12px] text-stone-700">
              {[car.year, car.variant || car.body].filter(Boolean).join(' · ')}
            </p>
          </div>
          <p className="shrink-0 whitespace-nowrap font-display text-xl font-600 tabular-nums text-ink-900">
            {formatPrice(car.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line-soft px-4 py-3">
        <span className="truncate text-[12px] text-stone-700">
          {`${formatNumber(car.kmDriven)} km · ${car.fuel} · ${car.transmission.split(' ')[0]}`}
        </span>
      </div>
    </Link>
  );
}

/* ==================================================================
   Laptop — a row per car
   ================================================================== */

function CarRow({ car, muted }: { car: Car; muted: boolean }) {
  const meta = [
    car.year,
    car.variant || car.body,
    `${formatNumber(car.kmDriven)} km`,
    car.fuel,
  ]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <Link
      href={`/admin/cars/${car.id}`}
      className="group flex items-center gap-5 rounded-2xl border border-line bg-paper p-3.5 transition-all duration-300 ease-premium hover:-translate-y-px hover:border-line-strong hover:bg-paper-50 hover:shadow-lift"
    >
      <span className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-xl bg-paper-300">
        {car.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.image}
            alt=""
            className={`h-full w-full object-cover ${
              muted ? 'opacity-45 grayscale' : ''
            }`}
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-stone-300">
            <ImageOff className="h-5 w-5" strokeWidth={1.4} />
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`font-display text-lg font-600 leading-tight ${
              muted ? 'text-stone-700' : 'text-ink-900'
            }`}
          >
            {car.brand} {car.model}
          </span>
          {car.showcase && !car.sold && <Badge tone="feature">Home page</Badge>}
          {car.sold ? (
            <Badge tone="muted">Sold</Badge>
          ) : (
            car.tag && <Badge tone="accent">{car.tag}</Badge>
          )}
          {car.photos.length === 0 && <Badge tone="warn">No photos</Badge>}
        </span>
        <span className="mt-1.5 block truncate text-[13px] text-stone-600">
          {meta}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span
          className={`block whitespace-nowrap font-display text-lg font-600 tabular-nums ${
            muted ? 'text-stone-700' : 'text-ink-900'
          }`}
        >
          {formatPrice(car.price)}
        </span>
      </span>

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-stone-600 transition-all duration-300 ease-premium group-hover:border-accent group-hover:bg-accent group-hover:text-white">
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
        <span className="sr-only">Edit</span>
      </span>
    </Link>
  );
}

/* ==================================================================
   Pieces
   ================================================================== */

function Badge({
  tone,
  on = 'panel',
  children,
}: {
  tone: 'accent' | 'muted' | 'warn' | 'feature';
  on?: 'panel' | 'photo';
  children: React.ReactNode;
}) {
  const tones = {
    photo: {
      accent: 'bg-accent text-white shadow-sm',
      muted: 'bg-black/60 text-white backdrop-blur-md',
      warn: 'bg-amber-400 text-amber-950',
      feature: 'bg-gold text-ink-900 shadow-sm',
    },
    panel: {
      accent: 'bg-accent-wash text-accent-ink',
      muted: 'bg-paper-300 text-stone-700',
      warn: 'bg-amber-50 text-amber-700',
      feature: 'bg-gold-wash text-gold-ink',
    },
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${tones[on][tone]}`}
    >
      {children}
    </span>
  );
}

/** Stands in for a photograph that has not been taken yet. */
function Plate({ model }: { model: string }) {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#f8f5ec_0%,#e6dcc4_55%,#f1ead8_100%)]">
      <div
        aria-hidden
        className="absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[70px]"
      />
      <div className="absolute inset-0 grid place-items-center px-8 pb-12 text-center">
        <span className="font-display text-3xl font-600 leading-none text-ink-900/[0.11]">
          {model}
        </span>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-line px-8 py-20 text-center sm:py-24">
      <p className="font-display text-2xl font-600 text-ink-900">
        Your floor is empty
      </p>
      <p className="mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-stone-700">
        Add your first car and it appears on the website the moment you save
        it. Photos can come later.
      </p>
      <Link
        href="/admin/cars/new"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add a car
      </Link>
    </div>
  );
}
