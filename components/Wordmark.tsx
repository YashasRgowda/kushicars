import Image from 'next/image';

/**
 * The logo lockup. One component so every appearance of the mark — navbar,
 * footer, preloader, admin — is the same artwork at the same proportions.
 *
 * It used to draw the mark: a Bodoni "K" on a red tile with the name beside
 * it. That was a stand-in. This now serves the owner's actual logo, and the
 * component's whole job is choosing which of the four files to hand over.
 *
 * Two axes:
 *
 * `variant` — the tagline is set small inside the artwork, so below roughly
 * 80px of lockup height "DRIVE HOME HAPPY" stops being type and becomes a
 * smudge. `mark` is the same lockup with it cropped off, and it is what the
 * navbar and footer get.
 *
 * `tone` — the navbar crosses the hero video, which is dark, and the name is
 * a deep forest green that vanishes on it. The `-light` files are a proper
 * reverse: the artwork is a DARK body with BRIGHT trim, so flipping the
 * ground to ink means flipping that relationship too — bright body, dark
 * trim. Recolouring the body alone leaves the gold with nothing to sit
 * against and the car turns to mush at navbar size.
 *
 * Sizing is by HEIGHT. The lockup is a fixed shape, and its height is what
 * has to agree with the bar or block it sits in; the width follows.
 */

const ART = {
  full: { src: '/brand/logo.png', light: '/brand/logo-light.png', w: 844, h: 420 },
  mark: { src: '/brand/logo-mark.png', light: '/brand/logo-mark-light.png', w: 571, h: 240 },
} as const;

/** Rendered height per step, and the Tailwind class that matches it. Kept
 *  together so the size handed to next/image can never drift from the size
 *  the browser actually lays out. */
const SIZES = {
  sm: { cls: 'h-11', px: 44 },
  md: { cls: 'h-14', px: 56 },
  lg: { cls: 'h-20', px: 80 },
  // The tagline is about 8.8% of the full lockup's height, so it needs ~128px
  // of lockup before it is type rather than a smudge. That is why `full` and
  // `xl` travel together.
  xl: { cls: 'h-32', px: 128 },
} as const;

export default function Wordmark({
  name = 'Kushi Cars',
  size = 'md',
  variant = 'mark',
  tone = 'ink',
  priority = false,
  className = '',
}: {
  /** Alt text only — the name is part of the artwork. */
  name?: string;
  size?: keyof typeof SIZES;
  /** 'full' includes the tagline and needs ~80px of height to earn it. */
  variant?: keyof typeof ART;
  /** 'light' for the navbar while it is over the hero video. */
  tone?: 'ink' | 'light';
  /** Set on the navbar, which is in the first paint. */
  priority?: boolean;
  className?: string;
}) {
  const art = ART[variant];
  const { cls, px } = SIZES[size];

  return (
    <Image
      src={tone === 'light' ? art.light : art.src}
      alt={name}
      width={art.w}
      height={art.h}
      priority={priority}
      sizes={`${Math.round((px * art.w) / art.h)}px`}
      className={`${cls} w-auto select-none transition-transform duration-300 ease-premium group-hover:scale-[1.03] ${className}`}
    />
  );
}
