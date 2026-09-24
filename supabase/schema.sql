-- Kushi Cars — database schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run

-- ---------------------------------------------------------------
-- 1. CARS
-- ---------------------------------------------------------------
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  brand         text not null,
  model         text not null,
  variant       text not null default '',
  year          int  not null check (year between 1990 and 2100),
  price         bigint not null check (price >= 0),          -- rupees
  body          text not null check (body in ('Hatchback','Sedan','SUV','MUV')),
  fuel          text not null check (fuel in ('Petrol','Diesel','CNG','Electric')),
  km_driven     int  not null check (km_driven >= 0),
  owners        int  not null default 1 check (owners between 1 and 10),
  transmission  text not null,
  mileage       numeric(4,1),
  registration  text,
  tag           text check (tag in ('Fresh Arrival','Certified','Featured')),
  sold          boolean not null default false,
  photos        text[] not null default '{}',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cars_sold_idx  on public.cars (sold);
create index if not exists cars_brand_idx on public.cars (brand);

-- ---------------------------------------------------------------
-- 2. SETTINGS  (single row — phone, address, hours)
-- ---------------------------------------------------------------
create table if not exists public.settings (
  id             int primary key default 1,
  business_name  text not null default 'Kushi Cars',
  phone          text,
  whatsapp       text,
  email          text,
  address        text,
  hours          text,
  map_url        text,
  updated_at     timestamptz not null default now(),
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id, business_name, phone, whatsapp, address, hours)
values (
  1,
  'Kushi Cars',
  '+91 96863 35559',
  '+91 96863 35559',
  '19/1, Near BDA Complex, Marilingappa Extension, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072',
  'Mon–Sat 9:30 am – 8:00 pm · Sunday by appointment'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- 3. Keep updated_at fresh
-- ---------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists cars_touch on public.cars;
create trigger cars_touch before update on public.cars
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
--    Public may READ. Only a logged-in user may WRITE.
-- ---------------------------------------------------------------
alter table public.cars     enable row level security;
alter table public.settings enable row level security;

drop policy if exists "cars public read"       on public.cars;
drop policy if exists "cars auth insert"       on public.cars;
drop policy if exists "cars auth update"       on public.cars;
drop policy if exists "cars auth delete"       on public.cars;
drop policy if exists "settings public read"   on public.settings;
drop policy if exists "settings auth update"   on public.settings;

create policy "cars public read"     on public.cars     for select using (true);
create policy "cars auth insert"     on public.cars     for insert to authenticated with check (true);
create policy "cars auth update"     on public.cars     for update to authenticated using (true) with check (true);
create policy "cars auth delete"     on public.cars     for delete to authenticated using (true);

create policy "settings public read" on public.settings for select using (true);
create policy "settings auth update" on public.settings for update to authenticated using (true) with check (true);

-- ---------------------------------------------------------------
-- 5. PHOTO STORAGE
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('car-photos', 'car-photos', true)
on conflict (id) do nothing;

drop policy if exists "car photos public read"   on storage.objects;
drop policy if exists "car photos auth upload"   on storage.objects;
drop policy if exists "car photos auth delete"   on storage.objects;

create policy "car photos public read" on storage.objects
  for select using (bucket_id = 'car-photos');

create policy "car photos auth upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'car-photos');

create policy "car photos auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'car-photos');
