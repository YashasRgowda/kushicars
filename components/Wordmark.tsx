/**
 * The logo lockup. One component so the monogram, the wordmark and the
 * full stop never drift apart between the navbar, the footer and the
 * preloader.
 *
 * The K is set in Bodoni against a red tile; the name sits beside it in the
 * same face. The stop is accent-coloured — a small thing that makes the mark
 * read as designed rather than typed.
 */
export default function Wordmark({
  name = 'Kushi Cars',
  size = 'md',
  className = '',
}: {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const tile = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-base',
    lg: 'h-12 w-12 text-xl',
  }[size];

  const word = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  return (
    <span className={`group flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-md bg-accent text-white shadow-glow transition-transform duration-300 ease-premium group-hover:scale-105 ${tile}`}
      >
        <span className="font-display font-700 leading-none tracking-tight">K</span>
      </span>
      <span className={`font-display font-600 tracking-wide text-white ${word}`}>
        {name}
        <span className="text-accent">.</span>
      </span>
    </span>
  );
}
