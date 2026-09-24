'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------
   SplitText — words rise out from behind a mask.

   The mask is what separates this from a fade: type appears to be printed
   on a surface moving up past a window, rather than materialising in space.
   Words (not characters) keep it legible and keep the node count sane.
   ------------------------------------------------------------------ */

export function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.055,
  duration = 0.95,
  as: Tag = 'span',
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = motion[Tag];

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12%' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          // pb/-mb gives descenders (g, y, p) room so the mask doesn't clip them
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
        >
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: '115%' },
              show: { y: '0%', transition: { duration, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------
   Reveal — the house entrance. One distance, one easing, everywhere.
   ------------------------------------------------------------------ */

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
  blur = true,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'none' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

/* ------------------------------------------------------------------
   Magnetic — the control leans toward the cursor before you reach it.

   Costs nothing, and it is the detail people describe as "feels expensive"
   without being able to name it.
   ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------
   Eyebrow — the small caps label above every section heading.
   ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  centered = false,
  className = '',
}: {
  children: ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`flex items-center gap-4 ${centered ? 'justify-center' : ''} ${className}`}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="h-px w-12 origin-left bg-gradient-to-r from-accent to-accent/20"
      />
      <span className="text-[11px] font-500 uppercase tracking-eyebrow text-slate-400">
        {children}
      </span>
      {centered && (
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="h-px w-12 origin-right bg-gradient-to-l from-accent to-accent/20"
        />
      )}
    </motion.div>
  );
}
