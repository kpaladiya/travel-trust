import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoTravelPlans } from '../data/demo-rides';
import { computeTravelCompanionPricing, getSupportLabels, inferSupportCodesFromLabels } from './travel-pricing';
import type { TravelHelpPlan, TravelHelpPlanInput } from '../types/travel-help';

const TRAVEL_PLANS_STORAGE_KEY = 'travel_help_plans';

async function readPlans(): Promise<TravelHelpPlan[]> {
  const raw = await AsyncStorage.getItem(TRAVEL_PLANS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as TravelHelpPlan[];
  } catch (error) {
    console.error('Failed to parse travel plans:', error);
    return [];
  }
}

async function writePlans(plans: TravelHelpPlan[]) {
  await AsyncStorage.setItem(TRAVEL_PLANS_STORAGE_KEY, JSON.stringify(plans));
}

function normalizeTravelPlan(plan: TravelHelpPlan): TravelHelpPlan {
  const supportServiceCodes =
    plan.supportServiceCodes && plan.supportServiceCodes.length > 0
      ? plan.supportServiceCodes
      : inferSupportCodesFromLabels(plan.supportNeeded);
  const supportNeeded = supportServiceCodes.length > 0 ? getSupportLabels(supportServiceCodes) : plan.supportNeeded;
  const pricing = computeTravelCompanionPricing(supportServiceCodes);

  return {
    ...plan,
    supportServiceCodes,
    supportNeeded,
    travelerPriceEUR: plan.travelerPriceEUR ?? pricing.travelerPriceEUR,
    platformCommissionEUR: plan.platformCommissionEUR ?? pricing.platformCommissionEUR,
    helperPayoutEUR: plan.helperPayoutEUR ?? pricing.helperPayoutEUR,
  };
}

export async function getTravelPlans(): Promise<TravelHelpPlan[]> {
  const storedPlans = await readPlans();
  return [...storedPlans, ...demoTravelPlans].map(normalizeTravelPlan);
}

export async function getTravelPlanById(planId: string): Promise<TravelHelpPlan | null> {
  const storedPlans = await readPlans();
  const plan = storedPlans.find((item) => item.id === planId) ?? demoTravelPlans.find((item) => item.id === planId) ?? null;
  return plan ? normalizeTravelPlan(plan) : null;
}

export async function submitTravelPlan(input: TravelHelpPlanInput): Promise<TravelHelpPlan> {
  const storedPlans = await readPlans();
  const initials = input.userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? 'U')
    .join('');
  const pricing = computeTravelCompanionPricing(input.supportServiceCodes);

  const newPlan: TravelHelpPlan = {
    ...input,
    id: `plan_${Date.now()}`,
    userImage: input.userImage ?? `https://via.placeholder.com/48/007AFF/ffffff?text=${initials || 'U'}`,
    assistanceType: 'community_support',
    supportNeeded: getSupportLabels(input.supportServiceCodes),
    travelerPriceEUR: pricing.travelerPriceEUR,
    platformCommissionEUR: pricing.platformCommissionEUR,
    helperPayoutEUR: pricing.helperPayoutEUR,
    rating: 0,
    verified: false,
    status: 'pending_review',
    createdAt: new Date().toISOString(),
  };

  storedPlans.unshift(newPlan);
  await writePlans(storedPlans);

  return newPlan;
}
