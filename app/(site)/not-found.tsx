import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col justify-center px-6 py-40">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
        404
      </p>
      <h1 className="mt-7 font-display text-display-sm font-600 leading-tight text-white">
        That one has moved on.
      </h1>
      <p className="mt-6 max-w-lg text-pretty text-[17px] leading-relaxed text-slate-400">
        Either the car has been sold, or the link is wrong. Stock turns over
        quickly here — have a look at what is on the floor today.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/cars"
          className="rounded-full bg-platinum px-7 py-3.5 text-sm font-500 text-ink-950 shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.03]"
        >
          See the collection
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/12 px-7 py-3.5 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
        >
          Tell us what you want
        </Link>
      </div>
    </div>
  );
}
