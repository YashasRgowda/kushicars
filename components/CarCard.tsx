'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gauge, UserRound, Cog, ArrowUpRight } from 'lucide-react';
import type { Car } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { monthlyFrom } from '@/lib/emi';
import { canOptimize } from '@/lib/photos';
import { EASE } from './ui/motion';

/* Three badges, three different things being said — so they get three
   different treatments rather than three shades of the same green, which is
   what they collapsed into when the brand colour changed.

   Gold is the distinction, brand green is the news, ink is the credential. */
const tagStyles: Record<string, string> = {
  Featured: 'bg-gold text-ink-900',
  'Fresh Arrival': 'bg-accent text-white',
  Certified: 'bg-ink-900/85 text-ivory backdrop-blur-md',
};

/**
 * One car in the grid.
 *
 * The photograph is shown whole — no zoom, no parallax, no tilt. An earlier
 * version scaled the image to 1.08 at rest and 1.16 on hover and drifted it
 * against a 3D tilt, which cut 8–16% off every edge and sliced the bumpers
 * and roofline off the cars. On a listing page the photograph IS the product;
 * nothing may crop it.
 *
 * Movement now lives in the card, not the picture: it lifts, its edge lights
 * up, and the arrow leans out. Quieter, and it survives whatever framing the
 * owner's own photographs arrive with.
 */
export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.06, 0.4) }}
    >
      <Link
        href={`/cars/${car.slug}`}
        aria-label={`${car.year} ${car.brand} ${car.model} ${car.variant}, ${formatPrice(car.price)}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
      >
        {/* ---------------- Photo ---------------- */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-300">
          {car.image ? (
            <Image
              src={car.image}
              alt={`${car.year} ${car.brand} ${car.model} ${car.variant}`}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
              unoptimized={!canOptimize(car.image)}
              className="object-cover"
            />
          ) : (
            <PhotoPlate car={car} />
          )}

          {/* Only as much shade as the badges need to stay readable. The old
              full-height gradient buried the wheels and the number plate. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent"
          />

          {car.tag && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-600 uppercase tracking-[0.14em] shadow-sm ${tagStyles[car.tag]}`}
            >
              {car.tag}
            </span>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {car.body} · {car.fuel}
          </span>
        </div>

        {/* ---------------- Details ---------------- */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-600">
                <span className="truncate">{car.brand}</span>
                {car.registration && (
                  <>
                    <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-stone-600" />
                    <span className="shrink-0">{car.registration}</span>
                  </>
                )}
              </div>
              <h3 className="mt-2 font-display text-xl font-600 leading-tight text-ink-900">
                {car.model}
              </h3>
              <p className="mt-1 truncate text-[13px] text-stone-700">
                {car.year}
                {car.variant ? ` · ${car.variant}` : ''}
              </p>
            </div>

            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-stone-600 transition-all duration-300 ease-premium group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>

          {/* The three things a used-car buyer asks first */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-y border-line-soft py-4">
            <Spec
              icon={<Gauge className="h-4 w-4" strokeWidth={1.5} />}
              value={formatNumber(car.kmDriven)}
              label="km driven"
            />
            <Spec
              icon={<UserRound className="h-4 w-4" strokeWidth={1.5} />}
              value={String(car.owners)}
              label={car.owners === 1 ? 'owner' : 'owners'}
            />
            <Spec
              icon={<Cog className="h-4 w-4" strokeWidth={1.5} />}
              value={car.transmission.split(' ')[0]}
              label="gearbox"
            />
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                Asking price
              </p>
              <p className="mt-1.5 whitespace-nowrap font-display text-2xl font-600 tabular-nums text-ink-900">
                {formatPrice(car.price)}
              </p>
            </div>
            {/* Most buyers here finance, so the monthly figure is what they
                actually compare cars on. */}
            <div className="shrink-0 text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                EMI from
              </p>
              <p className="mt-1.5 whitespace-nowrap font-mono text-sm tabular-nums text-stone-800">
                ₹{formatNumber(monthlyFrom(car.price))}
                <span className="text-muted">/mo</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Stand-in until the dealer's own photography lands. A typographic plate
 * reads as deliberate; a stock photo of the wrong car reads as broken.
 */
function PhotoPlate({ car }: { car: Car }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#f8f5ec_0%,#e6dcc4_55%,#f1ead8_100%)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgba(16,24,40,0.07)_1px,transparent_1px)] [background-size:4px_4px]"
      />
      <div
        aria-hidden
        className="absolute -right-8 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[70px]"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <span className="font-display text-4xl font-600 leading-none text-ink-900/[0.10]">
          {car.model}
        </span>
      </div>
    </div>
  );
}

function Spec({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-accent/80">{icon}</span>
      <span className="text-sm font-600 tabular-nums text-ink-900">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone-600">
        {label}
      </span>
    </div>
  );
}
