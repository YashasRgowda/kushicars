'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BUSINESS } from '@/lib/business';
import { TESTIMONIALS } from '@/lib/testimonials';
import { EASE, Eyebrow, Reveal, SplitText } from './ui/motion';

/** How long each review holds the stage. */
const DWELL = 7000;

/**
 * Reviews.
 *
 * Every quote is a real one from the Google profile under the reviewer's
 * real name — see the provenance note in lib/testimonials.ts.
 *
 * Deliberately spare. An earlier version carried a counter, a progress bar,
 * a rail of eight names and a row of theme chips, and the furniture ended up
 * louder than the quote it surrounded. What is left is a sentence, a name,
 * five stars, and the two controls people actually reach for: a dot per
 * review saying where you are, and a pair of arrows for stepping through
 * them by hand.
 */
export default function Testimonials() {
  const reduce = useReducedMotion();
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const count = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  const go = useCallback(
    (next: number, dir: number) =>
      setState([((next % count) + count) % count, dir]),
    [count],
  );

  // A timer is an external system, so setting state from its callback is
  // exactly what an effect is for.
  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => go(index + 1, 1), DWELL);
    return () => clearTimeout(id);
  }, [index, paused, reduce, go]);

  return (
    <section
      id="reviews"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      className="section-y relative scroll-mt-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-accent/[0.03] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>In their words</Eyebrow>
            <SplitText
              as="h2"
              text="What people say afterwards"
              className="mt-6 block max-w-2xl font-display text-display-sm font-600 text-ink-900"
            />
          </div>
          <Reveal delay={0.1}>
            <RatingBadge />
          </Reveal>
        </div>

        {/* The stage takes its height from whichever review is on it and
            animates between them, so a six-word review leaves no hole and a
            fifty-word one cannot overflow. */}
        <motion.div layout transition={{ duration: 0.4, ease: EASE }} className="mt-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={index}
              custom={direction}
              /* Forward, a review rises from below and the old one leaves
                 upward. Back, both reverse — so the arrows feel like they
                 are moving a reel rather than reshuffling it. */
              variants={{
                enter: (d: number) => ({ opacity: 0, y: reduce ? 0 : d < 0 ? -16 : 16 }),
                center: { opacity: 1, y: 0 },
                exit: (d: number) => ({ opacity: 0, y: reduce ? 0 : d < 0 ? 16 : -16 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
            >
              <blockquote className="max-w-3xl">
                <Words text={`“${current.quote}”`} reduce={!!reduce} />
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-4">
                <span
                  className="flex gap-0.5"
                  aria-label={`${current.rating} out of 5 stars`}
                >
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                    />
                  ))}
                </span>
                <span className="text-[15px] text-stone-800">{current.name}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        {/* Where you are, and a way to move by hand.

            The dots replaced a row of dashes that gave no hover response at
            all — the cursor landed on a control and nothing happened, which
            reads as broken rather than as restraint. Each dot now grows and
            takes the brand green under the cursor, and the hit area is a
            32px square around a 8px dot, so it is reachable on a phone
            without the dot itself having to be large.

            The arrows exist because the one thing people do here is go BACK:
            a review holds for seven seconds and moves on while they are
            still reading it. */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="-mx-1.5 flex items-center">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => go(i, i > index ? 1 : -1)}
                aria-label={`Review ${i + 1} of ${count}, by ${t.name}`}
                aria-current={i === index ? 'true' : undefined}
                className="group grid h-8 w-8 place-items-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ease-premium ${
                    i === index
                      ? 'h-2.5 w-2.5 bg-accent'
                      : 'h-2 w-2 bg-line-strong group-hover:scale-125 group-hover:bg-accent-glow'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <NavArrow side="prev" onClick={() => go(index - 1, -1)} />
            <NavArrow side="next" onClick={() => go(index + 1, 1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** One step back or forward. The same shape the FAQ and the gallery use. */
function NavArrow({ side, onClick }: { side: 'prev' | 'next'; onClick: () => void }) {
  const Icon = side === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'prev' ? 'Previous review' : 'Next review'}
      className="group grid h-11 w-11 place-items-center rounded-full border border-line text-stone-700 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
    >
      <Icon
        aria-hidden
        className={`h-4 w-4 transition-transform duration-300 ease-premium ${
          side === 'prev' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
        }`}
        strokeWidth={1.8}
      />
    </button>
  );
}

/**
 * The quote, word by word, rising out from behind a mask.
 *
 * A crossfade would do the job, but type that appears to be printed on a
 * surface moving up past a window is the difference between "the text
 * changed" and "someone is speaking".
 */
function Words({ text, reduce }: { text: string; reduce: boolean }) {
  const cls =
    'block text-pretty font-display text-[1.6rem] font-400 leading-[1.35] text-ink-900 sm:text-3xl lg:text-[2rem]';

  if (reduce) return <span className={cls}>{text}</span>;

  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.018, delayChildren: 0.05 }}
      className={cls}
    >
      {text.split(' ').map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          // pb/-mb gives descenders room so the mask cannot clip them.
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.6, ease: EASE } },
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function RatingBadge() {
  return (
    <a
      href={BUSINESS.googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 text-stone-700 transition-colors duration-300 hover:text-ink-900"
    >
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
        ))}
      </span>
      <span className="font-display text-xl font-600 tabular-nums text-ink-900">
        {BUSINESS.rating.toFixed(1)}
      </span>
      <span className="text-[13px]">
        {BUSINESS.reviewCount} Google reviews
      </span>
      <ArrowUpRight
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
