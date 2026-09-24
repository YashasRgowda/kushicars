-- Kushi Cars — put the real business details into the settings row.
-- Run this ONCE, after schema.sql. Safe to re-run.
--
-- Everything here is editable later from /admin/settings — this file only
-- seeds it so a fresh database boots with the right name on the door.
--
-- Source: the Kushi Cars Google Business Profile (4.8 * / 44 reviews).
-- TODO(owner): confirm the weekly opening hours and the second phone line.

update public.settings set
  business_name = 'Kushi Cars',
  phone         = '+91 96863 35559',
  whatsapp      = '+91 96863 35559',
  email         = null,
  address       = '19/1, Near BDA Complex, Marilingappa Extension, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072',
  hours         = 'Mon–Sat 9:30 am – 8:00 pm · Sunday by appointment',
  map_url       = 'https://maps.google.com/?q=Kushi+Cars+Nagarbhavi+Bengaluru'
where id = 1;

-- If schema.sql was never run, the row will not exist yet.
insert into public.settings (id, business_name, phone, whatsapp, address, hours, map_url)
select
  1,
  'Kushi Cars',
  '+91 96863 35559',
  '+91 96863 35559',
  '19/1, Near BDA Complex, Marilingappa Extension, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072',
  'Mon–Sat 9:30 am – 8:00 pm · Sunday by appointment',
  'https://maps.google.com/?q=Kushi+Cars+Nagarbhavi+Bengaluru'
where not exists (select 1 from public.settings where id = 1);
