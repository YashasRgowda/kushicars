'use client';

import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { BUSINESS } from '@/lib/business';
import Counter from './Counter';
import { EASE, Magnetic } from './ui/motion';

export default function Hero({
  ready,
  carCount,
  brandCount,
}: {
  ready: boolean;
  carCount: number;
  brandCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Depth on exit: the plate sinks and swells while the type leaves faster.
  const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '46%']);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Pointer parallax — three layers at different rates reads as real depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const carX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const carY = useTransform(sy, [-0.5, 0.5], [-16, 16]);
  const glowX = useTransform(sx, [-0.5, 0.5], [48, -48]);
  const typeX = useTransform(sx, [-0.5, 0.5], [10, -10]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Everything downstream waits on the curtain, so the reveal is not spent
  // behind the preloader.
  const gate = ready ? 'show' : 'hidden';

  // The rating is the real one from the Google profile and is quoted in the
  // page's structured data too — see lib/business.ts. The other two move on
  // their own as the owner adds and sells cars.
  const stats = [
    { to: BUSINESS.rating, decimals: 1, suffix: '★', label: 'Google rating' },
    { to: BUSINESS.reviewCount, decimals: 0, suffix: '', label: 'Reviews' },
    { to: carCount, decimals: 0, suffix: '', label: 'Cars in stock' },
    { to: brandCount, decimals: 0, suffix: '', label: 'Brands' },
  ];

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="scene relative flex min-h-dvh flex-col overflow-hidden"
    >
      <div className="absolute inset-0 bg-ink-950" />

      {/* Accent bloom, furthest back */}
      <motion.div
        style={{ x: glowX }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[62vh] w-[62vh] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]"
      />

      {/* Footage plate */}
      <motion.div
        style={{ y: plateY, scale: plateScale }}
        className="vignette absolute inset-0"
      >
        <motion.div
          style={{ x: carX, y: carY }}
          className="absolute -inset-[5%]"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
        >
          <video
            className="h-full w-full object-cover object-[62%_center] md:object-[32%_center]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-label="Night footage of a black Mahindra Thar on the showroom forecourt"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Vertical scrim — seats the navbar above and the stats below */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.82)_0%,rgba(8,9,12,0.06)_26%,rgba(8,9,12,0.18)_62%,rgba(8,9,12,0.92)_100%)]" />
        {/* Horizontal scrim — a defined panel behind the type, not a flat wash */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,12,0.94)_0%,rgba(8,9,12,0.76)_20%,rgba(8,9,12,0.22)_40%,transparent_60%)]" />
      </motion.div>

      <div className="noise pointer-events-none absolute inset-0" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: fade, x: reduce ? 0 : typeX }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-28 sm:pb-28 sm:pt-32 lg:px-10"
      >
        <motion.div
          initial="hidden"
          animate={gate}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="mb-7 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-accent to-accent/20" />
            <span className="text-[11px] font-500 uppercase tracking-eyebrow text-slate-300">
              Curated Performance &amp; Luxury
            </span>
          </motion.div>

          {/* Headline — words rise from behind a mask, in brushed chrome */}
          <h1 className="font-display text-display-lg font-600 text-white [filter:drop-shadow(0_3px_36px_rgba(4,5,7,0.95))]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className="chrome-text inline-block"
                variants={{
                  hidden: { y: '112%' },
                  show: { y: '0%', transition: { duration: 1.15, ease: EASE } },
                }}
              >
                Beyond
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: '112%' },
                  show: { y: '0%', transition: { duration: 1.15, ease: EASE } },
                }}
              >
                <span className="chrome-text">ordinary</span>
                {/* Bodoni's y sweeps right, leaving the full stop stranded.
                    Pulled back optically rather than left on its metrics. */}
                <span className="-ml-[0.13em] text-accent">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
              show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 1, ease: EASE },
              },
            }}
            className="mt-8 max-w-md text-base leading-relaxed text-slate-300/85 [text-shadow:0_1px_16px_rgba(4,5,7,0.95)] sm:text-lg"
          >
            Every car inspected on 140 points, priced honestly, and handed over
            with the RC transfer already done.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                href="/cars"
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                {/* Light sweeps across the face on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-premium group-hover:translate-x-full" />
                <span className="relative">Explore the Collection</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.22}>
              <Link
                href="/sell"
                className="hairline rounded-full bg-white/[0.04] px-8 py-4 text-sm font-500 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.1]"
              >
                Sell your car
              </Link>
            </Magnetic>
          </motion.div>

          {/* Live stats — these move when the owner adds a car */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-12 grid grid-cols-2 gap-5 border-t border-white/10 pt-8 sm:mt-16 sm:flex sm:flex-wrap sm:items-stretch sm:gap-x-10 sm:gap-y-6 sm:pt-9"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-stretch sm:gap-10">
                {i > 0 && (
                  <span className="hidden w-px bg-white/10 sm:block" aria-hidden />
                )}
                <div>
                  <div className="font-display text-3xl font-600 tabular-nums text-white sm:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Location tag + scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto hidden max-w-7xl items-end justify-between px-6 sm:flex lg:px-10"
      >
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:flex">
          <MapPin className="h-3 w-3 text-accent" strokeWidth={2} />
          Nagarbhavi · Bengaluru
        </span>

        <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.9, ease: 'easeInOut', repeat: Infinity }}
              className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
