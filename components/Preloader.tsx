'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from './ui/motion';
import Wordmark from './Wordmark';

const DURATION = 1750; // ms of counting before the curtains part

/**
 * Whether the curtain has already run in THIS page load.
 *
 * Module scope is doing real work here. A module is evaluated once per
 * document, so this resets on a reload or a fresh visit — which is when the
 * intro should play — and survives client-side navigation, which is when it
 * should not. Clicking Home from the collection remounts Preloader; without
 * this it would replay the 1.75s count every time, and an overture you have
 * to sit through on every visit to one route stops reading as considered.
 *
 * It was sessionStorage before, which is keyed to the TAB rather than the
 * load, so a reload found the flag already set and you got the curtains
 * parting with no count behind them.
 */
let playedThisLoad = false;

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
      {/* The curtain is the one place with room for the whole lockup, so
          this is the only appearance of the mark that gets the tagline. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: EASE }}
      >
        <Wordmark variant="full" size="xl" priority />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-7 flex w-56 items-center gap-4"
      >
        <div className="relative h-px flex-1 overflow-hidden bg-line-strong">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-glow"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-8 text-right font-mono text-[11px] tabular-nums text-stone-600">
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
    const skipped =
      reduce ||
      playedThisLoad ||
      new URLSearchParams(window.location.search).get('intro') === '0';

    const finish = () => {
      playedThisLoad = true;
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
    <>
      {/* The curtain cannot simply out-rank the navbar on z-index.

          It is rendered inside PageTransition, whose entrance fades opacity
          from 0 — and an element with opacity below 1 creates a STACKING
          CONTEXT. That scopes this overlay's z-200 inside the page wrapper,
          while the navbar (z-50), the scroll bar (z-60) and the WhatsApp
          dock (z-90) are fixed in the ROOT context. For the half second that
          fade runs, all three paint straight over the curtain — which is why
          a ghost of the wordmark appeared above the intro on a reload, most
          visibly on a phone, where the load is slow enough to see it.

          Rather than restructure where the curtain mounts, the chrome is
          simply told to stand down while the curtain is up. This is rendered
          on the server too, so it applies from the very first paint, and it
          is keyed off `done` rather than off the exit animation — the
          navbar comes back the moment the curtain is dismissed, whatever
          the curtains themselves are still doing. */}
      {!done && (
        /* `display`, not `visibility`. The navbar carries `transition-all`,
           and visibility is a transitionable property — so un-hiding it gets
           queued on the animation timeline and arrives late (or, in a tab
           whose animations are throttled, never). `display` is discrete and
           is not transitioned without `transition-behavior: allow-discrete`,
           so it flips the instant the rule goes. Every element this touches
           is position:fixed, so nothing reflows either way. */
        <style>{`[data-site-chrome]{display:none!important}`}</style>
      )}

      <AnimatePresence>
        {!done && (
        <motion.div className="fixed inset-0 z-[200] flex flex-col" aria-hidden>
          <motion.div
            className="relative flex-1 overflow-hidden bg-paper"
            exit={{ y: '-101%', transition: { duration: 1, ease: EASE } }}
          >
            <div className="noise absolute inset-0" />
            <Mark half="top" pct={pct} />
          </motion.div>

          <motion.div
            className="relative flex-1 overflow-hidden bg-paper"
            exit={{ y: '101%', transition: { duration: 1, ease: EASE } }}
          >
            <div className="noise absolute inset-0" />
            <Mark half="bottom" pct={pct} />
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
