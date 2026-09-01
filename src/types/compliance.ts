export type LegalDocumentSlug =
  | 'privacy-notice'
  | 'terms-of-service'
  | 'community-rules'
  | 'provider-details';

export interface ConsentRecord {
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
  communityRulesAcceptedAt: string;
  ageConfirmedAt: string;
  marketingEmails: boolean;
  lastUpdatedAt: string;
  dataExportRequestedAt?: string;
  accountDeletionRequestedAt?: string;
}

export interface LegalDocumentSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  slug: LegalDocumentSlug;
  title: string;
  summary: string;
  sections: LegalDocumentSection[];
}

export interface ComplianceHighlight {
  title: string;
  description: string;
}
