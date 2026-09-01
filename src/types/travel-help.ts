export type HelpOfferStatus = 'submitted' | 'reviewing' | 'matched' | 'completed';
export type TravelRequestStatus = 'approved' | 'pending_review' | 'needs_information' | 'rejected';
export type TravelSupportServiceCode = 'airport_support' | 'luggage_support' | 'full_trip_support';

export interface TravelHelpPlan {
  id: string;
  userName: string;
  userImage: string;
  contactPhone: string;
  fromCity: string;
  toCity: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalAirport: string;
  assistanceType: string;
  assistanceTitle: string;
  description: string;
  supportServiceCodes: TravelSupportServiceCode[];
  supportNeeded: string[];
  languages: string[];
  passengerCount: number;
  luggageCount: number;
  travelerPriceEUR: number;
  platformCommissionEUR: number;
  helperPayoutEUR: number;
  rating: number;
  verified: boolean;
  status: TravelRequestStatus;
  createdByUserId?: string;
  createdAt?: string;
}

export interface HelpOffer {
  id: string;
  planId: string;
  helperName: string;
  helperPhone: string;
  helperCity: string;
  meetingPoint: string;
  supportNote: string;
  canDrive: boolean;
  canTranslate: boolean;
  status: HelpOfferStatus;
  submittedAt: string;
}

export interface HelpOfferInput {
  planId: string;
  helperName: string;
  helperPhone: string;
  helperCity: string;
  meetingPoint: string;
  supportNote: string;
  canDrive: boolean;
  canTranslate: boolean;
}

export interface TravelHelpPlanInput {
  userName: string;
  userImage?: string;
  contactPhone: string;
  fromCity: string;
  toCity: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalAirport: string;
  assistanceTitle: string;
  description: string;
  supportServiceCodes: TravelSupportServiceCode[];
  supportNeeded: string[];
  languages: string[];
  passengerCount: number;
  luggageCount: number;
  createdByUserId?: string;
}
