import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HelpOffer, HelpOfferInput } from '../types/travel-help';

const HELP_OFFERS_STORAGE_KEY = 'travel_help_offers';

async function readOffers(): Promise<HelpOffer[]> {
  const raw = await AsyncStorage.getItem(HELP_OFFERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as HelpOffer[];
  } catch (error) {
    console.error('Failed to parse help offers:', error);
    return [];
  }
}

async function writeOffers(offers: HelpOffer[]) {
  await AsyncStorage.setItem(HELP_OFFERS_STORAGE_KEY, JSON.stringify(offers));
}

export async function getHelpOffers(): Promise<HelpOffer[]> {
  return readOffers();
}

export async function getHelpOffersForPlan(planId: string): Promise<HelpOffer[]> {
  const offers = await readOffers();
  return offers.filter((offer) => offer.planId === planId);
}

export async function getHelpOfferById(offerId: string): Promise<HelpOffer | null> {
  const offers = await readOffers();
  return offers.find((offer) => offer.id === offerId) ?? null;
}

export async function submitHelpOffer(input: HelpOfferInput): Promise<HelpOffer> {
  const offers = await readOffers();
  const newOffer: HelpOffer = {
    ...input,
    id: `offer_${Date.now()}`,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  offers.unshift(newOffer);
  await writeOffers(offers);

  return newOffer;
}
