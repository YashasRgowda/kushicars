import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import AdminTabBar from '@/components/admin/AdminTabBar';
import Wordmark from '@/components/Wordmark';
import { signOut } from '../actions';

/**
 * The shell around every panel screen.
 *
 * One bar, two destinations, and a lot of air beneath it. The content column
 * is narrower than the public site's on purpose: a settings screen that runs
 * the full width of a desktop monitor is tiring to fill in, and nothing here
 * needs more than this.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-paper-100 text-ink-900">
      {/* The same faint bloom the public pages open with. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[460px] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(220,38,38,0.045),transparent_72%)]"
      />

      <header className="sticky top-0 z-40 border-b border-line bg-paper-100/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-5xl items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-7">
            <Link
              href="/admin"
              aria-label="Kushi Cars admin — your cars"
              className="group flex shrink-0 items-center gap-2.5"
            >
              <Wordmark name="Kushi Cars" size="sm" priority />
            </Link>

            <span aria-hidden className="hidden h-6 w-px bg-line-strong sm:block" />

            {/* On a phone the navigation lives in the bar at the bottom,
                where the thumb is. */}
            <div className="hidden sm:block">
              <AdminNav />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] text-stone-800 transition-colors duration-300 hover:border-line-strong hover:text-ink-900 sm:flex"
            >
              View website
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.6} />
            </a>
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-stone-600 transition-colors duration-300 hover:text-ink-900"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.6} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pb-36 pt-12 sm:pb-28 sm:pt-14 lg:pt-20">
        {children}
      </main>

      <AdminTabBar />
    </div>
  );
}
