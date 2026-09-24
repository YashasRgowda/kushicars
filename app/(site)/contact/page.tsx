import type { Metadata } from 'next';
import { Clock, MapPin, MessageCircle, Phone, Mail } from 'lucide-react';
import { getSettings } from '@/lib/cars';
import { BUSINESS, fullAddress } from '@/lib/business';
import { siteUrl } from '@/lib/site';
import { messages, telHref, waLink } from '@/lib/whatsapp';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import { Reveal } from '@/components/ui/motion';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact & Directions — Nagarbhavi, Bengaluru',
  description:
    'Kushi Cars, 19/1 near BDA Complex, Marilingappa Extension, 2nd Stage, Nagarbhavi, Bengaluru 560072. Call, WhatsApp, or come and see the cars in person.',
  alternates: { canonical: '/contact' },
};

/** An embed needs no API key and loads the place card with directions. */
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  `Kushi Cars, ${fullAddress()}`,
)}&output=embed`;

export default async function ContactPage() {
  const settings = await getSettings();
  const address = settings.address ?? fullAddress();
  const directions =
    settings.mapUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const wa = waLink(settings, messages.general(settings.businessName));

  return (
    <>
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <PageHeader
        eyebrow="Come and see us"
        title="Nagarbhavi, Bengaluru"
        lede="The cars are on the floor, not in a catalogue. Drop in, drive whatever you like, and bring your own mechanic if you want one."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10 lg:pb-44">
        <div className="grid gap-x-16 gap-y-16 border-t border-white/[0.07] pt-14 lg:grid-cols-2">
          {/* ---------------- Details ---------------- */}
          <div>
            <Reveal>
              <dl className="space-y-9">
                <Detail icon={MapPin} label="Address">
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pretty leading-relaxed text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {address}
                  </a>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600">
                    Plus code XGG6+H8
                  </p>
                </Detail>

                {settings.phone && (
                  <Detail icon={Phone} label="Phone">
                    <a
                      href={telHref(settings.phone)}
                      className="text-lg tabular-nums text-white transition-colors hover:text-accent"
                    >
                      {settings.phone}
                    </a>
                  </Detail>
                )}

                {settings.email && (
                  <Detail icon={Mail} label="Email">
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-300 transition-colors hover:text-white"
                    >
                      {settings.email}
                    </a>
                  </Detail>
                )}

                {settings.hours && (
                  <Detail icon={Clock} label="Opening hours">
                    <p className="text-slate-300">{settings.hours}</p>
                  </Detail>
                )}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-11 flex flex-wrap gap-3">
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                    WhatsApp us
                  </a>
                )}
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/12 px-6 py-3.5 text-sm text-slate-200 transition-colors hover:border-white/30 hover:text-white"
                >
                  Get directions
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="hairline mt-11 overflow-hidden rounded-2xl">
                <iframe
                  title={`Map showing ${settings.businessName} in ${BUSINESS.locality}`}
                  src={mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-dark block h-[340px] w-full border-0"
                />
              </div>
            </Reveal>
          </div>

          {/* ---------------- Form ---------------- */}
          <div>
            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl font-600 text-white">
                Or send us a message
              </h2>
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-slate-400">
                Tell us what you are looking for. If it is not on the floor
                today, we will usually find it within a fortnight.
              </p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
      <div className="min-w-0">
        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {label}
        </dt>
        <dd className="mt-2.5">{children}</dd>
      </div>
    </div>
  );
}
