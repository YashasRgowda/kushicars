'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE, Eyebrow, Reveal, SplitText } from './ui/motion';

/* The masthead opens as a sequence, not all at once. Each piece waits for
   the one above it, which is the whole difference between a page that
   arrives and a page that is simply present when you get there. The gaps
   are deliberately uneven — the headline gets the longest pause before it,
   because it is the thing worth waiting for.

   A "Home > Cars" breadcrumb used to open the sequence. It went: this site
   is four pages deep at most, every one of them is one tap away in the
   navbar, and a trail that only ever reads "Home >" is furniture telling
   you something you already know. The BreadcrumbList structured data stays
   — that is what puts the trail under the result in Google, and it costs
   the page nothing to look at. */
const STEP = { eyebrow: 0.14, title: 0.26, lede: 0.44, extra: 0.56 };

/**
 * The masthead on every interior page.
 *
 * Interior pages sit under a fixed navbar with no hero behind it, so they
 * open with a deep band of air — pt-40 — before anything is said. That pause
 * is most of what separates a page that reads expensive from one that reads
 * like a CMS template.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  /**
   * For pages where the header is not the point — a car listing, where the
   * photograph has to be above the fold on a laptop, not half under it.
   */
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <header
      className={`relative overflow-hidden ${
        compact ? 'pb-8 pt-28 lg:pb-10 lg:pt-32' : 'pb-14 pt-36 lg:pb-20 lg:pt-44'
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-accent/[0.035] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Eyebrow delay={STEP.eyebrow}>{eyebrow}</Eyebrow>
        <SplitText
          as="h1"
          text={title}
          delay={STEP.title}
          className={`${compact ? 'mt-5' : 'mt-7'} block max-w-4xl font-display text-display-sm font-600 text-ink-900`}
        />
        {lede && (
          <Reveal delay={STEP.lede}>
            <p
              className={`${compact ? 'mt-3' : 'mt-7'} max-w-2xl text-pretty text-[17px] leading-relaxed text-stone-700`}
            >
              {lede}
            </p>
          </Reveal>
        )}
        {children && (
          <motion.div {...rise(STEP.extra)} className="mt-10">
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
