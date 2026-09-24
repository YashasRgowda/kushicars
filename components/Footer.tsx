'use client';

import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
} from 'lucide-react';
import type { Settings } from '@/lib/types';
import { dealerNumber, telHref } from '@/lib/whatsapp';
import { Eyebrow, Magnetic, Reveal, SplitText } from './ui/motion';
import Wordmark from './Wordmark';
import CallbackForm from './CallbackForm';

export default function Footer({ settings }: { settings: Settings }) {
  // With no WhatsApp number and no email there is nowhere for a callback
  // request to go, so we show the address rather than a form into a void.
  const canSend = Boolean(dealerNumber(settings) || settings.email);

  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <div className="hairline relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-800 to-ink-950 p-10 sm:p-14 lg:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-[110px]"
            />
            <div className="noise pointer-events-none absolute inset-0" />

            <div className="relative grid gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Left — the invitation */}
              <div>
                <Eyebrow>Visit the showroom</Eyebrow>
                <SplitText
                  as="h2"
                  text="Come and see it in person"
                  className="mt-6 block font-display text-display-sm font-600 text-white"
                />
                <p className="mt-6 max-w-md text-pretty leading-relaxed text-slate-300/85">
                  Photographs only go so far. Drive it, look underneath it, and
                  bring someone who knows cars. We would rather you were sure.
                </p>

                <div className="mt-10 space-y-1">
                  {settings.phone && (
                    <ContactRow
                      icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
                      href={telHref(settings.phone)}
                    >
                      {settings.phone}
                    </ContactRow>
                  )}
                  {settings.email && (
                    <ContactRow
                      icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
                      href={`mailto:${settings.email}`}
                    >
                      {settings.email}
                    </ContactRow>
                  )}
                  {settings.address && (
                    <ContactRow
                      icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
                      href={
                        settings.mapUrl ??
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          settings.address,
                        )}`
                      }
                      external
                    >
                      {settings.address}
                    </ContactRow>
                  )}
                  {settings.hours && (
                    <ContactRow
                      icon={<Clock className="h-4 w-4" strokeWidth={1.5} />}
                    >
                      {settings.hours}
                    </ContactRow>
                  )}
                </div>

                {settings.address && (
                  <Magnetic strength={0.18}>
                    <a
                      href={
                        settings.mapUrl ??
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          settings.address,
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hairline mt-8 inline-flex items-center gap-2.5 rounded-full bg-white/[0.05] px-6 py-3.5 text-sm font-500 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.1]"
                    >
                      <Navigation className="h-4 w-4 text-accent" strokeWidth={1.5} />
                      Get directions
                    </a>
                  </Magnetic>
                )}
              </div>

              {/* Right — callback request, when there is somewhere to send it */}
              {canSend ? (
                <CallbackForm settings={settings} />
              ) : (
                <div className="hairline flex flex-col justify-center gap-4 rounded-2xl bg-white/[0.03] p-8 text-center">
                  <p className="font-display text-2xl font-600 text-white">
                    Drop in and see us
                  </p>
                  <p className="text-pretty text-sm leading-relaxed text-slate-400">
                    We are in Nagarbhavi, just off the Outer Ring Road by the
                    BDA Complex. No appointment needed — come and look at
                    whatever catches your eye.
                  </p>
                  {settings.hours && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">
                      {settings.hours}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-9 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-5 text-sm text-slate-500 sm:flex-row">
            <Link href="/">
              <Wordmark name={settings.businessName} size="sm" />
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/cars" className="transition-colors hover:text-white">
                Buy a car
              </Link>
              <Link href="/sell" className="transition-colors hover:text-white">
                Sell your car
              </Link>
              <Link href="/about" className="transition-colors hover:text-white">
                About
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </nav>

            <p className="text-center sm:text-right">
              © {new Date().getFullYear()} {settings.businessName}, Bengaluru.
            </p>
          </div>

          {/* Required while the demo ships Wikimedia photography — see
              public/cars/ATTRIBUTION.md. Delete once Kushi Cars' own
              photographs replace them. */}
          <p className="mt-6 border-t border-white/[0.04] pt-6 text-center text-[11px] leading-relaxed text-slate-600">
            Vehicle photographs are placeholders sourced from Wikimedia Commons
            and used under CC BY / CC BY-SA licences. They are illustrative and
            do not depict the specific vehicles listed.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({
  icon,
  href,
  external = false,
  children,
}: {
  icon: React.ReactNode;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="mt-0.5 shrink-0 text-accent">{icon}</span>
      <span className="text-pretty">{children}</span>
    </>
  );
  const cls =
    'flex items-start gap-3.5 rounded-lg py-2.5 text-sm text-slate-300 transition-colors';

  if (!href) return <p className={cls}>{inner}</p>;

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${cls} hover:text-white`}
    >
      {inner}
    </a>
  );
}
