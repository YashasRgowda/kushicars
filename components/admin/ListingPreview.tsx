'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Home } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { formatPriceShort } from '@/lib/format';
import { EASE } from '@/components/ui/motion';
import type { Car } from '@/lib/types';

/**
 * The listing, exactly as a customer will meet it.
 *
 * This is the real card from the /cars page — not a mock-up of it — fed with
 * whatever is currently typed into the form. It answers the question the
 * owner actually has while filling this in, which is never "is the km field
 * valid" but "will this look any good".
 *
 * It costs him nothing: no button, no step, nothing to learn. It keeps up.
 */

function Live() {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      Live
    </span>
  );
}

/** The full card, for the column beside the form on a laptop. */
export function ListingPreview({ car }: { car: Car }) {
  return (
    <div className="sticky top-24">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
          What customers see
        </p>
        <Live />
      </div>

      <div
        className={`mt-5 transition-all duration-500 ease-premium ${
          car.sold ? 'opacity-40 saturate-0' : ''
        }`}
      >
        {/* On the real site the card is a link; here it is a picture of one. */}
        <div aria-hidden className="pointer-events-none select-none">
          <CarCard car={car} />
        </div>
      </div>

      <p className="mt-5 text-pretty text-[12px] leading-relaxed text-stone-600">
        {car.sold
          ? 'Marked sold — this card is not shown on the website at all.'
          : 'Updates as you type. This is the card on your Cars page, at the size most people see it.'}
      </p>

      {car.showcase && !car.sold && (
        <p className="mt-3 flex items-start gap-2 text-pretty text-[12px] leading-relaxed text-stone-700">
          <Home className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
          This car also leads the home page, in the large panel.
        </p>
      )}
    </div>
  );
}

/**
 * The phone version: a strip the height of a thumbnail that still shows the
 * cover, the name and the price live, and opens into the real card when he
 * wants to look properly.
 *
 * A full card at the top of a phone form would push every field a screen
 * further down, which is a tax he pays on every single edit.
 */
export function ListingPreviewBar({ car }: { car: Car }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 p-3 text-left"
      >
        <span
          className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-paper-300 ${
            car.sold ? 'opacity-45 grayscale' : ''
          }`}
        >
          {car.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={car.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-[10px] text-muted">
              No photo
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <Live />
          <span className="mt-1.5 block truncate font-display text-[15px] font-600 text-ink-900">
            {car.brand} {car.model}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap font-display text-[15px] font-600 tabular-nums text-ink-900">
            {formatPriceShort(car.price)}
          </span>
          <ChevronDown
            aria-hidden
            className={`h-4 w-4 text-stone-600 transition-transform duration-300 ease-premium ${
              open ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-line-soft p-3">
              <div
                aria-hidden
                className={`pointer-events-none select-none ${
                  car.sold ? 'opacity-40 saturate-0' : ''
                }`}
              >
                <CarCard car={car} />
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-stone-600">
                {car.sold
                  ? 'Marked sold — this card is not shown on the website at all.'
                  : 'This is the card on your Cars page.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
