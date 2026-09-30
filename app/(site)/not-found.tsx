import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col justify-center px-6 py-40">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
        404
      </p>
      <h1 className="mt-7 font-display text-display-sm font-600 leading-tight text-ink-900">
        That one has moved on.
      </h1>
      <p className="mt-6 max-w-lg text-pretty text-[17px] leading-relaxed text-stone-700">
        Either the car has been sold, or the link is wrong. Stock turns over
        quickly here — have a look at what is on the floor today.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/cars"
          className="rounded-full bg-accent px-7 py-3.5 text-sm font-500 text-white shadow-lift transition-transform duration-300 ease-premium hover:scale-[1.03]"
        >
          See the collection
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-line px-7 py-3.5 text-sm text-stone-800 transition-colors hover:border-line-strong hover:text-ink-900"
        >
          Tell us what you want
        </Link>
      </div>
    </div>
  );
}
