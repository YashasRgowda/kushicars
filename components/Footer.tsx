'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
} from 'lucide-react';
import type { Settings } from '@/lib/types';
import { dealerNumber, telHref, waTo } from '@/lib/whatsapp';
import { Eyebrow, Magnetic, Reveal, SplitText } from './ui/motion';
import WhatsAppMark from './icons/WhatsAppMark';
import Wordmark from './Wordmark';
import CallbackForm from './CallbackForm';

/**
 * Who built the site.
 *
 * The credit is a WhatsApp hand-off rather than a link to a homepage,
 * because the person it is aimed at — another shop owner who has just
 * scrolled this whole page and thought "I want one of these" — will send a
 * message tonight and will not fill in a contact form tomorrow. The opening
 * line names which site they are calling about, so an unknown number
 * arriving at 11pm is answerable straight away.
 */
/**
 * Routes that already close with their own visit-us block.
 *
 * About ends on "Come and have a look", carrying the address, the hours and
 * the phone number. Contact is that invitation for a whole page — address,
 * map, hours, directions and an enquiry form. Following either with the
 * footer's "Come and see it in person" is the same invitation twice inside
 * one screen, and on Contact it puts a SECOND form directly under the first,
 * which is worse than redundant: it asks somebody who has just filled one in
 * whether they would like to fill one in. These routes keep the slim bottom
 * bar and nothing else.
 */
const NO_INVITATION = new Set(['/about', '/contact']);

const MAKER = {
  label: 'Made by team svayam.ai',
  phone: '8095762180',
  message:
    "Hi Svayam, I saw the Kushi Cars website and I'd like a website like that for my business.",
};

export default function Footer({ settings }: { settings: Settings }) {
  // With no WhatsApp number and no email there is nowhere for a callback
  // request to go, so we show the address rather than a form into a void.
  const canSend = Boolean(dealerNumber(settings) || settings.email);

  // Through waTo, like every other wa.me link on the site — the number is
  // formatted and the message encoded in one place. Null would mean the
  // credit renders as plain type rather than as a dead link.
  const maker = waTo(MAKER.phone, MAKER.message);

  const showInvitation = !NO_INVITATION.has(usePathname());

  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden">
      {showInvitation && (
      <div className="section-y mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="hairline relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-paper to-paper-200 p-10 sm:p-14 lg:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/[0.06] blur-[110px]"
            />
            <div className="noise pointer-events-none absolute inset-0" />

            <div className="relative grid gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Left — the invitation */}
              <div>
                <Eyebrow>Visit the showroom</Eyebrow>
                <SplitText
                  as="h2"
                  text="Come and see it in person"
                  className="mt-6 block font-display text-display-sm font-600 text-ink-900"
                />
                <p className="mt-6 max-w-md text-pretty leading-relaxed text-stone-800/85">
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
                      className="hairline mt-8 inline-flex items-center gap-2.5 rounded-full bg-paper px-6 py-3.5 text-sm font-500 text-ink-900 shadow-card transition-colors duration-300 hover:bg-paper-200"
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
                <div className="hairline flex flex-col justify-center gap-4 rounded-2xl bg-paper p-8 text-center">
                  <p className="font-display text-2xl font-600 text-ink-900">
                    Drop in and see us
                  </p>
                  <p className="text-pretty text-sm leading-relaxed text-stone-700">
                    We are in Nagarbhavi, just off the Outer Ring Road by the
                    BDA Complex. No appointment needed — come and look at
                    whatever catches your eye.
                  </p>
                  {settings.hours && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-800">
                      {settings.hours}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-line-soft">
        <div className="mx-auto max-w-7xl px-6 py-9 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-5 text-sm text-stone-600 sm:flex-row">
            <Link href="/">
              <Wordmark name={settings.businessName} size="sm" />
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/cars" className="transition-colors hover:text-ink-900">
                Buy a car
              </Link>
              <Link href="/sell" className="transition-colors hover:text-ink-900">
                Sell your car
              </Link>
              <Link href="/about" className="transition-colors hover:text-ink-900">
                About
              </Link>
              <Link href="/contact" className="transition-colors hover:text-ink-900">
                Contact
              </Link>
            </nav>

            <p className="text-center sm:text-right">
              © {new Date().getFullYear()} {settings.businessName}, Bengaluru.
            </p>
          </div>

          {/* The maker's line. Deliberately the quietest thing on the page:
              it sits below the rule, in the muted tier, and only takes the
              brand green under the cursor. A builder's credit that competes
              with the showroom's own phone number is an advert on somebody
              else's shopfront. */}
          <div className="mt-6 border-t border-line-soft pt-6 text-center">
            {maker ? (
              <a
                href={maker}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[11px] text-muted transition-colors duration-300 hover:text-accent"
                aria-label={`${MAKER.label} — message us on WhatsApp`}
              >
                <WhatsAppMark className="h-3.5 w-3.5 transition-transform duration-300 ease-premium group-hover:scale-110" />
                {MAKER.label}
              </a>
            ) : (
              <p className="text-[11px] text-muted">{MAKER.label}</p>
            )}
          </div>
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
    'flex items-start gap-3.5 rounded-lg py-2.5 text-sm text-stone-800 transition-colors';

  if (!href) return <p className={cls}>{inner}</p>;

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${cls} hover:text-ink-900`}
    >
      {inner}
    </a>
  );
}
