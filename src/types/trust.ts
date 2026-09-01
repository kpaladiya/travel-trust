export type TrustRole = 'rider' | 'traveler' | 'helper';
export type TrustTier = 'trusted' | 'review' | 'blocked';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_started';
export type IncidentSeverity = 'low' | 'medium' | 'high';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface TrustSummaryMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'positive' | 'neutral' | 'negative';
}

export interface VerificationBreakdown {
  label: string;
  verified: number;
  pending: number;
  rejected: number;
}

export interface TrustSchemaField {
  name: string;
  type: string;
  required: boolean;
  purpose: string;
}

export interface TrustSchemaGroup {
  role: TrustRole;
  title: string;
  description: string;
  fields: TrustSchemaField[];
}

export interface TrustProfile {
  id: string;
  name: string;
  role: TrustRole;
  homeCity: string;
  trustScore: number;
  riskScore: number;
  trustTier: TrustTier;
  accountAgeDays: number;
  completedTrips: number;
  cancellationRate: number;
  openReports: number;
  lastActive: string;
  verification: {
    email: VerificationStatus;
    phone: VerificationStatus;
    governmentId: VerificationStatus;
    selfieMatch: VerificationStatus;
    paymentMethod: VerificationStatus;
  };
  flags: string[];
}

export interface TrustIncident {
  id: string;
  profileId: string;
  name: string;
  role: TrustRole;
  category: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedAt: string;
  summary: string;
}

export interface TrustDashboardData {
  summaryMetrics: TrustSummaryMetric[];
  verificationBreakdown: VerificationBreakdown[];
  profileSchemas: TrustSchemaGroup[];
  flaggedProfiles: TrustProfile[];
  incidentQueue: TrustIncident[];
}
