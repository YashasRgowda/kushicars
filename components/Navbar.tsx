'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import type { Settings } from '@/lib/types';
import { telHref } from '@/lib/whatsapp';
import { EASE, Magnetic } from './ui/motion';
import Wordmark from './Wordmark';

const links = [
  { label: 'Buy a car', href: '/cars' },
  { label: 'Sell your car', href: '/sell' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SHEET_ID = 'mobile-menu';

/**
 * How long the panel takes to fade out, and therefore how long after a close
 * it is removed from the page. Must match the `sheet-out` animation.
 */
const EXIT_MS = 240;

export default function Navbar({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /**
   * Two pieces of state, not one.
   *
   * `mounted` is whether the panel is in the page at all; `open` is whether
   * it is showing. They come apart for exactly as long as the fade-out runs,
   * and a timer WE own does the removal.
   *
   * This was AnimatePresence, and it left the panel behind. React closed the
   * menu — aria-expanded went to false, the scroll lock lifted — but the
   * exit never resolved, so a full-screen div stayed in the document at
   * opacity 0 with pointer-events auto. Every tap on the page after that
   * landed on an invisible menu. A timeout cannot fail to fire, and the
   * panel also drops its pointer events the instant it starts leaving, so
   * even if this were somehow still mounted it could not swallow a tap.
   */
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const exitTimer = useRef<number | null>(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    },
    [],
  );

  const openSheet = useCallback(() => {
    if (exitTimer.current !== null) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setMounted(true);
    setOpen(true);
  }, []);

  /**
   * `restoreFocus` is for the deliberate ways out — the close button and
   * Escape. Following a link out of the menu must NOT pull focus back to the
   * hamburger, because the destination page has its own first thing to land
   * on. Focus moves BEFORE the state changes, so it is never sitting inside
   * a panel that has just been hidden from assistive tech.
   */
  const closeSheet = useCallback((restoreFocus = false) => {
    if (restoreFocus) toggleRef.current?.focus();
    setOpen(false);
    if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setMounted(false);
      exitTimer.current = null;
    }, EXIT_MS);
  }, []);

  const dismiss = useCallback(() => closeSheet(true), [closeSheet]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Any navigation closes the sheet: a tap on a link, the back button, or a
   * redirect out of a server action.
   *
   * This used to be DERIVED — the sheet remembered which route it was opened
   * on and was "open" whenever that matched the current path. It closed
   * correctly on the way out and then re-opened itself on the way back:
   * return to that same route, the remembered path matches again, and the
   * menu is sitting there waiting. Open is something the visitor did, not a
   * fact about the URL, so it is its own state now.
   *
   * Adjusted during render rather than in an effect. React re-runs this
   * component immediately with the new value and commits once, so the sheet
   * is never painted open on the new route — where an effect would close it
   * a frame late, and would cost a second render pass besides.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    // No fade on the way out of a route change — the page underneath is
    // being replaced, so there is nothing for the panel to dissolve into.
    setMounted(false);
  }

  /**
   * While the sheet is up it owns the scroll and the Escape key.
   *
   * The previous value of `overflow` is captured and put back rather than
   * being cleared to '', so this cannot stamp on a lock somebody else is
   * holding — the intro curtain and the photo lightbox both take one.
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  // The home page has a full-bleed hero behind the bar; every other page
  // starts with content, so the bar needs its surface from the first pixel.
  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  // While the bar is transparent it is sitting on the hero video, which is
  // dark. Ink links would be invisible there, so the whole bar flips: light
  // type, a light pill, a white wordmark. It flips back the moment the bar
  // takes its own paper surface, and the 500ms colour transition on each
  // piece is what keeps that from reading as a blink.
  const onFootage = !solid;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /**
   * The mark always returns you to the top of the home page with the hero
   * playing. From another route that is just a navigation; from the home
   * page itself Next sees the same route and does nothing at all — no
   * scroll, no re-render — so the click is taken over here.
   *
   * The replay waits for the ride up to finish. Firing it on click would
   * start the reveal while the visitor is still a thousand pixels down the
   * page, and the hero fades out with scroll, so they would arrive to find
   * it already over.
   */
  const onMarkClick = (e: React.MouseEvent) => {
    closeSheet();
    if (pathname !== '/') return;
    e.preventDefault();

    const replay = () => window.dispatchEvent(new CustomEvent('kushi:replay-hero'));
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (still || window.scrollY === 0) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      replay();
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // `scrollend` is the accurate signal; the timer is the fallback for
    // browsers without it, and the guard keeps whichever lands first from
    // firing twice.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener('scrollend', finish);
      replay();
    };
    const timer = window.setTimeout(finish, 900);
    window.addEventListener('scrollend', finish, { once: true });
  };

  return (
    <>
      <motion.header
        data-site-chrome
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: isHome ? 0.1 : 0 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium ${
          solid
            ? 'border-b border-line bg-paper-100/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link
            href="/"
            aria-label="Kushi Cars — home"
            className="shrink-0"
            onClick={onMarkClick}
          >
            <Wordmark
              name={settings.businessName}
              tone={onFootage ? 'light' : 'ink'}
              priority
            />
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-1 text-sm font-400 tracking-wide transition-colors duration-300 ${
                    onFootage
                      ? active
                        ? 'text-white'
                        : 'text-stone-300 hover:text-white'
                      : active
                        ? 'text-ink-900'
                        : 'text-stone-700 hover:text-ink-900'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-500 ease-premium ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-5 lg:flex">
            {settings.phone && (
              <a
                href={telHref(settings.phone)}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  onFootage
                    ? 'text-stone-300 hover:text-white'
                    : 'text-stone-700 hover:text-ink-900'
                }`}
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                <span className="tabular-nums">{settings.phone}</span>
              </a>
            )}
            <Magnetic strength={0.2}>
              <Link
                href="/cars"
                className={`rounded-full px-5 py-2.5 text-sm font-500 shadow-lift transition-[transform,background-color,color] duration-300 ease-premium hover:scale-[1.04] ${
                  onFootage ? 'bg-ivory text-ink-950' : 'bg-accent text-white'
                }`}
              >
                View stock
              </Link>
            </Magnetic>
          </div>

          {/* Opens only. The way OUT lives inside the sheet, because a
              control in here cannot reach above it: this header is a
              stacking context of its own, so any z-index on a child of it is
              measured against the header's 50, not against the sheet's 100.
              The old close button carried z-[110] and was painted behind the
              panel on every phone — a menu with no visible way out. */}
          <button
            ref={toggleRef}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={SHEET_ID}
            aria-haspopup="dialog"
            onClick={openSheet}
            className={`grid h-11 w-11 place-items-center rounded-xl transition-colors duration-500 lg:hidden ${
              onFootage ? 'text-white' : 'text-ink-900'
            }`}
          >
            <Menu className="h-6 w-6" strokeWidth={1.6} />
          </button>
        </nav>
      </motion.header>

      {/* ---------------- The sheet ----------------

          Full bleed, and OPAQUE. It used to be paper at 95% with a blur,
          which let the bar underneath ghost through — and since the sheet
          now carries its own mark in the same position, that ghost landed
          directly behind it.

          Three bands: the mark and the way out at the top where the eye
          starts, the routes in the middle, and the two actions at the
          bottom where the thumb already is. */}
      {mounted && (
          <div
            id={SHEET_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            aria-hidden={open ? undefined : true}
            className={`fixed inset-0 z-[100] flex flex-col bg-paper-100 lg:hidden ${
              open
                ? 'animate-sheet-in'
                : 'pointer-events-none animate-sheet-out'
            }`}
          >
            <div className="noise pointer-events-none absolute inset-0" />

            <div className="relative flex h-20 shrink-0 items-center justify-between px-6">
              <Link
                href="/"
                aria-label="Kushi Cars — home"
                onClick={onMarkClick}
                className="shrink-0"
              >
                <Wordmark name={settings.businessName} />
              </Link>
              <button
                ref={closeRef}
                onClick={dismiss}
                aria-label="Close menu"
                className="-mr-1.5 grid h-11 w-11 place-items-center rounded-xl text-ink-900 transition-colors duration-300 hover:bg-paper-200"
              >
                <X className="h-6 w-6" strokeWidth={1.6} />
              </button>
            </div>

            {/* min-h-0 lets this scroll instead of pushing the actions off
                the bottom on a short screen — a phone held sideways. */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
              className="relative flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-4 sm:px-8"
            >
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <motion.div
                    key={l.href}
                    variants={{
                      hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.6, ease: EASE },
                      },
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => closeSheet()}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-baseline gap-4 border-b border-line py-5"
                    >
                      <span
                        className={`font-mono text-[10px] tabular-nums transition-colors ${
                          active ? 'text-accent' : 'text-muted'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-display text-3xl font-500 transition-colors sm:text-4xl ${
                          active ? 'text-accent-ink' : 'text-ink-900'
                        }`}
                      >
                        {l.label}
                      </span>
                      {active && (
                        <span
                          aria-hidden
                          className="ml-auto h-1.5 w-1.5 shrink-0 self-center rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
              className="relative shrink-0 space-y-3 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4 sm:px-8"
            >
              <Link
                href="/cars"
                onClick={() => closeSheet()}
                className="block rounded-full bg-accent px-6 py-4 text-center text-sm font-500 text-white shadow-lift-accent"
              >
                View stock
              </Link>
              {settings.phone && (
                <a
                  href={telHref(settings.phone)}
                  className="flex items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-6 py-4 text-sm text-stone-800"
                >
                  <Phone className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  <span className="tabular-nums">{settings.phone}</span>
                </a>
              )}
            </motion.div>
          </div>
      )}
    </>
  );
}
