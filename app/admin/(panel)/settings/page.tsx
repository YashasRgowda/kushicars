import { requireUser } from '@/lib/auth';
import { getSettings } from '@/lib/cars';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireUser();
  const settings = await getSettings();

  return (
    <>
      <h1 className="font-display text-3xl font-600 text-white">
        Contact details
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        These appear in the header and footer of your website.
      </p>

      <SettingsForm settings={settings} />
    </>
  );
}
