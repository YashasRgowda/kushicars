import { getSettings } from '@/lib/cars';
import { siteUrl } from '@/lib/site';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppDock from '@/components/WhatsAppDock';
import ScrollProgress from '@/components/ScrollProgress';

/**
 * Chrome for every public page.
 *
 * The admin panel lives outside this route group, so it keeps its own shell
 * and never pays for the marketing navbar.
 *
 * Settings are fetched once here rather than per page. Next dedupes the
 * request across the layout and the page beneath it in the same render.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      {/* One AutoDealer block for the whole public site — the knowledge-panel
          entry for a business whose customers all arrive via local search. */}
      <LocalBusinessJsonLd settings={settings} siteUrl={siteUrl} />
      <ScrollProgress />
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppDock settings={settings} />
    </div>
  );
}
