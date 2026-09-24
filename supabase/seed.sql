-- Kushi Cars — demo stock
--
-- Run AFTER schema.sql. Eight cars, each with a photo set in public/cars.
-- SKIP this file once the owner is listing his real stock; these are
-- placeholders with Wikimedia Commons photographs (see ATTRIBUTION.md).

insert into public.cars
  (slug, brand, model, variant, year, price, body, fuel,
   km_driven, owners, transmission, mileage, registration, tag, photos, sort_order)
values
  ('mahindra-thar-lx-4x4','Mahindra','Thar','LX 4x4 Hard Top',2022,1375000,'SUV','Diesel',28400,1,'Manual',15.2,'KA-01','Featured',
   ARRAY['/cars/thar-1.jpg','/cars/thar-2.jpg']::text[],0),

  ('toyota-fortuner-4x4-at','Toyota','Fortuner','2.8 4x4 AT',2021,3850000,'SUV','Diesel',52000,1,'Automatic',10.0,'KA-05','Featured',
   ARRAY['/cars/fortuner-1.jpg','/cars/fortuner-2.jpg','/cars/fortuner-3.jpg']::text[],1),

  ('hyundai-creta-sxo','Hyundai','Creta','SX(O) Diesel AT',2022,1625000,'SUV','Diesel',29700,1,'Automatic',18.5,'KA-03','Featured',
   ARRAY['/cars/creta-1.jpg','/cars/creta-2.jpg','/cars/creta-3.jpg']::text[],2),

  ('mahindra-xuv700-ax7','Mahindra','XUV700','AX7 2.2 Diesel AT',2022,1950000,'SUV','Diesel',31000,1,'Automatic',15.2,'KA-51','Featured',
   ARRAY['/cars/xuv700-1.jpg','/cars/xuv700-2.jpg','/cars/xuv700-3.jpg']::text[],3),

  ('volkswagen-virtus-gt','Volkswagen','Virtus','GT Line 1.0 TSI DSG',2023,1560000,'Sedan','Petrol',18300,1,'DSG Automatic',18.7,'KA-51','Fresh Arrival',
   ARRAY['/cars/virtus-1.jpg','/cars/virtus-2.jpg','/cars/virtus-3.jpg']::text[],4),

  ('honda-city-vx-cvt','Honda','City','VX CVT',2021,1240000,'Sedan','Petrol',38900,1,'CVT Automatic',18.4,'KA-03',null,
   ARRAY['/cars/city-1.jpg','/cars/city-2.jpg','/cars/city-3.jpg']::text[],5),

  ('maruti-baleno-alpha','Maruti Suzuki','Baleno','Alpha',2022,795000,'Hatchback','Petrol',26800,1,'Manual',22.3,'KA-02','Certified',
   ARRAY['/cars/baleno-1.jpg','/cars/baleno-2.jpg','/cars/baleno-3.jpg']::text[],6),

  ('maruti-swift-zxi-plus','Maruti Suzuki','Swift','ZXi+',2022,725000,'Hatchback','Petrol',31200,1,'Manual',22.4,'KA-03','Certified',
   ARRAY['/cars/swift-1.jpg','/cars/swift-2.jpg','/cars/swift-3.jpg']::text[],7)
on conflict (slug) do update
  set photos = excluded.photos,
      tag    = excluded.tag,
      sort_order = excluded.sort_order;
