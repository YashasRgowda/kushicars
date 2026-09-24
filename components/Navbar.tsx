'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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

export default function Navbar({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // The sheet remembers which route it was opened on, and a route change
  // therefore closes it — including a back-button one — without an effect
  // reaching in to reset it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The mobile sheet owns the scroll while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // The home page has a full-bleed hero behind the bar; every other page
  // starts with content, so the bar needs its surface from the first pixel.
  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: isHome ? 0.1 : 0 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium ${
          solid
            ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" aria-label="Kushi Cars — home" className="shrink-0">
            <Wordmark name={settings.businessName} />
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
                    active ? 'text-white' : 'text-slate-400 hover:text-white'
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
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                <span className="tabular-nums">{settings.phone}</span>
              </a>
            )}
            <Magnetic strength={0.2}>
              <Link
                href="/cars"
                className="rounded-full bg-platinum px-5 py-2.5 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.04]"
              >
                View stock
              </Link>
            </Magnetic>
          </div>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="relative z-[110] grid h-10 w-10 place-items-center rounded-md text-white lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile sheet — full bleed, staggered in. A cramped dropdown was the
          tell that this was a template. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[100] bg-ink-1000/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative flex h-dvh flex-col justify-center px-8">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                }}
                className="flex flex-col gap-1"
              >
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    variants={{
                      hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.7, ease: EASE },
                      },
                    }}
                  >
                    <Link
                      href={l.href}
                      className="flex items-baseline gap-4 border-b border-white/[0.07] py-5"
                    >
                      <span className="font-mono text-[10px] tabular-nums text-slate-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-3xl font-500 text-white">
                        {l.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                className="mt-10 flex flex-col gap-3"
              >
                <Link
                  href="/cars"
                  className="rounded-full bg-accent px-6 py-4 text-center text-sm font-500 text-white shadow-lift-accent"
                >
                  View stock
                </Link>
                {settings.phone && (
                  <a
                    href={telHref(settings.phone)}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/12 px-6 py-4 text-sm text-slate-200"
                  >
                    <Phone className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    <span className="tabular-nums">{settings.phone}</span>
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
