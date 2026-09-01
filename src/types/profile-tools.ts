export type UserDocumentStatus = 'missing' | 'uploaded' | 'under_review' | 'verified';

export interface UserDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  country: string;
  status: UserDocumentStatus;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_review' | 'resolved';
  createdAt: string;
}
