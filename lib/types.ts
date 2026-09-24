export type Fuel = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV';
export type Tag = 'Fresh Arrival' | 'Certified' | 'Featured';

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  /** Indian buyers shortlist by variant as much as by model */
  variant: string;
  year: number;
  price: number; // INR
  body: BodyType;
  fuel: Fuel;
  kmDriven: number;
  owners: number;
  transmission: string;
  mileage: number | null; // kmpl, claimed
  registration: string | null; // RTO code
  tag?: Tag;
  sold: boolean;
  photos: string[];
  /** First photo, or undefined — CarCard falls back to a typographic plate. */
  image?: string;
}

export interface Brand {
  name: string;
}

export interface Settings {
  businessName: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
  mapUrl: string | null;
}

/* ------------------------------------------------------------------
   Leads — see supabase/002_leads.sql
   ------------------------------------------------------------------ */

export type EnquiryKind = 'test_drive' | 'general' | 'callback';

export interface EnquiryInput {
  kind: EnquiryKind;
  carId?: string | null;
  carLabel?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  preferredSlot?: string | null;
}

/* ------------------------------------------------------------------
   Inventory filtering — shared by the /cars rail and the mobile sheet
   ------------------------------------------------------------------ */

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'km-asc' | 'year-desc';

export interface CarFilters {
  brand: string; // 'All' or a brand name
  body: BodyType | 'All';
  fuel: Fuel | 'All';
  transmission: string; // 'All' | 'Manual' | 'Automatic'
  /** Rupees. null means "no bound set". */
  minPrice: number | null;
  maxPrice: number | null;
  /** Show cars from this year onward. */
  minYear: number | null;
  /** Show cars under this many kilometres. */
  maxKm: number | null;
  /** 1 = first owner only, 2 = up to second, null = any. */
  maxOwners: number | null;
  sort: SortKey;
}
