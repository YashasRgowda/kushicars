import { requireUser } from '@/lib/auth';
import { getSettings } from '@/lib/cars';
import SettingsForm from '@/components/admin/SettingsForm';
import { PageTitle } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireUser();
  const settings = await getSettings();

  return (
    <>
      <PageTitle
        eyebrow="Your details"
        title="Contact details"
        sub="These appear across the website — in the header, the footer, the contact page and every WhatsApp button."
      />

      <SettingsForm settings={settings} />
    </>
  );
}
