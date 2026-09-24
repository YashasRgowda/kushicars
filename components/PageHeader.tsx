import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Eyebrow, Reveal, SplitText } from './ui/motion';

/**
 * The masthead on every interior page.
 *
 * Interior pages sit under a fixed navbar with no hero behind it, so they
 * open with a deep band of air — pt-40 — before anything is said. That pause
 * is most of what separates a page that reads expensive from one that reads
 * like a CMS template.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
  /**
   * For pages where the header is not the point — a car listing, where the
   * photograph has to be above the fold on a laptop, not half under it.
   */
  compact?: boolean;
}) {
  return (
    <header
      className={`relative overflow-hidden ${
        compact ? 'pb-8 pt-28 lg:pb-10 lg:pt-32' : 'pb-14 pt-36 lg:pb-20 lg:pt-44'
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={compact ? 'mb-5' : 'mb-8'}>
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight aria-hidden className="h-3 w-3 text-slate-700" />}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitText
          as="h1"
          text={title}
          className={`${compact ? 'mt-5' : 'mt-7'} block max-w-4xl font-display text-display-sm font-600 text-white`}
        />
        {lede && (
          <Reveal delay={0.15}>
            <p
              className={`${compact ? 'mt-3' : 'mt-7'} max-w-2xl text-pretty text-[17px] leading-relaxed text-slate-400`}
            >
              {lede}
            </p>
          </Reveal>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  );
}
