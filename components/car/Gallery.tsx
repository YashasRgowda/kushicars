'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';

import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { Car } from '@/lib/types';
import { canOptimize } from '@/lib/photos';
import { EASE } from '@/components/ui/motion';

/* ==================================================================
   The car's photographs — the part of the listing people actually look at.

   Swipe on a phone, drag with a mouse, arrow keys, thumbnails, or open it
   full screen. Every route leads to the same index, and the direction of
   travel is remembered so a photo always leaves the way you pushed it.
   ================================================================== */

/**
 * How long the full-screen view takes to fade out, and therefore how long
 * after a close it leaves the page. Matches the `sheet-out` animation.
 */
const EXIT_MS = 240;

/** A swipe counts if it travels this far, or is flicked this hard. */
const SWIPE_DISTANCE = 90;
const SWIPE_POWER = 9000;

/** Slides in from the side you pushed toward; the outgoing one leaves opposite. */
const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0, opacity: dir === 0 ? 0 : 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 1 }),
};
const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/** True only once the browser is in charge — the lightbox portals to body. */
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export default function Gallery({ car }: { car: Car }) {
  const photos = car.photos;
  const count = photos.length;
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const reduce = !!useReducedMotion();
  const isClient = useIsClient();
  const stageRef = useRef<HTMLDivElement>(null);

  /**
   * Whether the full-screen view is in the page, and whether it is showing.
   *
   * Two pieces of state, because AnimatePresence could not be trusted to
   * take this one away. Its exit never resolved here — the view stayed in
   * the document at opacity 0 with pointer-events auto, and because the
   * scroll lock is released by that component's UNMOUNT, the whole listing
   * stayed frozen behind it: a buyer who opened a photo and closed it again
   * could no longer scroll or tap anything on the page.
   *
   * The removal is a timeout now, which cannot fail to fire, and the view
   * drops its pointer events the moment it starts leaving.
   */
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const exitTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    },
    [],
  );

  const openLightbox = useCallback(() => {
    if (exitTimer.current !== null) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setLightboxMounted(true);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setLightboxMounted(false);
      exitTimer.current = null;
    }, EXIT_MS);
  }, []);

  const label = `${car.year} ${car.brand} ${car.model}`;

  const paginate = useCallback(
    (dir: number) => {
      if (count < 2) return;
      setState(([cur]) => [(cur + dir + count) % count, dir]);
    },
    [count],
  );
  const jump = useCallback(
    (to: number) => setState(([cur]) => (to === cur ? [cur, 0] : [to, to > cur ? 1 : -1])),
    [],
  );

  // Arrow keys move the photos — except while someone is typing in the test
  // drive form beside them, where arrows belong to the text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowLeft') paginate(-1);
      else if (e.key === 'ArrowRight') paginate(1);
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paginate, closeLightbox]);

  if (count === 0) return <EmptyPlate car={car} />;

  return (
    <div>
      {/* ---------------- Stage ---------------- */}
      <div
        ref={stageRef}
        className="hairline group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-paper-300"
      >
        <Slides
          photos={photos}
          index={index}
          direction={direction}
          label={label}
          reduce={reduce}
          fit="cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
          onPaginate={paginate}
          onTap={openLightbox}
          eagerFirst
        />

        {/* Legibility for the chrome sitting on the photo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent"
        />

        {count > 1 && (
          <>
            <Segments count={count} index={index} />
            <Arrow side="left" onClick={() => paginate(-1)} />
            <Arrow side="right" onClick={() => paginate(1)} />
          </>
        )}

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between">
          {count > 1 ? (
            <Counter index={index} count={count} />
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={openLightbox}
            aria-label="View photos full screen"
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-all duration-300 ease-premium hover:scale-105 hover:bg-white hover:text-ink-950"
          >
            <Expand className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ---------------- Thumbnails ---------------- */}
      {count > 1 && (
        <Thumbs
          photos={photos}
          index={index}
          onPick={jump}
          scope="stage"
          className="mt-3 grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${Math.min(count, 6)}, minmax(0, 1fr))`,
          }}
          sizes="(min-width: 1024px) 12vw, 22vw"
        />
      )}

      {/* ---------------- Full screen ---------------- */}
      {isClient &&
        lightboxMounted &&
        createPortal(
          <Lightbox
            photos={photos}
            index={index}
            direction={direction}
            label={label}
            reduce={reduce}
            open={lightboxOpen}
            onPaginate={paginate}
            onPick={jump}
            onClose={closeLightbox}
          />,
          document.body,
        )}
    </div>
  );
}

/* ==================================================================
   Slides — shared by the stage and the lightbox
   ================================================================== */

function Slides({
  photos,
  index,
  direction,
  label,
  reduce,
  fit,
  sizes,
  onPaginate,
  onTap,
  eagerFirst = false,
}: {
  photos: string[];
  index: number;
  direction: number;
  label: string;
  reduce: boolean;
  fit: 'cover' | 'contain';
  sizes: string;
  onPaginate: (dir: number) => void;
  onTap?: () => void;
  eagerFirst?: boolean;
}) {
  const count = photos.length;
  // A drag that ends where it started is a tap; anything further is a swipe
  // and must not also open the lightbox.
  const dragged = useRef(false);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const power = Math.abs(offset.x) * velocity.x;
    if (offset.x < -SWIPE_DISTANCE || power < -SWIPE_POWER) onPaginate(1);
    else if (offset.x > SWIPE_DISTANCE || power > SWIPE_POWER) onPaginate(-1);
  };

  const prev = photos[(index - 1 + count) % count];
  const next = photos[(index + 1) % count];

  return (
    <>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={reduce ? fade : slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 },
            opacity: { duration: 0.35, ease: EASE },
          }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={onDragEnd}
          onPointerDown={() => (dragged.current = false)}
          onClick={() => {
            if (!dragged.current) onTap?.();
          }}
          className={`absolute inset-0 touch-pan-y select-none ${
            count > 1 ? 'cursor-grab active:cursor-grabbing' : onTap ? 'cursor-zoom-in' : ''
          }`}
        >
          {/* A slow settle on arrival — the photograph feels placed, not swapped. */}
          <motion.div
            className="absolute inset-0"
            initial={reduce || fit === 'contain' ? false : { scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <Photo
              src={photos[index]}
              alt={`${label} — photo ${index + 1} of ${count}`}
              fit={fit}
              sizes={sizes}
              priority={eagerFirst && index === 0 ? 'lcp' : 'normal'}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* The neighbours load in the background at the same size, so the next
          swipe lands on a photo that is already there. */}
      {count > 1 && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0">
          {[prev, next].map((src, i) => (
            <div key={`${src}-${i}`} className="absolute inset-0">
              <Photo src={src} alt="" fit={fit} sizes={sizes} priority="background" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * - `lcp`: the first photo on the page. Fetched first, ahead of everything.
 * - `background`: the neighbours being warmed up for the next swipe. Fetched
 *   now, but at low priority, so they never compete with the photo on screen.
 * - `normal`: everything else.
 */
type LoadPriority = 'lcp' | 'background' | 'normal';

function Photo({
  src,
  alt,
  fit,
  sizes,
  priority = 'normal',
}: {
  src: string;
  alt: string;
  fit: 'cover' | 'contain';
  sizes: string;
  priority?: LoadPriority;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      draggable={false}
      unoptimized={!canOptimize(src)}
      loading={priority === 'normal' ? 'lazy' : 'eager'}
      fetchPriority={priority === 'lcp' ? 'high' : priority === 'background' ? 'low' : 'auto'}
      className={fit === 'cover' ? 'object-cover' : 'object-contain'}
    />
  );
}

/* ==================================================================
   Chrome
   ================================================================== */

/** Where you are, as a row of segments across the top of the photo. */
function Segments({ count, index }: { count: number; index: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-4 top-4 flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-black/30">
          <motion.span
            initial={false}
            animate={{ scaleX: i <= index ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0 origin-left bg-white"
          />
        </span>
      ))}
    </div>
  );
}

function Counter({ index, count }: { index: number; count: number }) {
  return (
    <span className="flex items-baseline overflow-hidden rounded-full bg-black/70 px-3.5 py-1.5 font-mono text-[11px] tabular-nums tracking-[0.14em] text-white backdrop-blur-md">
      <span className="relative inline-block h-[1.2em] w-[2ch] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={index}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0"
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mx-1.5 text-white/60">/</span>
      <span className="text-white/80">{String(count).padStart(2, '0')}</span>
    </span>
  );
}

function Arrow({
  side,
  onClick,
  large = false,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  large?: boolean;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      // Hidden on touch screens, where the thumb swipes instead.
      className={`absolute top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 ease-premium hover:scale-105 hover:bg-white hover:text-ink-950 md:grid ${
        large ? 'h-14 w-14' : 'h-11 w-11 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100'
      } ${side === 'left' ? (large ? 'left-6' : 'left-4') : large ? 'right-6' : 'right-4'}`}
    >
      <Icon className={large ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.5} />
    </button>
  );
}

function Thumbs({
  photos,
  index,
  onPick,
  scope,
  className,
  style,
  sizes,
}: {
  photos: string[];
  index: number;
  onPick: (i: number) => void;
  scope: string;
  className: string;
  style?: React.CSSProperties;
  sizes: string;
}) {
  return (
    <LayoutGroup id={`thumbs-${scope}`}>
      <div className={className} style={style}>
        {photos.map((src, n) => (
          <button
            key={src}
            type="button"
            onClick={() => onPick(n)}
            aria-label={`Show photo ${n + 1}`}
            aria-current={n === index}
            className="group/thumb relative aspect-[16/10] overflow-hidden rounded-lg bg-paper-300"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={sizes}
              unoptimized={!canOptimize(src)}
              className={`object-cover transition-all duration-500 ease-premium ${
                n === index
                  ? 'scale-100 opacity-100'
                  : 'scale-105 opacity-40 group-hover/thumb:scale-100 group-hover/thumb:opacity-80'
              }`}
            />
            {/* The frame travels between thumbnails rather than blinking. */}
            {n === index && (
              <motion.span
                layoutId="thumb-frame"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-inset ring-accent"
              />
            )}
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

/* ==================================================================
   Full screen
   ================================================================== */

function Lightbox({
  photos,
  index,
  direction,
  label,
  reduce,
  open,
  onPaginate,
  onPick,
  onClose,
}: {
  photos: string[];
  index: number;
  direction: number;
  label: string;
  reduce: boolean;
  /** Showing, as opposed to merely still in the page while it fades out. */
  open: boolean;
  onPaginate: (dir: number) => void;
  onPick: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;

  // Own the scroll and the focus while open; hand both back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label} photos`}
      aria-hidden={open ? undefined : true}
      /* Deliberately still dark, on an otherwise light site. A lightbox
         exists to take everything except the photograph away, and a bright
         chamber cannot do that — the white would sit at the same value as
         the sky in half these pictures and eat the edges of the car. Every
         viewer worth copying does this, and the page behind it is what
         tells you the site is light.

         The fade is a CSS animation rather than a framer one: this element's
         removal is now driven by a timer in Gallery, and the class it is
         given simply has to match. */
      className={`fixed inset-0 z-[200] flex flex-col bg-ink-1000/95 backdrop-blur-xl ${
        open ? 'animate-sheet-in' : 'pointer-events-none animate-sheet-out'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-lg text-white">{label}</p>
        <div className="flex items-center gap-4">
          {count > 1 && <Counter index={index} count={count} />}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink-950"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ scale: reduce ? 1 : 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <Slides
          photos={photos}
          index={index}
          direction={direction}
          label={label}
          reduce={reduce}
          fit="contain"
          sizes="100vw"
          onPaginate={onPaginate}
        />
        {count > 1 && (
          <>
            <Arrow side="left" large onClick={() => onPaginate(-1)} />
            <Arrow side="right" large onClick={() => onPaginate(1)} />
          </>
        )}
      </motion.div>

      {count > 1 && (
        <div className="shrink-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
          <Thumbs
            photos={photos}
            index={index}
            onPick={onPick}
            scope="lightbox"
            className="mx-auto grid max-w-xl gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(count, 6)}, minmax(0, 1fr))`,
            }}
            sizes="14vw"
          />
        </div>
      )}
    </div>
  );
}

/** No photos yet — say so plainly rather than showing a broken frame. */
function EmptyPlate({ car }: { car: Car }) {
  return (
    <div className="hairline relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f8f5ec_0%,#e6dcc4_55%,#f1ead8_100%)]">
      <div
        aria-hidden
        className="absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[90px]"
      />
      <div className="relative px-8 text-center">
        <p className="font-display text-5xl font-600 leading-none text-ink-900/[0.13]">
          {car.model}
        </p>
        <p className="mt-6 text-sm text-stone-600">
          Photographs are being shot. Call us and we will send them on WhatsApp today.
        </p>
      </div>
    </div>
  );
}
