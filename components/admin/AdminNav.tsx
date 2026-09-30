'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Inbox, Settings as SettingsIcon } from 'lucide-react';

/**
 * Two destinations, and it should always be obvious which one you are on.
 *
 * The underline is the same one the public navbar uses, so the panel reads
 * as part of the same site. Labels stay visible on a phone — a bare pair of
 * icons saves twenty pixels and costs the owner a guess.
 */
const links = [
  { href: '/admin', label: 'Cars', icon: Car },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { href: '/admin/settings', label: 'Contact details', icon: SettingsIcon },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin' || pathname.startsWith('/admin/cars')
      : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1">
      {links.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={`group relative flex items-center gap-2 px-3 py-2 text-[13px] transition-colors duration-300 sm:text-sm ${
              active ? 'text-ink-900' : 'text-stone-700 hover:text-ink-900'
            }`}
          >
            <l.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {l.label}
            <span
              className={`absolute inset-x-3 -bottom-0.5 h-px bg-accent transition-transform duration-500 ease-premium ${
                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
