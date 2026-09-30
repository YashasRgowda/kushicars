'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Settings } from '@/lib/types';
import WhatsAppMark from './icons/WhatsAppMark';
import { EASE } from './ui/motion';

/**
 * In this market WhatsApp is the enquiry channel — not the contact form.
 * Docks in once the hero is behind you so it never covers the opening frame.
 */
export default function WhatsAppDock({ settings }: { settings: Settings }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const number = (settings.whatsapp ?? settings.phone)?.replace(/[^\d]/g, '');
  if (!number) return null;

  // Indian numbers are stored locally as often as with the country code.
  const intl = number.length === 10 ? `91${number}` : number;
  const text = encodeURIComponent(
    `Hi ${settings.businessName}, I saw a car on your website and would like to know more.`,
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          data-site-chrome
          href={`https://wa.me/${intl}?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="group fixed bottom-6 right-6 z-[90] flex items-center gap-0 overflow-hidden rounded-full bg-[#0d1512]/85 pl-1 pr-1 shadow-lift backdrop-blur-xl ring-1 ring-emerald-400/25 transition-all duration-500 ease-premium hover:gap-2 hover:pr-5"
          aria-label={`Message ${settings.businessName} on WhatsApp`}
        >
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#062017]">
            <span
              aria-hidden
              className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]"
            />
            <WhatsAppMark className="relative h-6 w-6" />
          </span>
          <span className="max-w-0 whitespace-nowrap text-sm font-500 text-ink-900 opacity-0 transition-all duration-500 ease-premium group-hover:max-w-[12rem] group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
