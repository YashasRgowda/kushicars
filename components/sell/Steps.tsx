'use client';

import {
  ACCIDENT_OPTIONS,
  BODIES,
  COMMON_BRANDS,
  FUELS,
  INSURANCE_OPTIONS,
  LOAN_OPTIONS,
  RC_OPTIONS,
  SERVICE_OPTIONS,
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

/** A named block inside a step. Steps get long; this keeps them scannable. */
function Group({
  title,
  children,
  note,
}: {
  title?: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="space-y-5">
      {title && (
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
            {title}
          </h3>
          {note && <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{note}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

const yearOptions = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) =>
  String(MAX_YEAR - i),
);

/* ==================================================================
   1 — The car
   ================================================================== */

export function StepCar({ v, set, errors }: StepProps) {
  return (
    <div className="space-y-11">
      <Group>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Brand"
            value={v.brand}
            onChange={(e) => set('brand', e.target.value)}
            error={errors.brand}
            placeholder="Choose a brand"
            options={[...COMMON_BRANDS]}
          />
          <TextField
            label="Model"
            value={v.model}
            onChange={(e) => set('model', e.target.value)}
            error={errors.model}
            placeholder="Swift, Creta, Nexon…"
            autoComplete="off"
          />
        </div>

        <TextField
          label="Variant"
          optional
          value={v.variant}
          onChange={(e) => set('variant', e.target.value)}
          placeholder="VXi, SX(O), XZ+…"
          hint="If you know it. It is usually on the boot lid or in the RC."
          autoComplete="off"
        />
      </Group>

      <Group title="Age" note="Manufacturing year is on the RC — it is often a year before registration.">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Manufacturing year"
            value={v.yearMfg}
            onChange={(e) => set('yearMfg', e.target.value)}
            error={errors.yearMfg}
            placeholder="Select"
            options={yearOptions}
          />
          <SelectField
            label="Registration year"
            optional
            value={v.yearReg}
            onChange={(e) => set('yearReg', e.target.value)}
            error={errors.yearReg}
            placeholder="Select"
            options={yearOptions}
          />
        </div>
      </Group>

      <Group title="Specification">
        <Choice
          legend="Fuel"
          options={FUELS}
          value={v.fuel}
          onChange={(x) => set('fuel', x)}
          error={errors.fuel}
          columns={3}
        />
        <Choice
          legend="Transmission"
          options={TRANSMISSIONS}
          value={v.transmission}
          onChange={(x) => set('transmission', x)}
          error={errors.transmission}
          columns={2}
        />
        <Choice
          legend="Body style"
          options={BODIES}
          value={v.body}
          onChange={(x) => set('body', x)}
          columns={3}
        />
      </Group>
    </div>
  );
}

/* ==================================================================
   2 — Condition
   ================================================================== */

export function StepCondition({ v, set, errors }: StepProps) {
  return (
    <div className="space-y-11">
      <Group title="Use">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Kilometres on the odometer"
            value={groupIndian(v.kmDriven)}
            onChange={(e) => set('kmDriven', digitsOnly(e.target.value))}
            error={errors.kmDriven}
            inputMode="numeric"
            suffix="km"
            placeholder="62,400"
            className="no-spin"
          />
          <SelectField
            label="Number of owners including you"
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

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="RTO code"
            optional
            value={v.rtoCode}
            onChange={(e) => set('rtoCode', e.target.value.toUpperCase())}
            error={errors.rtoCode}
            placeholder="KA-05"
            hint="The first part of the number plate."
            maxLength={6}
          />
          <TextField
            label="Registered in"
            optional
            value={v.regState}
            onChange={(e) => set('regState', e.target.value)}
            placeholder="Karnataka"
            hint="Out-of-state cars need an NOC. We arrange it."
          />
        </div>
      </Group>

      <Group
        title="History"
        note="Be straight with us here. We inspect every car anyway, and a surprise at inspection costs you more than a disclosure now."
      >
        <Choice
          legend="Has the car been in an accident?"
          options={ACCIDENT_OPTIONS}
          value={v.accidentHistory}
          onChange={(x) => set('accidentHistory', x)}
          error={errors.accidentHistory}
        />
        <Choice
          legend="Where has it been serviced?"
          options={SERVICE_OPTIONS}
          value={v.serviceHistory}
          onChange={(x) => set('serviceHistory', x)}
          error={errors.serviceHistory}
        />
        <TextArea
          label="Anything else we should know?"
          optional
          value={v.knownIssues}
          onChange={(e) => set('knownIssues', e.target.value)}
          error={errors.knownIssues}
          maxLength={1200}
          placeholder="AC not cooling well, clutch replaced last year, a dent on the rear door…"
          hint="Small faults rarely change a quote much. Undisclosed ones do."
        />
      </Group>
    </div>
  );
}

/* ==================================================================
   3 — Paperwork
   ================================================================== */

export function StepPapers({ v, set, errors }: StepProps) {
  const needsInsuranceDate =
    v.insuranceType === 'comprehensive' || v.insuranceType === 'third_party';

  return (
    <div className="space-y-11">
      <Group
        title="Insurance"
        note="Valid insurance means the car can be driven away on the day of sale."
      >
        <Choice
          legend="What cover does it have?"
          options={INSURANCE_OPTIONS}
          value={v.insuranceType}
          onChange={(x) => set('insuranceType', x)}
          error={errors.insuranceType}
          columns={2}
        />
        {needsInsuranceDate && (
          <TextField
            label="Policy valid until"
            type="month"
            value={v.insuranceValidTill}
            onChange={(e) => set('insuranceValidTill', e.target.value)}
            error={errors.insuranceValidTill}
            className="sm:max-w-xs"
          />
        )}
      </Group>

      <Group
        title="Registration certificate"
        note="This is the single most common reason a sale gets delayed, so we ask up front."
      >
        <Choice
          legend="Where is the RC right now?"
          options={RC_OPTIONS}
          value={v.rcStatus}
          onChange={(x) => set('rcStatus', x)}
          error={errors.rcStatus}
        />
      </Group>

      <Group
        title="Loan"
        note="A bank's name on the RC has to be removed before ownership can transfer. We do that for you either way — we just need to know."
      >
        <Choice
          legend="Is there a loan on the car?"
          options={LOAN_OPTIONS}
          value={v.loanStatus}
          onChange={(x) => set('loanStatus', x)}
          error={errors.loanStatus}
        />
      </Group>

      <Group title="Odds and ends">
        <div className="grid gap-8 sm:grid-cols-2">
          <SelectField
            label="How many keys do you have?"
            value={v.keysCount}
            onChange={(e) => set('keysCount', e.target.value)}
            error={errors.keysCount}
            options={[
              { value: '2', label: 'Both keys' },
              { value: '1', label: 'One key only' },
              { value: '0', label: 'No original key' },
            ]}
          />
          <BoolChoice
            legend="Any pending traffic challans?"
            value={v.pendingChallans}
            onChange={(x) => set('pendingChallans', x)}
            hint="These must be cleared before transfer. Not a problem — just slower if we find out late."
          />
        </div>

        {v.fuel === 'CNG' && (
          <BoolChoice
            legend="Is the CNG kit endorsed on the RC?"
            value={v.cngEndorsedOnRc}
            onChange={(x) => set('cngEndorsedOnRc', x)}
            hint="An unendorsed aftermarket kit affects both insurance and resale."
          />
        )}
      </Group>
    </div>
  );
}

/* ==================================================================
   4 — Price & you
   ================================================================== */

export function StepContact({ v, set, errors }: StepProps) {
  return (
    <div className="space-y-11">
      <Group
        title="Price"
        note="Give us a figure to work from. We will still inspect the car and put our own number to it — this just tells us whether we are in the same range."
      >
        <TextField
          label="What are you hoping to get?"
          optional
          value={groupIndian(v.expectedPrice)}
          onChange={(e) => set('expectedPrice', digitsOnly(e.target.value))}
          error={errors.expectedPrice}
          inputMode="numeric"
          prefix="₹"
          placeholder="9,50,000"
          hint={
            v.expectedPrice && Number(v.expectedPrice) >= 10000
              ? formatPrice(Number(v.expectedPrice))
              : undefined
          }
          className="sm:max-w-sm"
        />
        <TextField
          label="Why are you selling?"
          optional
          value={v.reasonForSelling}
          onChange={(e) => set('reasonForSelling', e.target.value)}
          placeholder="Upgrading, moving city, second car not being used…"
          maxLength={300}
        />
      </Group>

      <Group title="Photos">
        <PhotoUpload paths={v.photos} onChange={(p) => set('photos', p)} />
      </Group>

      <Group title="How we reach you">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Your name"
            value={v.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
            autoComplete="name"
            placeholder="As it appears on the RC"
          />
          <TextField
            label="Mobile number"
            value={v.phone}
            onChange={(e) => set('phone', digitsOnly(e.target.value))}
            error={errors.phone}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            prefix="+91"
            maxLength={10}
            placeholder="98765 43210"
          />
        </div>

        <BoolChoice
          legend="Is that the same number on WhatsApp?"
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

        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            label="Email"
            optional
            value={v.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            type="email"
            autoComplete="email"
            className="sm:col-span-1"
          />
          <TextField
            label="Locality"
            optional
            value={v.locality}
            onChange={(e) => set('locality', e.target.value)}
            placeholder="Vijayanagar"
          />
          <TextField
            label="Pincode"
            optional
            value={v.pincode}
            onChange={(e) => set('pincode', digitsOnly(e.target.value))}
            error={errors.pincode}
            inputMode="numeric"
            maxLength={6}
            placeholder="560040"
          />
        </div>
      </Group>

      <Group title="Inspection" note="Free, takes about 40 minutes, and there is no obligation at the end of it.">
        <Choice
          legend="When would suit you?"
          options={SLOT_OPTIONS.map((s) => ({ value: s, label: s }))}
          value={v.preferredSlot}
          onChange={(x) => set('preferredSlot', x)}
          error={errors.preferredSlot}
          columns={3}
        />
      </Group>

      <Checkbox
        checked={v.consent}
        onChange={(x) => set('consent', x)}
        error={errors.consent}
      >
        I am happy for Kushi Cars to contact me on this number about selling
        my car. We will not pass your details to anyone else.
      </Checkbox>
    </div>
  );
}
