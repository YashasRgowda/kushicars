'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, MessageCircle } from 'lucide-react';
import { EASE, Eyebrow, Reveal, SplitText } from './ui/motion';

/**
 * Answers written for the market the showroom is actually in. The previous
 * set promised enclosed transport across the continental United States and
 * quoted APR — for a forecourt in Nagarbhavi.
 */
const faqs = [
  {
    q: 'Can I take a test drive first?',
    a: 'Always. Come to the showroom and drive it properly — take it onto the Outer Ring Road, not just around the block. If you want your own mechanic to look at it, bring them. We have never said no to that.',
  },
  {
    q: 'Is the listed price negotiable?',
    a: 'The price on the site is the price we expect to sell at, and it already accounts for what we spent reconditioning the car. There is usually a little room, and we would rather talk about it in person than play a long back-and-forth over the phone.',
  },
  {
    q: 'Who handles the RC transfer and insurance?',
    a: 'We do, and it is included. Forms 29 and 30, the NOC if the car came from outside Karnataka, and the insurance transfer. It normally completes in 21 to 30 days, and we message you when the RTO confirms it.',
  },
  {
    q: 'Do you arrange finance?',
    a: 'Yes, through leading banks and NBFCs that lend on used cars. Rates typically run between 10.5% and 15% a year depending on the car, its age and your profile, and we can usually fund up to 85% of the value. Bring KYC and three months of salary slips or bank statements and a sanction generally comes through the same day.',
  },
  {
    q: 'Will you take my current car in exchange?',
    a: 'We will. Bring it in and we will value it against live market data while you wait — no obligation to go ahead. If you do, the value comes straight off the car you are buying and we handle the transfer paperwork on both.',
  },
  {
    q: 'What happens if something goes wrong afterwards?',
    a: 'Every car comes with a one-year engine and gearbox warranty and a free first service. Beyond that, call us. We are a Nagarbhavi showroom with our name on the door — sorting things out afterwards is cheaper for us than a bad review.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/[0.06] py-28 lg:py-36"
    >
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div className="text-center">
          <Eyebrow centered>Questions</Eyebrow>
          <SplitText
            as="h2"
            text="Everything you need to know"
            className="mt-6 block font-display text-display-sm font-600 text-white"
          />
        </div>

        {/* Full-width rows — a different rhythm from the grids above */}
        <div className="mt-16 border-t border-white/[0.08]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.05, 0.25)} blur={false} y={16}>
                <div className="border-b border-white/[0.08]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-6 py-7 text-left"
                  >
                    <span
                      className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                        isOpen ? 'text-accent' : 'text-slate-600'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-display text-xl font-500 transition-colors duration-300 sm:text-2xl ${
                        isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? 'border-accent bg-accent text-white'
                          : 'border-white/15 text-slate-400 group-hover:border-white/40'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl text-pretty pb-8 pl-12 pr-12 leading-relaxed text-slate-400">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="hairline mt-14 flex flex-col items-center gap-5 rounded-3xl bg-white/[0.03] px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-display text-lg font-600 text-white">
                  Still deciding?
                </p>
                <p className="mt-0.5 text-sm text-slate-400">
                  Ask us anything — no obligation, no follow-up calls you did
                  not ask for.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-accent px-6 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.04]"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
