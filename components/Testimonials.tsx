'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
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
 * two arrows, a rail of eight names and a row of theme chips, and the
 * furniture ended up louder than the quote it surrounded. All of that
 * collapses into one row of marks: the active one is wider and fills as the
 * review holds, so it is the position, the progress and the navigation at
 * once. What is left on screen is a sentence, a name, and five stars.
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
      className="relative scroll-mt-20 overflow-hidden py-28 lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>In their words</Eyebrow>
            <SplitText
              as="h2"
              text="What people say afterwards"
              className="mt-6 block max-w-2xl font-display text-display-sm font-600 text-white"
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
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -14 }}
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
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </span>
                <span className="text-[15px] text-slate-300">{current.name}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        {/* Position, progress and navigation, in one row of marks. Two
            pixels rather than one: a hairline of white/12 on ground this
            dark is invisible, and a control nobody can see is not minimal,
            it is missing. */}
        <div className="mt-10 flex gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Review ${i + 1} of ${count}, by ${t.name}`}
              aria-current={i === index}
              className="group py-3"
            >
              <span
                className={`relative block h-0.5 overflow-hidden rounded-full transition-all duration-500 ease-premium ${
                  i === index
                    ? 'w-12 bg-white/20'
                    : 'w-6 bg-white/20 group-hover:bg-white/50'
                }`}
              >
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused || reduce ? 0 : 1 }}
                    transition={{
                      duration: paused || reduce ? 0 : DWELL / 1000,
                      ease: 'linear',
                    }}
                    className="absolute inset-0 origin-left bg-accent"
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
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
    'block text-pretty font-display text-[1.6rem] font-400 leading-[1.35] text-white sm:text-3xl lg:text-[2rem]';

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
      className="group flex items-center gap-4 text-slate-400 transition-colors duration-300 hover:text-white"
    >
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </span>
      <span className="font-display text-xl font-600 tabular-nums text-white">
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
