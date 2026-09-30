import { requireUser } from '@/lib/auth';
import { getSettings } from '@/lib/cars';
import { getBuyerLeads, getSellLeads } from '@/lib/leads';
import { deleteBuyerLead, deleteSellLead } from '@/app/admin/enquiries/actions';
import { PageTitle } from '@/components/admin/ui';
import LeadList from '@/components/admin/LeadList';

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage() {
  await requireUser();

  const [sellers, buyers, settings] = await Promise.all([
    getSellLeads(),
    getBuyerLeads(),
    getSettings(),
  ]);

  return (
    <>
      <PageTitle
        eyebrow="From the website"
        title="Enquiries"
        sub="Everyone who has written in. Tap a name to see everything they told us, then message them in one go."
      />

      <LeadList
        sellers={sellers}
        buyers={buyers}
        settings={settings}
        onDeleteSeller={deleteSellLead}
        onDeleteBuyer={deleteBuyerLead}
      />
    </>
  );
}
