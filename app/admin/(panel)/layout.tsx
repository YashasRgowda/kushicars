import Link from 'next/link';
import { Car, Settings as SettingsIcon, LogOut, ExternalLink } from 'lucide-react';
import { signOut } from '../actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-ink-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-white">
                <span className="font-display text-sm font-700 leading-none">
                  K
                </span>
              </span>
              <span className="font-display text-lg font-600">
                Kushi Cars<span className="text-accent">.</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink href="/admin" icon={<Car className="h-4 w-4" />}>
                Cars
              </NavLink>
              <NavLink
                href="/admin/settings"
                icon={<SettingsIcon className="h-4 w-4" />}
              >
                Contact details
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs text-slate-300 transition-colors hover:border-white/25 hover:text-white sm:flex"
            >
              View website <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs text-slate-400 transition-colors hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}
