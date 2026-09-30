'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Inbox, Settings as SettingsIcon } from 'lucide-react';

/**
 * The phone's navigation.
 *
 * A bar across the bottom rather than links in the header, because the
 * owner is holding the phone in one hand on a forecourt and his thumb
 * reaches the bottom of the screen, not the top.
 *
 * It stands down on the add and edit screens: those have a Save bar of
 * their own at the bottom, and two bars stacked on a phone is the sort of
 * thing that makes software feel cheap.
 */
const tabs = [
  { href: '/admin', label: 'Cars', icon: Car },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { href: '/admin/settings', label: 'Details', icon: SettingsIcon },
];

export default function AdminTabBar() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin/cars')) return null;

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/90 backdrop-blur-xl sm:hidden"
    >
      <div className="mx-auto grid max-w-sm grid-cols-3 px-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5">
        {tabs.map((t) => {
          const active = isActive(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-1.5 transition-colors duration-300 ${
                active ? 'text-ink-900' : 'text-stone-600'
              }`}
            >
              <t.icon
                className="h-[18px] w-[18px]"
                strokeWidth={active ? 2 : 1.6}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em]">
                {t.label}
              </span>
              <span
                className={`h-px w-5 rounded-full transition-colors duration-300 ${
                  active ? 'bg-accent' : 'bg-transparent'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
