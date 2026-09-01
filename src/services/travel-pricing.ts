import type { TravelSupportServiceCode } from '../types/travel-help';

export const PLATFORM_COMMISSION_RATE = 0.2;

export const travelSupportCatalog: Array<{
  code: TravelSupportServiceCode;
  label: string;
  description: string;
  priceEUR: number;
}> = [
  {
    code: 'airport_support',
    label: 'Airport support',
    description: 'Meet at arrivals and guide the traveler through the airport.',
    priceEUR: 10,
  },
  {
    code: 'luggage_support',
    label: 'Luggage support',
    description: 'Help carry bags and manage luggage during transfer.',
    priceEUR: 10,
  },
  {
    code: 'full_trip_support',
    label: 'Full support from departure airport to arrival airport',
    description: 'End-to-end support for the full airport journey.',
    priceEUR: 30,
  },
];

const serviceLabelByCode = Object.fromEntries(travelSupportCatalog.map((item) => [item.code, item.label])) as Record<
  TravelSupportServiceCode,
  string
>;

const serviceCodeByLabel = Object.fromEntries(travelSupportCatalog.map((item) => [item.label, item.code])) as Record<
  string,
  TravelSupportServiceCode
>;

export function getSupportLabels(codes: TravelSupportServiceCode[]) {
  return codes.map((code) => serviceLabelByCode[code]);
}

export function inferSupportCodesFromLabels(labels: string[]): TravelSupportServiceCode[] {
  return labels
    .map((label) => serviceCodeByLabel[label])
    .filter((value): value is TravelSupportServiceCode => Boolean(value));
}

export function computeTravelCompanionPricing(codes: TravelSupportServiceCode[]) {
  const travelerPriceEUR = travelSupportCatalog
    .filter((item) => codes.includes(item.code))
    .reduce((sum, item) => sum + item.priceEUR, 0);
  const platformCommissionEUR = Number((travelerPriceEUR * PLATFORM_COMMISSION_RATE).toFixed(2));
  const helperPayoutEUR = Number((travelerPriceEUR - platformCommissionEUR).toFixed(2));

  return {
    travelerPriceEUR,
    platformCommissionEUR,
    helperPayoutEUR,
  };
}

export function formatEuro(value: number) {
  return `EUR ${value.toFixed(2)}`;
}
