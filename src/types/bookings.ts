export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingPaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  rideId: string;
  driverName: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  departureDate: string;
  totalPassengers: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
}

export interface TrackingStep {
  id: string;
  label: string;
  state: 'done' | 'current' | 'upcoming';
}
