'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import Link from 'next/link';
import { Gauge, UserRound, Cog, ArrowUpRight } from 'lucide-react';
import type { Car } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { monthlyFrom } from '@/lib/emi';
import { EASE } from './ui/motion';

const tagStyles: Record<string, string> = {
  'Fresh Arrival': 'bg-accent text-white',
  Featured: 'bg-platinum text-ink-950',
  Certified: 'bg-emerald-400 text-emerald-950',
};

const MotionLink = motion.create(Link);

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const reduce = useReducedMotion();

  // Pointer position (0..1) drives the tilt, the glare and the parallax.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 170, damping: 20, mass: 0.4 };

  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), spring);
  // The photo drifts against the tilt — the parallax that sells the depth.
  const imgX = useSpring(useTransform(px, [0, 1], [10, -10]), spring);
  const imgY = useSpring(useTransform(py, [0, 1], [8, -8]), spring);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(300px circle at ${glareX} ${glareY}, rgba(255,255,255,0.13), transparent 62%)`;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const lift = (z: number) =>
    reduce ? undefined : { transform: `translateZ(${z}px)` };

  return (
    <MotionLink
      layout
      href={`/cars/${car.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 34, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8%' }}
      exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
      transition={{
        duration: 0.75,
        ease: EASE,
        delay: Math.min(index * 0.07, 0.45),
      }}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 1200,
      }}
      aria-label={`${car.year} ${car.brand} ${car.model} ${car.variant}, ${formatPrice(car.price)}`}
      className="preserve-3d hairline group relative flex flex-col rounded-2xl bg-ink-850/70 text-left shadow-lift backdrop-blur-sm transition-shadow duration-500 ease-premium hover:shadow-lift-accent"
    >
      {/* Photo */}
      <div className="relative z-10 overflow-hidden rounded-t-2xl">
        <div className="aspect-[16/10] w-full">
          {car.image ? (
            <motion.img
              src={car.image}
              alt={`${car.brand} ${car.model} ${car.variant}`}
              loading="lazy"
              style={{ x: reduce ? 0 : imgX, y: reduce ? 0 : imgY }}
              // Oversized so the parallax drift never exposes an edge
              className="h-full w-full scale-[1.08] object-cover transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.16]"
            />
          ) : (
            <PhotoPlate car={car} />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/10 to-transparent" />
        {/* Light rakes across the glass on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.14)_50%,transparent_62%)] transition-transform duration-[1100ms] ease-premium group-hover:translate-x-full" />
      </div>

      {/* Floating overlays — these sit forward of the card surface */}
      {car.tag && (
        <span
          style={lift(46)}
          className={`pointer-events-none absolute left-4 top-4 z-20 rounded-full px-3 py-1 text-[10px] font-600 uppercase tracking-[0.14em] shadow-lg ${tagStyles[car.tag]}`}
        >
          {car.tag}
        </span>
      )}

      <span
        style={lift(30)}
        className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-200 backdrop-blur-md"
      >
        {car.body} · {car.fuel}
      </span>

      {/* Body */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {car.brand}
              {car.registration && (
                <>
                  <span className="h-0.5 w-0.5 rounded-full bg-slate-600" />
                  {car.registration}
                </>
              )}
            </div>
            <h3 className="mt-2 font-display text-xl font-600 leading-tight text-white">
              {car.model}
            </h3>
            <p className="mt-1 truncate text-xs text-slate-400">
              {car.year} · {car.variant}
            </p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-500 transition-all duration-300 ease-premium group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* The three things a used-car buyer actually asks */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/[0.08] py-4">
          <Spec
            icon={<Gauge className="h-4 w-4" strokeWidth={1.5} />}
            value={formatNumber(car.kmDriven)}
            label="km driven"
          />
          <Spec
            icon={<UserRound className="h-4 w-4" strokeWidth={1.5} />}
            value={`${car.owners}`}
            label={car.owners === 1 ? 'owner' : 'owners'}
          />
          <Spec
            icon={<Cog className="h-4 w-4" strokeWidth={1.5} />}
            value={car.transmission.split(' ')[0]}
            label="gearbox"
          />
        </div>

        {/* The price owns this row on its own. Sharing it with a button
            forced "₹19.50 Lakh" onto two lines in a three-up grid, which is
            the one number on the card that must never wrap. The arrow at the
            top right is the affordance — the whole card is a link anyway. */}
        <div style={lift(24)} className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Asking price
            </p>
            <p className="mt-1.5 whitespace-nowrap font-display text-2xl font-600 tabular-nums text-white">
              {formatPrice(car.price)}
            </p>
          </div>

          {/* Most buyers here finance, so the monthly figure is what they
              actually compare cars on. */}
          <div className="shrink-0 text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
              EMI from
            </p>
            <p className="mt-1.5 whitespace-nowrap font-mono text-sm tabular-nums text-slate-300">
              ₹{formatNumber(monthlyFrom(car.price))}
              <span className="text-slate-600">/mo</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cursor-following glare, above everything */}
      <motion.div
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </MotionLink>
  );
}

/**
 * Stand-in until the dealer's own photography lands. A typographic plate
 * reads as deliberate; a stock photo of the wrong car reads as broken.
 */
function PhotoPlate({ car }: { car: Car }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#181c26_0%,#0b0d12_55%,#11141b_100%)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:4px_4px]"
      />
      <div
        aria-hidden
        className="absolute -right-8 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/10 blur-[70px]"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <span className="font-display text-4xl font-600 leading-none text-white/[0.13] transition-colors duration-500 group-hover:text-white/25">
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
      <span className="text-sm font-600 tabular-nums text-white">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
    </div>
  );
}
