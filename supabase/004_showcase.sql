-- Kushi Cars — choose which car holds the home page feature
--
-- Run this ONCE in Supabase: Dashboard -> SQL Editor -> New query -> paste ->
-- Run. Safe to re-run.
--
-- Until now the home page picked the car in that big scrolling panel by
-- itself: the dearest car tagged "Featured". This gives the owner the choice
-- instead, from /admin, on the car itself.

alter table public.cars
  add column if not exists showcase boolean not null default false;

-- Hand it to whichever car the home page was already choosing on its own, so
-- that running this changes nothing until somebody decides otherwise.
update public.cars set showcase = true
where id = (
  select id from public.cars
  where sold = false
    and coalesce(array_length(photos, 1), 0) > 0
  order by coalesce(tag = 'Featured', false) desc, price desc
  limit 1
)
and not exists (select 1 from public.cars where showcase);

-- One car, one feature. The panel already enforces this; the index is what
-- keeps it true even if a row is edited by hand in the Supabase dashboard.
create unique index if not exists cars_one_showcase
  on public.cars (showcase) where showcase;
