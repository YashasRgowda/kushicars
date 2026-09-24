'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, Calendar, Gauge, UserRound, Cog } from 'lucide-react';
import type { Car } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { Magnetic } from './ui/motion';

/**
 * The set piece: one car, held on a pinned stage while the page scrolls
 * through it. The car turns on a real 3D plane, its callouts arrive on
 * planes of their own, and a reflection anchors it to a floor.
 *
 * Everything is driven off a single scroll progress value, so the sequence is
 * scrubbable — forwards and backwards — rather than a set of one-shot
 * triggers. That reversibility is what separates this from a fade-in.
 *
 * The stage is three fixed bands (title / car / price) measured in vh, so the
 * plate can never collide with the type on a short laptop screen.
 */
export default function Showcase({ car }: { car: Car }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Smoothing the driver removes the stepping you get from raw wheel deltas.
  const p = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 22,
    mass: 0.22,
  });

  // --- Car plate. Present from the first frame; the scroll drives the turn.
  const carRotateY = useTransform(p, [0, 0.3, 0.62, 1], [-26, 0, 10, 26]);
  const carRotateX = useTransform(p, [0, 0.3, 1], [11, 0, -7]);
  const carScale = useTransform(p, [0, 0.3, 0.7, 1], [0.88, 1, 1.02, 0.93]);
  const carY = useTransform(p, [0, 0.3, 1], [40, 0, -44]);
  const carOpacity = useTransform(p, [0, 0.9, 1], [1, 1, 0.35]);

  // --- Marque behind everything
  const wordScale = useTransform(p, [0, 1], [1.02, 1.38]);
  const wordX = useTransform(p, [0, 1], ['4%', '-4%']);
  const wordOpacity = useTransform(p, [0, 0.88, 1], [1, 1, 0]);

  // --- Type: the title hands over to the price at the halfway mark
  const headOpacity = useTransform(p, [0, 0.4, 0.52], [1, 1, 0]);
  const headY = useTransform(p, [0, 0.52], [0, -34]);
  const priceOpacity = useTransform(p, [0.52, 0.64, 0.94, 1], [0, 1, 1, 0]);
  const priceY = useTransform(p, [0.52, 0.64], [34, 0]);

  const glowScale = useTransform(p, [0, 0.4, 1], [0.75, 1.15, 0.8]);
  const railScale = useTransform(p, [0, 1], [0, 1]);

  const specs = [
    {
      icon: Calendar,
      label: 'Year',
      value: String(car.year),
      side: 'left' as const,
      top: '30%',
      at: 0.24,
    },
    {
      icon: Gauge,
      label: 'Odometer',
      value: `${formatNumber(car.kmDriven)} km`,
      side: 'left' as const,
      top: '56%',
      at: 0.32,
    },
    {
      icon: UserRound,
      label: 'Ownership',
      value: car.owners === 1 ? 'First owner' : `${car.owners} owners`,
      side: 'right' as const,
      top: '30%',
      at: 0.28,
    },
    {
      icon: Cog,
      label: 'Gearbox',
      value: car.transmission,
      side: 'right' as const,
      top: '56%',
      at: 0.36,
    },
  ];

  return (
    <section
      id="showcase"
      ref={ref}
      className="relative h-[300vh] scroll-mt-20 bg-ink-1000 lg:h-[340vh]"
      aria-label={`Featured vehicle: ${car.brand} ${car.model}`}
    >
      <div className="scene sticky top-0 h-dvh overflow-hidden">
        {/* Bloom behind the plate */}
        <motion.div
          aria-hidden
          style={{ scale: reduce ? 1 : glowScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.16] blur-[140px]"
        />

        {/* Marque, oversized and behind everything */}
        <motion.div
          aria-hidden
          style={{
            scale: reduce ? 1 : wordScale,
            x: reduce ? 0 : wordX,
            opacity: reduce ? 0.06 : wordOpacity,
          }}
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        >
          <span className="font-display text-[23vw] font-700 uppercase leading-none tracking-[-0.04em] text-white/[0.05]">
            {car.brand.split(' ')[0]}
          </span>
        </motion.div>

        {/* Band 1 — title */}
        <motion.div
          style={{ opacity: reduce ? 1 : headOpacity, y: reduce ? 0 : headY }}
          className="pointer-events-none absolute inset-x-0 top-24 z-20 px-6 text-center lg:top-28"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Featured Acquisition
          </p>
          <h2 className="mt-3 font-display text-display-sm font-600">
            <span className="chrome-text">{car.model}</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">{car.variant}</p>
        </motion.div>

        {/* Band 2 — the plate, sized off viewport height so it always fits */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            style={{
              rotateY: reduce ? 0 : carRotateY,
              rotateX: reduce ? 0 : carRotateX,
              scale: reduce ? 1 : carScale,
              y: reduce ? 0 : carY,
              opacity: reduce ? 1 : carOpacity,
              transformPerspective: 1500,
            }}
            className="preserve-3d relative"
          >
            <div // Below lg the plate can use the full width; from lg the callouts
              // flank it, so it is capped to leave them clearance on a narrow
              // desktop window.
              className="hairline relative h-[36vh] w-[min(88vw,57.6vh)] overflow-hidden rounded-2xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.95)] lg:w-[min(50vw,57.6vh)]">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model} ${car.variant}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#181c26_0%,#0b0d12_55%,#11141b_100%)]">
                  <span className="font-display text-5xl text-white/15">
                    {car.model}
                  </span>
                </div>
              )}
              {/* Sheen across the glass */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.08)_48%,transparent_60%)]" />
            </div>

            {/* Reflection — the car sits on a surface, not in a void */}
            {car.image && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-[9vh] overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_78%)]"
              >
                <img
                  src={car.image}
                  alt=""
                  className="h-[36vh] w-full -translate-y-[27vh] scale-y-[-1] object-cover blur-[2px]"
                />
              </div>
            )}

            {/* Contact shadow on the floor */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 left-1/2 h-12 w-[76%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
            />
          </motion.div>
        </div>

        {/* Callouts, each on its own plane */}
        <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl px-10 lg:block">
          {specs.map((s) => (
            <Callout key={s.label} progress={p} disabled={!!reduce} {...s}>
              <s.icon className="h-4 w-4 text-accent" strokeWidth={1.6} />
            </Callout>
          ))}
        </div>

        {/* Band 3 — price and the way in */}
        <motion.div
          style={{ opacity: reduce ? 1 : priceOpacity, y: reduce ? 0 : priceY }}
          className="absolute inset-x-0 bottom-[7vh] z-20 flex flex-col items-center gap-5 px-6 text-center"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Asking price
            </p>
            <p className="mt-2 font-display text-5xl font-700 tabular-nums sm:text-6xl">
              <span className="chrome-text">{formatPrice(car.price)}</span>
            </p>
          </div>
          <Magnetic>
            <Link
              href={`/cars/${car.slug}`}
              className="group flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.04]"
            >
              View the full spec
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
        </motion.div>

        {/* Progress rail */}
        <div
          aria-hidden
          className="absolute right-8 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block"
        >
          <motion.div
            style={{ scaleY: railScale }}
            className="h-full w-full origin-top bg-gradient-to-b from-accent to-accent-glow"
          />
        </div>

        <div className="noise pointer-events-none absolute inset-0" />
      </div>
    </section>
  );
}

/**
 * A spec tag that flies in from its own side on a Z-offset plane, with a
 * hairline running back toward the car.
 */
function Callout({
  progress,
  label,
  value,
  side,
  top,
  at,
  disabled,
  children,
}: {
  progress: MotionValue<number>;
  label: string;
  value: string;
  side: 'left' | 'right';
  top: string;
  at: number;
  disabled: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(
    progress,
    [at - 0.08, at, 0.84, 0.94],
    [0, 1, 1, 0],
  );
  const x = useTransform(
    progress,
    [at - 0.08, at],
    [side === 'left' ? -50 : 50, 0],
  );
  const lineScale = useTransform(progress, [at, at + 0.06], [0, 1]);

  return (
    <motion.div
      style={{
        opacity: disabled ? 1 : opacity,
        x: disabled ? 0 : x,
        top,
        transform: 'translateZ(70px)',
      }}
      className={`absolute flex items-center gap-4 ${
        side === 'left' ? 'left-10 flex-row-reverse' : 'right-10'
      }`}
    >
      <motion.span
        style={{ scaleX: disabled ? 1 : lineScale }}
        className={`h-px w-12 bg-gradient-to-r from-accent/70 to-transparent ${
          side === 'left' ? 'origin-right' : 'origin-left'
        }`}
      />
      <div
        className={`glass hairline rounded-xl px-5 py-3.5 ${
          side === 'left' ? 'text-right' : ''
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            side === 'left' ? 'flex-row-reverse' : ''
          }`}
        >
          {children}
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
            {label}
          </span>
        </div>
        <p className="mt-1.5 whitespace-nowrap text-sm font-500 text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
