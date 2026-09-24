'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from './ui/motion';

const DURATION = 1750; // ms of counting before the curtains part
const SEEN_KEY = 'kushi:intro-seen';

/**
 * The overture. A showroom door opening, not a spinner.
 *
 * It is an overlay, never a gate: the page underneath is already rendered and
 * interactive, so a slow device or a crawler simply sees the site. Any click,
 * key or scroll dismisses it early, and `?intro=0` skips it outright — handy
 * when you are deep-linking someone straight to the collection.
 */
/**
 * The identity block, drawn identically into both curtains and clipped by
 * each. Whole while they are shut — torn cleanly in half as they part.
 *
 * Declared at module scope on purpose: defining it inside Preloader would make
 * it a brand-new component type on every `pct` tick, so React would remount it
 * sixty times a second and its entrance animation would never get past the
 * first frame.
 */
function Mark({ half, pct }: { half: 'top' | 'bottom'; pct: number }) {
  return (
    <div
      className={`absolute inset-x-0 flex flex-col items-center ${
        half === 'top' ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.86, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: EASE }}
        className="grid h-16 w-16 place-items-center rounded-xl bg-accent shadow-glow-lg"
      >
        <span className="font-display text-3xl font-700 leading-none tracking-tight text-white">
          K
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="mt-7 font-display text-2xl font-600 tracking-[0.2em] text-platinum"
      >
        KUSHI CARS
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-7 flex w-56 items-center gap-4"
      >
        <div className="relative h-px flex-1 overflow-hidden bg-white/15">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-glow"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-8 text-right font-mono text-[11px] tabular-nums text-slate-400">
          {String(pct).padStart(2, '0')}
        </span>
      </motion.div>
    </div>
  );
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // Once per tab. The site is multi-page now, and replaying a 1.75s
    // curtain every time somebody comes back to the home page would make
    // the whole thing feel slow rather than considered.
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Private mode. Play it — worse to break than to repeat.
    }

    const skipped =
      reduce ||
      alreadySeen ||
      new URLSearchParams(window.location.search).get('intro') === '0';

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // Nothing to do; the curtain simply plays again next time.
      }
      setDone(true);
      onDone();
    };

    if (skipped) {
      finish();
      return;
    }

    document.body.style.overflow = 'hidden';

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Ease out — it sprints, then settles on 100. A linear count reads cheap.
      setPct(Math.round((1 - Math.pow(1 - t, 2.2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    const skip = () => {
      setPct(100);
      finish();
    };
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
    };
    // onDone is a stable setState updater from HomeClient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    if (!done) return;
    // Let the curtains finish travelling before scrolling is handed back.
    const t = setTimeout(() => {
      document.body.style.overflow = '';
    }, 900);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(
    () => () => {
      document.body.style.overflow = '';
    },
    [],
  );

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[200] flex flex-col" aria-hidden>
          <motion.div
            className="relative flex-1 overflow-hidden bg-ink-1000"
            exit={{ y: '-101%', transition: { duration: 1, ease: EASE } }}
          >
            <div className="noise absolute inset-0" />
            <Mark half="top" pct={pct} />
          </motion.div>

          <motion.div
            className="relative flex-1 overflow-hidden bg-ink-1000"
            exit={{ y: '101%', transition: { duration: 1, ease: EASE } }}
          >
            <div className="noise absolute inset-0" />
            <Mark half="bottom" pct={pct} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
