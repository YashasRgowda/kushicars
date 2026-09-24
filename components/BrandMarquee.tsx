'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Brand } from '@/lib/types';

/**
 * The marque band. Real brands, pulled from what is actually on the floor —
 * so it can never advertise stock the showroom does not have.
 *
 * Two rows travel in opposite directions on a tilted plane. The counter-motion
 * is what makes it read as depth rather than as a ticker.
 */
export default function BrandMarquee({ brands }: { brands: Brand[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // The plane straightens as the band crosses the viewport.
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [16, 0, -16]);

  if (brands.length === 0) return null;

  // Doubled so the -50% translate loops seamlessly.
  const row = [...brands, ...brands];

  return (
    <section
      ref={ref}
      aria-label="Brands in stock"
      className="scene relative overflow-hidden border-y border-white/[0.07] bg-ink-1000 py-16 lg:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[900px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.09] blur-[120px]"
      />

      <motion.div
        style={{ rotateX }}
        className="preserve-3d mask-x relative flex flex-col gap-5"
      >
        <Row items={row} direction="normal" />
        <Row items={row} direction="reverse" muted />
      </motion.div>

      <div className="noise pointer-events-none absolute inset-0" />
    </section>
  );
}

function Row({
  items,
  direction,
  muted = false,
}: {
  items: Brand[];
  direction: 'normal' | 'reverse';
  muted?: boolean;
}) {
  return (
    <div className="flex w-max shrink-0">
      <div
        className={`flex shrink-0 items-center ${
          direction === 'normal'
            ? 'animate-marquee'
            : 'animate-marquee-reverse'
        }`}
      >
        {items.map((b, i) => (
          <Link
            key={`${b.name}-${i}`}
            // Lands on the collection already narrowed to that brand.
            href={`/cars?brand=${encodeURIComponent(b.name)}`}
            tabIndex={i < items.length / 2 ? 0 : -1}
            aria-hidden={i >= items.length / 2}
            className="group flex shrink-0 items-center gap-8 px-8"
          >
            <span
              className={`font-display text-3xl font-500 tracking-tight transition-colors duration-500 sm:text-4xl lg:text-5xl ${
                muted
                  ? 'text-white/[0.13] group-hover:text-white/40'
                  : 'text-white/35 group-hover:text-white'
              }`}
            >
              {b.name}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-accent/45 transition-colors duration-500 group-hover:bg-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
