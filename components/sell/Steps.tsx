'use client';

import {
  COMMON_BRANDS,
  FUELS,
  INSURANCE_OPTIONS,
  LOAN_OPTIONS,
  RC_OPTIONS,
  SLOT_OPTIONS,
  TRANSMISSIONS,
  type SellErrors,
  type SellFormValues,
} from '@/lib/sell';
import { MAX_YEAR, MIN_YEAR, digitsOnly, groupIndian } from '@/lib/validation';
import { formatPrice } from '@/lib/format';
import {
  BoolChoice,
  Checkbox,
  Choice,
  SelectField,
  TextArea,
  TextField,
} from '@/components/form/fields';
import PhotoUpload from './PhotoUpload';

type Setter = <K extends keyof SellFormValues>(key: K, value: SellFormValues[K]) => void;

interface StepProps {
  v: SellFormValues;
  set: Setter;
  errors: SellErrors;
}

/** A named block inside a step. Used sparingly — most of these screens are
 *  short enough now that a heading over three fields is just more to read. */
function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      {title && (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-600">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

const yearOptions = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) =>
  String(MAX_YEAR - i),
);

/* ==================================================================
   1 — You

   Name and number first. A seller who has typed their own name is far
   likelier to finish than one asked for a model variant by a site that
   has not yet asked who they are.
   ================================================================== */

export function StepYou({ v, set, errors }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Your name"
          required
          value={v.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="Enter your name"
        />
        <TextField
          label="Mobile number"
          required
          value={v.phone}
          onChange={(e) => set('phone', digitsOnly(e.target.value))}
          error={errors.phone}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          prefix="+91"
          maxLength={10}
          placeholder="Enter your number"
        />
      </div>

      <BoolChoice
        legend="Is this number on WhatsApp?"
        value={v.whatsappSame}
        onChange={(x) => set('whatsappSame', x)}
      />
      {!v.whatsappSame && (
        <TextField
          label="WhatsApp number"
          value={v.whatsapp}
          onChange={(e) => set('whatsapp', digitsOnly(e.target.value))}
          error={errors.whatsapp}
          type="tel"
          inputMode="numeric"
          prefix="+91"
          maxLength={10}
          className="sm:max-w-sm"
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Area"
          value={v.locality}
          onChange={(e) => set('locality', e.target.value)}
          placeholder="Enter your area"
        />
        <TextField
          label="Pincode"
          value={v.pincode}
          onChange={(e) => set('pincode', digitsOnly(e.target.value))}
          error={errors.pincode}
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter pincode"
        />
      </div>
    </div>
  );
}

/* ==================================================================
   2 — Your car
   ================================================================== */

export function StepCar({ v, set, errors }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Brand"
          required
          value={v.brand}
          onChange={(e) => set('brand', e.target.value)}
          error={errors.brand}
          placeholder="Choose a brand"
          options={[...COMMON_BRANDS]}
        />
        <TextField
          label="Model"
          required
          value={v.model}
          onChange={(e) => set('model', e.target.value)}
          error={errors.model}
          placeholder="Enter the model"
          autoComplete="off"
        />
      </div>

      <TextField
        label="Variant"
        value={v.variant}
        onChange={(e) => set('variant', e.target.value)}
        placeholder="Enter the variant"
        hint="If you know it. It is on the boot lid."
        autoComplete="off"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Year made"
          required
          value={v.yearMfg}
          onChange={(e) => set('yearMfg', e.target.value)}
          error={errors.yearMfg}
          placeholder="Select the year"
          options={yearOptions}
        />
        <TextField
          label="Car number"
          required
          value={v.regNumber}
          onChange={(e) => set('regNumber', e.target.value.toUpperCase())}
          error={errors.regNumber}
          placeholder="Enter the car number"
          hint="The full number on the plate, like KA 05 MH 1234."
          maxLength={15}
          autoComplete="off"
        />
      </div>

      <Choice
        legend="Fuel"
        required
        options={FUELS}
        value={v.fuel}
        onChange={(x) => set('fuel', x)}
        error={errors.fuel}
        columns={3}
      />

      <Choice
        legend="Gearbox"
        required
        options={TRANSMISSIONS}
        value={v.transmission}
        onChange={(x) => set('transmission', x)}
        error={errors.transmission}
        columns={2}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Kilometres driven"
          required
          value={groupIndian(v.kmDriven)}
          onChange={(e) => set('kmDriven', digitsOnly(e.target.value))}
          error={errors.kmDriven}
          inputMode="numeric"
          suffix="km"
          placeholder="Enter kilometres"
          className="no-spin"
        />
        <SelectField
          label="Owners so far"
          required
          value={v.owners}
          onChange={(e) => set('owners', e.target.value)}
          error={errors.owners}
          options={[
            { value: '1', label: 'First owner' },
            { value: '2', label: 'Second owner' },
            { value: '3', label: 'Third owner' },
            { value: '4', label: 'Fourth owner or more' },
          ]}
        />
      </div>

      <TextArea
        label="Anything wrong with it?"
        value={v.knownIssues}
        onChange={(e) => set('knownIssues', e.target.value)}
        error={errors.knownIssues}
        maxLength={1200}
        placeholder="Tell us anything we should know"
        hint="Small faults rarely change a price. Hidden ones do."
      />
    </div>
  );
}

/* ==================================================================
   3 — Papers, price and when
   ================================================================== */

export function StepPrice({ v, set, errors }: StepProps) {
  const needsInsuranceDate =
    v.insuranceType === 'comprehensive' || v.insuranceType === 'third_party';

  return (
    <div className="space-y-10">
      <Group title="Papers">
        <Choice
          legend="Insurance"
          required
          options={INSURANCE_OPTIONS}
          value={v.insuranceType}
          onChange={(x) => set('insuranceType', x)}
          error={errors.insuranceType}
          columns={2}
        />
        {needsInsuranceDate && (
          <TextField
            label="Valid till"
            required
            type="month"
            value={v.insuranceValidTill}
            onChange={(e) => set('insuranceValidTill', e.target.value)}
            error={errors.insuranceValidTill}
            className="sm:max-w-xs"
          />
        )}

        <Choice
          legend="Where is the RC?"
          required
          options={RC_OPTIONS}
          value={v.rcStatus}
          onChange={(x) => set('rcStatus', x)}
          error={errors.rcStatus}
          columns={2}
        />

        <Choice
          legend="Loan on the car?"
          required
          options={LOAN_OPTIONS}
          value={v.loanStatus}
          onChange={(x) => set('loanStatus', x)}
          error={errors.loanStatus}
        />

        {v.fuel === 'CNG' && (
          <BoolChoice
            legend="Is the CNG kit on the RC?"
            value={v.cngEndorsedOnRc}
            onChange={(x) => set('cngEndorsedOnRc', x)}
          />
        )}
      </Group>

      <Group title="Price">
        <TextField
          label="The price you want"
          value={groupIndian(v.expectedPrice)}
          onChange={(e) => set('expectedPrice', digitsOnly(e.target.value))}
          error={errors.expectedPrice}
          inputMode="numeric"
          prefix="₹"
          placeholder="Enter your price"
          hint={
            v.expectedPrice && Number(v.expectedPrice) >= 10000
              ? formatPrice(Number(v.expectedPrice))
              : 'Leave it blank if you would rather we said first.'
          }
          className="no-spin sm:max-w-sm"
        />
      </Group>

      <Group title="Photos">
        <PhotoUpload paths={v.photos} onChange={(p) => set('photos', p)} />
      </Group>

      <Group title="Inspection">
        <Choice
          legend="When can we come and see it?"
          required
          options={SLOT_OPTIONS}
          value={v.slot}
          onChange={(x) => set('slot', x)}
          error={errors.slot}
          columns={3}
        />
        {v.slot === 'days' && (
          /* The option above already says "days" — so this does not, and
             neither does a suffix. It is the blank in that sentence, not a
             second question about the same thing. */
          <TextField
            label="How many?"
            required
            value={v.slotDays}
            onChange={(e) => set('slotDays', digitsOnly(e.target.value).slice(0, 3))}
            error={errors.slotDays}
            inputMode="numeric"
            aria-label="In how many days"
            placeholder="Enter days"
            className="no-spin sm:max-w-[9rem]"
          />
        )}
      </Group>

      <Checkbox
        checked={v.consent}
        onChange={(x) => set('consent', x)}
        error={errors.consent}
      >
        Kushi Cars may call me about selling my car. We will not pass your
        number to anyone else.
      </Checkbox>
    </div>
  );
}
