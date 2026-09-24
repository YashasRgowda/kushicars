-- Kushi Cars — lead capture
-- Run this ONCE in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: every statement is idempotent.
--
-- Two public-facing forms write here:
--   /sell     -> sell_requests   (a customer wants to sell their car to us)
--   /contact  -> enquiries       (a buyer wants a test drive or a callback)
--
-- SECURITY NOTE -------------------------------------------------------------
-- The anon key ships in the browser, so anon can INSERT here. It deliberately
-- has NO select policy: a lead, once written, is invisible to the public. Only
-- an authenticated (admin) session can read one back.
-- ---------------------------------------------------------------------------

-- ===========================================================================
-- 1. SELL REQUESTS
-- ===========================================================================
create table if not exists public.sell_requests (
  id            uuid primary key default gen_random_uuid(),
  ref           text unique not null,                 -- KC-7F3K2, quoted to the seller

  -- the car ------------------------------------------------------------
  brand         text not null check (length(brand) between 1 and 40),
  model         text not null check (length(model) between 1 and 40),
  variant       text not null default '' check (length(variant) <= 60),
  year_mfg      int  not null check (year_mfg between 1990 and 2100),
  year_reg      int           check (year_reg between 1990 and 2100),
  fuel          text not null check (fuel in ('Petrol','Diesel','CNG','Electric','Hybrid','LPG')),
  transmission  text not null check (transmission in ('Manual','Automatic')),
  body          text          check (body in ('Hatchback','Sedan','SUV','MUV','Coupe','Other')),

  -- how it has been used -----------------------------------------------
  km_driven     int  not null check (km_driven between 0 and 1000000),
  owners        int  not null default 1 check (owners between 1 and 10),
  rto_code      text          check (length(rto_code) <= 12),   -- KA-05
  reg_state     text          check (length(reg_state) <= 40),

  -- condition ----------------------------------------------------------
  -- The single biggest driver of price after km and age.
  accident_history text not null default 'none'
                   check (accident_history in ('none','minor','major')),
  service_history  text not null default 'local'
                   check (service_history in ('authorised','local','none')),
  known_issues     text check (length(known_issues) <= 1200),

  -- paperwork ----------------------------------------------------------
  -- These four are what actually kill an Indian used-car deal at handover,
  -- so we ask up front rather than discovering them at the RTO.
  insurance_type      text not null default 'comprehensive'
                      check (insurance_type in ('comprehensive','third_party','expired','none')),
  insurance_valid_till date,
  rc_status           text not null default 'original'
                      check (rc_status in ('original','duplicate','with_financier')),
  loan_status         text not null default 'none'
                      check (loan_status in ('none','running','closed_hp_not_removed')),
  keys_count          int  not null default 2 check (keys_count between 0 and 4),
  pending_challans    boolean not null default false,
  cng_endorsed_on_rc  boolean,                        -- only meaningful when fuel = CNG

  -- commercial ---------------------------------------------------------
  expected_price     bigint check (expected_price between 0 and 100000000),
  reason_for_selling text check (length(reason_for_selling) <= 300),

  -- the seller ---------------------------------------------------------
  name           text not null check (length(name) between 2 and 80),
  phone          text not null check (phone ~ '^[6-9][0-9]{9}$'),
  whatsapp_same  boolean not null default true,
  whatsapp       text check (whatsapp ~ '^[6-9][0-9]{9}$'),
  email          text check (length(email) <= 120),
  locality       text check (length(locality) <= 80),
  pincode        text check (pincode ~ '^[1-9][0-9]{5}$'),

  -- logistics ----------------------------------------------------------
  preferred_slot text check (length(preferred_slot) <= 60),
  photos         text[] not null default '{}',        -- paths in the sell-photos bucket

  -- workflow (the admin panel will drive these; nothing writes them yet)
  status     text not null default 'new'
             check (status in ('new','contacted','inspected','quoted','bought','dropped')),
  notes      text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sell_requests_status_idx  on public.sell_requests (status);
create index if not exists sell_requests_created_idx on public.sell_requests (created_at desc);

-- ===========================================================================
-- 2. ENQUIRIES  (buyer side)
-- ===========================================================================
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  ref        text unique not null,
  kind       text not null default 'general'
             check (kind in ('test_drive','general','callback')),

  -- Denormalised on purpose: car_label survives the car being sold and
  -- deleted, so an old enquiry still reads sensibly.
  car_id     uuid references public.cars (id) on delete set null,
  car_label  text check (length(car_label) <= 120),

  name       text not null check (length(name) between 2 and 80),
  phone      text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email      text check (length(email) <= 120),
  message    text check (length(message) <= 1200),
  preferred_slot text check (length(preferred_slot) <= 60),

  status     text not null default 'new'
             check (status in ('new','contacted','closed')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx  on public.enquiries (status);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ===========================================================================
-- 3. Keep updated_at fresh (reuses the function from schema.sql)
-- ===========================================================================
drop trigger if exists sell_requests_touch on public.sell_requests;
create trigger sell_requests_touch before update on public.sell_requests
  for each row execute function public.touch_updated_at();

drop trigger if exists enquiries_touch on public.enquiries;
create trigger enquiries_touch before update on public.enquiries
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 4. ROW LEVEL SECURITY
--    Public may WRITE a lead. Only an admin may READ one back.
-- ===========================================================================
alter table public.sell_requests enable row level security;
alter table public.enquiries     enable row level security;

drop policy if exists "sell_requests public insert" on public.sell_requests;
drop policy if exists "sell_requests auth read"     on public.sell_requests;
drop policy if exists "sell_requests auth update"   on public.sell_requests;
drop policy if exists "sell_requests auth delete"   on public.sell_requests;

create policy "sell_requests public insert" on public.sell_requests
  for insert to anon, authenticated with check (true);
create policy "sell_requests auth read"     on public.sell_requests
  for select to authenticated using (true);
create policy "sell_requests auth update"   on public.sell_requests
  for update to authenticated using (true) with check (true);
create policy "sell_requests auth delete"   on public.sell_requests
  for delete to authenticated using (true);

drop policy if exists "enquiries public insert" on public.enquiries;
drop policy if exists "enquiries auth read"     on public.enquiries;
drop policy if exists "enquiries auth update"   on public.enquiries;
drop policy if exists "enquiries auth delete"   on public.enquiries;

create policy "enquiries public insert" on public.enquiries
  for insert to anon, authenticated with check (true);
create policy "enquiries auth read"     on public.enquiries
  for select to authenticated using (true);
create policy "enquiries auth update"   on public.enquiries
  for update to authenticated using (true) with check (true);
create policy "enquiries auth delete"   on public.enquiries
  for delete to authenticated using (true);

-- ===========================================================================
-- 5. SELLER PHOTO STORAGE
--    PRIVATE bucket. Anyone may drop a photo in; only an admin may look.
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sell-photos', 'sell-photos', false, 6291456,
  array['image/jpeg','image/png','image/webp','image/heic']
)
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sell photos public upload" on storage.objects;
drop policy if exists "sell photos auth read"     on storage.objects;
drop policy if exists "sell photos auth delete"   on storage.objects;

create policy "sell photos public upload" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'sell-photos');

create policy "sell photos auth read" on storage.objects
  for select to authenticated using (bucket_id = 'sell-photos');

create policy "sell photos auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'sell-photos');
