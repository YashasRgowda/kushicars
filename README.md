# Kushi Cars

Website for **Kushi Cars**, a pre-owned car showroom in Nagarbhavi, Bengaluru.

Next.js 16 (App Router) · TypeScript · Tailwind · Framer Motion · Supabase.

## Running it

```bash
npm install
npm run dev
```

Create `.env.local` first (never commit it):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

Both are in Supabase → Project Settings → API.

## Database

Run these once, in order, in the Supabase SQL Editor:

| File | What it does |
|---|---|
| `supabase/schema.sql` | `cars` and `settings` tables, storage bucket, row-level security |
| `supabase/002_leads.sql` | `sell_requests` and `enquiries`, plus the private seller-photo bucket |
| `supabase/003_kushi_settings.sql` | Real name, address, phone and hours |
| `supabase/004_showcase.sql` | The `showcase` flag — which car leads the home page |
| `supabase/seed.sql` | Optional demo stock — skip it if real cars are being added |

All are safe to re-run.

The public may only **write** a lead, never read one back: the anon key has
insert and nothing else on both lead tables. Reading requires a signed-in
admin session.

## Pages

| Route | |
|---|---|
| `/` | Home |
| `/cars` | Full stock, with filters held in the URL |
| `/cars/[slug]` | One car — gallery, specs, EMI, enquiry |
| `/sell` | Four-step sell-your-car form |
| `/about`, `/contact` | |
| `/admin` | Owner's panel — add, edit and remove cars, and edit contact details |

## Admin access

Supabase → Authentication → Users → **Add user** (tick *Auto Confirm*), then
sign in at `/admin/login`. Anyone who can sign in can edit stock, so give the
owner his own account rather than sharing one.

## Things worth knowing

- **Contact details, hours and the WhatsApp number** live in the database, not
  in the code. Change them at `/admin/settings`.
- **The car in the big panel on the home page** is chosen per car in the admin
  panel — "Lead the home page with this car". Only one car holds it at a time.
  With none chosen, the site falls back to the dearest Featured car that has a
  photograph, which is what it always used to do.
- **Deploying:** set `NEXT_PUBLIC_SITE_URL` to the live domain, or the sitemap
  and share links will point at `localhost`.
- **Photos:** at most six per car (`lib/photos.ts`), resized in the browser
  before upload.
- **Reviews** in `lib/testimonials.ts` are real Google reviews under real
  names. The note at the top of that file explains what may and may not be
  edited.
- **The demo car photographs in `public/cars/` are Wikimedia Commons
  placeholders** — see `public/cars/ATTRIBUTION.md`. The on-page credit line
  has been removed from the footer at the owner's request, so these MUST be
  replaced with Kushi Cars' own photographs before the site goes live: CC BY
  and CC BY-SA both require attribution wherever the photograph is published.
  Upload the real ones per car at `/admin`, then delete `public/cars/`.
- The footer carries a maker's credit that opens WhatsApp. The number and the
  opening message are the `MAKER` constant at the top of `components/Footer.tsx`.
