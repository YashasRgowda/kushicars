'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, FileCheck2, Banknote, Wrench } from 'lucide-react';
import { EASE, Eyebrow, Reveal, SplitText } from './ui/motion';

/**
 * Four promises, told as a narrative rather than a card grid — a sticky
 * column of type on the left, the steps moving past it on the right.
 *
 * The copy is deliberately specific to how a car actually changes hands in
 * Karnataka. Generic luxury language ("white-glove", "concierge") is what
 * made this read as a template.
 */
const steps = [
  {
    icon: ShieldCheck,
    title: 'Inspected on 140 points',
    body: 'Engine, gearbox, suspension, electricals, underbody and paint depth — checked and photographed before a car earns a place on the floor. You get the full report, including whatever we found.',
    meta: 'Report shared before you pay',
  },
  {
    icon: FileCheck2,
    title: 'RC transfer, handled end to end',
    body: 'Form 29 and 30, NOC where the car is from another state, insurance transfer and the RTO follow-up. We file it, we chase it, and we tell you when it lands.',
    meta: 'Typically 21–30 days',
  },
  {
    icon: Banknote,
    title: 'Finance arranged the same day',
    body: 'We work with leading banks and NBFCs on used-car loans. Bring your KYC and salary slips in the morning and you will usually have a sanction by evening.',
    meta: 'Up to 85% of value',
  },
  {
    icon: Wrench,
    title: 'We are still here afterwards',
    body: 'A one-year engine and gearbox warranty, a free first service, and a number that a person actually answers when something needs sorting.',
    meta: '1-year warranty included',
  },
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.06] bg-ink-900/60 py-28 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-accent/[0.07] blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24 lg:px-10">
        {/* Left — holds its position while the steps travel past */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>The Kushi Cars Experience</Eyebrow>
          <SplitText
            as="h2"
            text="Buying used, without the used-car part"
            className="mt-6 block font-display text-display-sm font-600 text-white"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-slate-300/85">
              The car is the easy bit. What actually goes wrong is the
              paperwork, the finance and the silence after the sale. So that is
              the part we built the business around.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-3 text-sm font-500 text-white"
            >
              <span className="relative">
                Talk to us before you buy anywhere
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-premium group-hover:scale-x-100" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* Right — the steps */}
        <div ref={ref} className="relative">
          {/* Rail that fills as you read down it */}
          <div
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-white/[0.08] sm:block"
          >
            <motion.div
              style={{ scaleY: railScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent to-transparent"
            />
          </div>

          <div className="flex flex-col sm:pl-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="group relative border-b border-white/[0.08] py-9 first:pt-0 last:border-b-0 last:pb-0"
              >
                {/* Node on the rail */}
                <span
                  aria-hidden
                  className="absolute -left-12 top-11 hidden h-2 w-2 -translate-x-[3.5px] rounded-full bg-ink-600 ring-4 ring-ink-900 transition-colors duration-500 group-hover:bg-accent sm:block"
                />

                <div className="flex items-start gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent transition-all duration-500 ease-premium group-hover:scale-105 group-hover:bg-accent group-hover:text-white">
                    <s.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display text-2xl font-600 text-white">
                        {s.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-3 text-pretty leading-relaxed text-slate-400">
                      {s.body}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {s.meta}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
