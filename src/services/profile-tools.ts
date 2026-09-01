import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PaymentMethod, SupportTicket, UserDocument } from '../types/profile-tools';

const DOCUMENTS_KEY = 'profile_documents';
const PAYMENT_METHODS_KEY = 'payment_methods';
const SUPPORT_TICKETS_KEY = 'support_tickets';

const defaultDocuments: UserDocument[] = [
  {
    id: 'doc_passport',
    documentType: 'Passport',
    documentNumber: '',
    country: 'India',
    status: 'missing',
    updatedAt: '2024-04-15T09:00:00.000Z',
  },
  {
    id: 'doc_license',
    documentType: 'Driving Licence',
    documentNumber: 'DL-9876',
    country: 'Germany',
    status: 'under_review',
    updatedAt: '2024-04-18T13:00:00.000Z',
  },
];

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '28',
    holderName: 'Rajesh Singh',
    isDefault: true,
  },
];

const defaultSupportTickets: SupportTicket[] = [
  {
    id: 'ticket_1',
    subject: 'Account verification',
    message: 'Please review the pending driving licence verification.',
    status: 'in_review',
    createdAt: '2024-04-18T10:00:00.000Z',
  },
];

async function readArray<T>(key: string, fallback: T[]): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error);
    return fallback;
  }
}

async function writeArray<T>(key: string, value: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getDocuments(): Promise<UserDocument[]> {
  return readArray(DOCUMENTS_KEY, defaultDocuments);
}

export async function submitDocument(input: Omit<UserDocument, 'id' | 'status' | 'updatedAt'>): Promise<UserDocument> {
  const documents = await getDocuments();
  const nextDocument: UserDocument = {
    ...input,
    id: `doc_${Date.now()}`,
    status: 'under_review',
    updatedAt: new Date().toISOString(),
  };

  const nextDocuments = [nextDocument, ...documents.filter((item) => item.documentType !== input.documentType)];
  await writeArray(DOCUMENTS_KEY, nextDocuments);
  return nextDocument;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return readArray(PAYMENT_METHODS_KEY, defaultPaymentMethods);
}

export async function getDefaultPaymentMethod(): Promise<PaymentMethod | null> {
  const methods = await getPaymentMethods();
  return methods.find((item) => item.isDefault) ?? null;
}

export async function addPaymentMethod(input: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> {
  const methods = await getPaymentMethods();
  const method: PaymentMethod = {
    ...input,
    id: `pm_${Date.now()}`,
    isDefault: methods.length === 0,
  };

  await writeArray(PAYMENT_METHODS_KEY, [...methods, method]);
  return method;
}

export async function removePaymentMethod(paymentMethodId: string) {
  const methods = await getPaymentMethods();
  const remainingMethods = methods.filter((item) => item.id !== paymentMethodId);
  if (remainingMethods.length > 0 && !remainingMethods.some((item) => item.isDefault)) {
    remainingMethods[0] = { ...remainingMethods[0], isDefault: true };
  }
  await writeArray(PAYMENT_METHODS_KEY, remainingMethods);
}

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  const methods = await getPaymentMethods();
  const nextMethods = methods.map((item) => ({
    ...item,
    isDefault: item.id === paymentMethodId,
  }));
  await writeArray(PAYMENT_METHODS_KEY, nextMethods);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  return readArray(SUPPORT_TICKETS_KEY, defaultSupportTickets);
}

export async function submitSupportTicket(input: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): Promise<SupportTicket> {
  const tickets = await getSupportTickets();
  const ticket: SupportTicket = {
    ...input,
    id: `ticket_${Date.now()}`,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  await writeArray(SUPPORT_TICKETS_KEY, [ticket, ...tickets]);
  return ticket;
}
