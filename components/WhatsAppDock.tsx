'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Settings } from '@/lib/types';
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
            <svg
              viewBox="0 0 24 24"
              className="relative h-6 w-6"
              fill="currentColor"
              aria-hidden
            >
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
              <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 12.04 2zm0 17.94h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.14 8.14 0 0 1-1.25-4.35 8.2 8.2 0 0 1 8.2-8.19c2.19 0 4.25.86 5.8 2.41a8.13 8.13 0 0 1 2.4 5.79 8.2 8.2 0 0 1-8.2 8.18z" />
            </svg>
          </span>
          <span className="max-w-0 whitespace-nowrap text-sm font-500 text-white opacity-0 transition-all duration-500 ease-premium group-hover:max-w-[12rem] group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
