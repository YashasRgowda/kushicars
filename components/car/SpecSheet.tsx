import {
  CalendarDays,
  Cog,
  Fuel,
  Gauge,
  MapPin,
  Route,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import type { Car } from '@/lib/types';
import { formatNumber, formatOwners } from '@/lib/format';

/**
 * The full spec table.
 *
 * Laid out as a grid of labelled facts rather than a two-column table — at
 * this width a table produces a long ragged column of dots, and nobody reads
 * across it. Empty fields are dropped instead of printed as a dash.
 */
export default function SpecSheet({ car }: { car: Car }) {
  const rows: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: CalendarDays, label: 'Model year', value: String(car.year) },
    { icon: Gauge, label: 'Kilometres driven', value: `${formatNumber(car.kmDriven)} km` },
    { icon: UserRound, label: 'Ownership', value: formatOwners(car.owners) },
    { icon: Fuel, label: 'Fuel', value: car.fuel },
    { icon: Cog, label: 'Transmission', value: car.transmission },
    { icon: ShieldCheck, label: 'Body style', value: car.body },
  ];

  if (car.mileage) {
    rows.push({
      icon: Route,
      label: 'Mileage (claimed)',
      value: `${car.mileage} kmpl`,
    });
  }
  if (car.registration) {
    rows.push({ icon: MapPin, label: 'Registration', value: car.registration });
  }

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3.5">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" strokeWidth={1.5} />
          <div className="min-w-0">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {label}
            </dt>
            <dd className="mt-1.5 truncate text-[15px] text-white">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
