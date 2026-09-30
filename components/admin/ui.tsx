import type { ReactNode } from 'react';

/**
 * The panel's furniture.
 *
 * Three pieces, used by every screen, so the owner meets the same shapes
 * everywhere: a masthead, a labelled section, and a row of small caps.
 *
 * The panel borrows the public site's vocabulary deliberately — Bodoni for
 * anything that names a thing, mono small caps for labels, hairlines instead
 * of boxes, and a lot of air. It should feel like the back room of the same
 * building, not a different product.
 */

export function PageTitle({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-[2rem] font-600 leading-[1.05] text-ink-900 sm:text-[2.6rem]">
          {title}
        </h1>
        {sub && (
          <p className="mt-3 text-[15px] leading-relaxed text-stone-700">{sub}</p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </header>
  );
}

/**
 * A labelled block of a form.
 *
 * The label sits in its own column on a wide screen, so the fields line up
 * down one edge and the page reads as a document rather than a grid of
 * boxes. Below lg it stacks, and the note becomes the intro line.
 */
export function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line-soft pt-10">
      <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[12rem_1fr]">
        <div className="lg:pt-1">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
            {title}
          </h2>
          {note && (
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-stone-600">
              {note}
            </p>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/**
 * A block of a form, label above the fields.
 *
 * Used where a column of fields has to share the width with something else
 * — the car form, which keeps a live preview of the listing beside it.
 */
export function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line-soft pt-9">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
        {title}
      </h2>
      {note && (
        <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-stone-600">
          {note}
        </p>
      )}
      <div className="mt-7">{children}</div>
    </section>
  );
}

/** The small caps label that opens a list. */
export function Rule({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
        {children}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
