'use client';

import { usePathname } from 'next/navigation';

/**
 * The arrival. Every route fades up as one piece before its own contents
 * begin, so a page opens rather than simply being there.
 *
 * Two deliberate constraints.
 *
 * It is a CSS animation, not a JS one. A framer-motion `initial={{opacity:0}}`
 * is written into the server HTML as an inline style and only cleared once
 * the library runs — so anything that stops it running (a hydration error, a
 * background tab throttling rAF) leaves the ENTIRE page invisible, which is
 * a far worse failure than one block not animating. A keyframe finishes on
 * its own regardless, and the reduced-motion rule in globals.css collapses
 * it to nothing for anyone who asked for that.
 *
 * And it is opacity ONLY. A `transform` or `filter` here would make this div
 * the containing block for every `position: fixed` descendant — the mobile
 * filter sheet on the collection, the photo lightbox on a listing — and they
 * would anchor to it instead of the viewport. The movement lives one level
 * down in PageHeader, where nothing is fixed.
 *
 * Keyed on the pathname so the node remounts and the keyframe replays on
 * every navigation.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
