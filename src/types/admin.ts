export type AdminTrend = 'up' | 'down' | 'stable';
export type ReviewPriority = 'low' | 'medium' | 'high';
export type ReviewStatus = 'pending' | 'approved' | 'blocked' | 'in_review';

export interface AdminKpi {
  id: string;
  label: string;
  value: string;
  context: string;
  trend: AdminTrend;
}

export interface DataRightsRequest {
  id: string;
  userName: string;
  requestType: 'export' | 'deletion' | 'correction';
  jurisdiction: string;
  requestedAt: string;
  status: ReviewStatus;
  priority: ReviewPriority;
}

export interface VerificationReview {
  id: string;
  userName: string;
  role: 'rider' | 'traveler' | 'helper';
  issue: string;
  status: ReviewStatus;
  priority: ReviewPriority;
  assignedTo: string;
}

export interface LegalVersionEntry {
  id: string;
  documentName: string;
  version: string;
  effectiveDate: string;
  owner: string;
  status: 'draft' | 'published' | 'archived';
}

export interface AdminAlert {
  id: string;
  title: string;
  description: string;
  severity: ReviewPriority;
}

export interface AdminConsoleData {
  kpis: AdminKpi[];
  rightsRequests: DataRightsRequest[];
  verificationQueue: VerificationReview[];
  legalVersions: LegalVersionEntry[];
  alerts: AdminAlert[];
}
