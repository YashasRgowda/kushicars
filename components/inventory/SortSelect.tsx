'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import type { SortKey } from '@/lib/types';
import { SORT_OPTIONS } from '@/lib/filters';
import { EASE } from '@/components/ui/motion';

/**
 * A listbox, not a native <select>.
 *
 * The browser's own dropdown renders in the OS chrome — light grey, system
 * font, square corners. On a page this dark it is the single loudest tell
 * that the design stops at the edge of the HTML.
 */
export default function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-5 pr-4 text-sm text-slate-200 transition-colors duration-300 hover:border-white/20 hover:text-white"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Sort
        </span>
        <span>{current.label}</span>
        <ChevronDown
          aria-hidden
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ease-premium ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="glass absolute right-0 z-30 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-white/10 p-1.5"
          >
            {SORT_OPTIONS.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[13px] transition-colors duration-200 ${
                      active
                        ? 'bg-white/[0.07] text-white'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {o.label}
                    {active && <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
