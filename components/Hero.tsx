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
import { ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/business';
import Counter from './Counter';
import { EASE, Magnetic } from './ui/motion';

/**
 * The hero. A full-bleed film with the words on top of it.
 *
 * This is the one dark section on a light site, and it is dark because the
 * footage decides that. Measured across the loop, ivory type on the bare
 * frame lands at 1.0:1 on the headline — the same brightness as the sky
 * behind it — so something has to come between the two.
 *
 * What that something must NOT be is a wedge down one side. A linear scrim
 * puts a straight edge across a sky and the eye finds it instantly; it reads
 * as a panel laid on the picture. So the darkening is shaped the way a lens
 * darkens instead: a flat exposure drop across the whole frame, then a large
 * soft ellipse centred on the car — open where the car and the cloud behind
 * it are, closing gradually toward the corners where the words sit. No edge
 * anywhere, so there is nothing to notice.
 *
 * Every layer here is NEUTRAL near-black, even though the rest of the
 * palette is green-black. A tinted overlay does not darken a photograph, it
 * casts it — push the ink green through this and the whole left of the frame
 * turns green, which shows up as a wash rather than as grading.
 */
export default function Hero({
  ready,
  carCount,
  brandCount,
  replayKey = 0,
}: {
  ready: boolean;
  carCount: number;
  brandCount: number;
  /** Bumped when the mark is clicked from this page — remounts the type
   *  block so the reveal runs again. The film is outside it and keeps
   *  playing, which is the point: the words return, the shot does not cut. */
  replayKey?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Depth on exit: the film sinks and swells while the type leaves faster.
  const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '44%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer parallax — small, because the clip already has a push-in of its
  // own and the two motions fight if this one is loud.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const carX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const carY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const typeX = useTransform(sx, [-0.5, 0.5], [8, -8]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
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
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#040507]"
    >
      {/* ---------------- The film ---------------- */}
      <motion.div
        style={{ y: plateY, scale: plateScale }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ x: carX, y: carY }}
          className="absolute -inset-[4%]"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
        >
          <video
            className="h-full w-full object-cover object-[64%_center] md:object-[58%_center]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-label="A black Land Rover Defender parked on a gravel track at sunset"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* The flat exposure drop. A phone gets more of it: the crop there is
            a narrow portrait slice, so the vignette's open middle covers most
            of the frame and the type runs the full width with nowhere to sit
            out of the light. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[rgba(4,5,7,0.52)] md:bg-[rgba(4,5,7,0.38)]"
        />
        {/* The vignette. Centre and falloff were picked by searching the
            parameter space against the clip itself: of every combination
            that holds the headline at 3.8:1 or better on the brightest pixel
            of the brightest frame, this is the one that leaves the most
            light in the car. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_110%_at_76%_57%,transparent_12%,rgba(4,5,7,0.58)_46%,rgba(4,5,7,0.88)_100%)]"
        />
        {/* Short top band, for the navbar only — it spans the full width, so
            it reaches the bright side of the frame where the vignette is
            still open. Gone by 16%, well above the horizon. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,7,0.55)_0%,rgba(4,5,7,0.22)_9%,transparent_16%)]"
        />
      </motion.div>

      {/* Grain, so the golden-hour gradient does not band on a cheap panel. */}
      <div aria-hidden className="noise-dark pointer-events-none absolute inset-0" />

      {/* ---------------- The words ---------------- */}
      <motion.div
        style={{ y: contentY, opacity: fade, x: reduce ? 0 : typeX }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-28 sm:pb-28 sm:pt-32 lg:px-10"
      >
        <motion.div
          key={replayKey}
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
            <span className="h-px w-12 bg-gradient-to-r from-gold to-gold/20" />
            <span className="text-[11px] font-500 uppercase tracking-eyebrow text-stone-300">
              Curated Performance &amp; Luxury
            </span>
          </motion.div>

          {/* Headline — words rise from behind a mask, in brushed metal */}
          <h1 className="font-display text-display-lg font-600 text-white [filter:drop-shadow(0_3px_28px_rgba(4,5,7,0.9))]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className="chrome-text-light inline-block"
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
                <span className="chrome-text-light">ordinary</span>
                {/* Bodoni's y sweeps right, leaving the full stop stranded.
                    Pulled back optically rather than left on its metrics. */}
                <span className="-ml-[0.13em] text-gold">.</span>
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
            className="mt-8 max-w-md text-base leading-relaxed text-stone-300 [text-shadow:0_1px_14px_rgba(4,5,7,0.95)] sm:text-lg"
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
                /* Gold, not the brand green — on this ground the green IS the
                   ground. #15523A sits at almost exactly the luminance of the
                   graded footage behind it, so a green pill dissolves and the
                   ghost secondary ends up louder than the primary. Same move
                   as the reverse lockup: on dark, flip the value and keep the
                   hue family. Gold is the brand's light. */
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-600 text-ink-900 shadow-lift-gold transition-transform duration-300 ease-premium hover:scale-[1.03]"
              >
                {/* Light sweeps across the face on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-premium group-hover:translate-x-full" />
                <span className="relative">Explore the Collection</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.22}>
              <Link
                href="/sell"
                className="rounded-full border border-ivory/30 px-8 py-4 text-sm font-500 text-ivory backdrop-blur-md transition-colors duration-300 hover:border-ivory/60 hover:bg-ivory/[0.1]"
              >
                Sell your car
              </Link>
            </Magnetic>
          </motion.div>

          {/* Live stats — these move when the owner adds a car. Kept clustered
              to the left rather than spread across the frame: the car sits
              centre and grows through the clip, and a row of figures running
              over its bonnet looks like a mistake. */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-12 grid grid-cols-2 gap-5 border-t border-white/15 pt-8 sm:mt-16 sm:flex sm:flex-wrap sm:items-stretch sm:gap-x-9 sm:gap-y-6 sm:pt-9"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-stretch sm:gap-9">
                {i > 0 && (
                  <span className="hidden w-px bg-white/15 sm:block" aria-hidden />
                )}
                <div>
                  <div className="font-display text-3xl font-600 tabular-nums text-white sm:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-300">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
