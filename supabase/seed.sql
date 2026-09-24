-- Kushi Cars — seed the 16 existing cars
-- Run AFTER schema.sql

insert into public.cars
  (slug, brand, model, variant, year, price, body, fuel,
   km_driven, owners, transmission, mileage, registration, tag, photos, sort_order)
values
  ('mahindra-thar-lx-4x4','Mahindra','Thar','LX 4x4 Hard Top',2022,1375000,'SUV','Diesel',28400,1,'Manual',15.2,'KA-01','Featured',ARRAY['/cars/thar.jpg']::text[],0),
  ('toyota-fortuner-4x4-at','Toyota','Fortuner','2.8 4x4 AT',2021,3850000,'SUV','Diesel',52000,1,'Automatic',10.0,'KA-05','Featured',ARRAY['/cars/fortuner.jpg']::text[],1),
  ('maruti-swift-zxi-plus','Maruti Suzuki','Swift','ZXi+',2022,725000,'Hatchback','Petrol',31200,1,'Manual',22.4,'KA-03','Certified',ARRAY['/cars/swift.jpg']::text[],2),
  ('maruti-dzire-vxi','Maruti Suzuki','Dzire','VXi',2021,685000,'Sedan','Petrol',44600,2,'Manual',23.2,'KA-04',null,ARRAY['/cars/dzire.jpg']::text[],3),
  ('maruti-baleno-alpha','Maruti Suzuki','Baleno','Alpha',2022,795000,'Hatchback','Petrol',26800,1,'Manual',22.3,'KA-02','Certified',ARRAY['/cars/baleno.jpg']::text[],4),
  ('volkswagen-virtus-gt','Volkswagen','Virtus','GT Line 1.0 TSI DSG',2023,1560000,'Sedan','Petrol',18300,1,'DSG Automatic',18.7,'KA-51','Fresh Arrival',ARRAY['/cars/virtus.jpg']::text[],5),
  ('volkswagen-polo-gt-tsi','Volkswagen','Polo','GT TSI',2020,840000,'Hatchback','Petrol',48900,2,'DSG Automatic',18.0,'KA-01',null,ARRAY['/cars/polo.jpg']::text[],6),
  ('mahindra-xuv700-ax7','Mahindra','XUV700','AX7 2.2 Diesel AT',2022,1950000,'SUV','Diesel',31000,1,'Automatic',15.2,'KA-51','Featured',ARRAY['/cars/xuv700.jpg']::text[],7),
  ('hyundai-creta-sxo','Hyundai','Creta','SX(O) Diesel AT',2022,1625000,'SUV','Diesel',29700,1,'Automatic',18.5,'KA-03','Featured',ARRAY['/cars/creta.jpg']::text[],8),
  ('hyundai-venue-sx-turbo','Hyundai','Venue','SX Turbo DCT',2022,1045000,'SUV','Petrol',27100,1,'DCT Automatic',18.1,'KA-05','Certified',ARRAY['/cars/venue.jpg']::text[],9),
  ('maruti-ertiga-zxi','Maruti Suzuki','Ertiga','ZXi 7-Seater',2022,940000,'MUV','Petrol',34200,1,'Manual',20.5,'KA-04','Fresh Arrival',ARRAY['/cars/ertiga.jpg']::text[],10),
  ('hyundai-i20-asta-o','Hyundai','i20','Asta (O)',2022,860000,'Hatchback','Petrol',24300,1,'Manual',20.3,'KA-04',null,ARRAY['/cars/i20.jpg']::text[],11),
  ('tata-nexon-xz-plus','Tata','Nexon','XZ+',2022,1095000,'SUV','Petrol',32800,1,'Manual',17.4,'KA-41','Certified',ARRAY['/cars/nexon.jpg']::text[],12),
  ('kia-seltos-htx','Kia','Seltos','HTX 1.5 Petrol',2021,1420000,'SUV','Petrol',41500,2,'Manual',16.8,'KA-01',null,ARRAY['/cars/seltos.jpg']::text[],13),
  ('toyota-innova-crysta-vx','Toyota','Innova Crysta','VX 2.4 7-Seater',2020,2150000,'MUV','Diesel',68200,1,'Manual',15.0,'KA-05',null,ARRAY['/cars/innova.jpg']::text[],14),
  ('honda-city-vx-cvt','Honda','City','VX CVT',2021,1240000,'Sedan','Petrol',38900,1,'CVT Automatic',18.4,'KA-03',null,ARRAY['/cars/city.jpg']::text[],15)
on conflict (slug) do nothing;
