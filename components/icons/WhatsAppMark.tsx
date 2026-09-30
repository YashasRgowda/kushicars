/**
 * The WhatsApp glyph.
 *
 * Lucide has no WhatsApp mark — it ships no brand logos — so this is the
 * official one, traced as two paths. It lived inline in the floating dock
 * until the footer credit needed it too; a second hand-copied SVG is how a
 * brand mark ends up subtly wrong in one of the two places.
 *
 * It inherits `currentColor`, so the caller decides whether it is WhatsApp
 * green on a dark pill or the same muted ink as the line of type beside it.
 */
export default function WhatsAppMark({
  className = 'h-4 w-4',
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.8 9.8 0 0 0 12.04 2zm0 17.94h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.14 8.14 0 0 1-1.25-4.35 8.2 8.2 0 0 1 8.2-8.19c2.19 0 4.25.86 5.8 2.41a8.13 8.13 0 0 1 2.4 5.79 8.2 8.2 0 0 1-8.2 8.18z" />
    </svg>
  );
}
