export interface RideCarDetails {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
}

export interface Ride {
  id: string;
  driverName: string;
  rating: number;
  reviews: number;
  pricePerSeat: number;
  fromLocation: string;
  toLocation: string;
  fromLatitude?: number;
  fromLongitude?: number;
  toLatitude?: number;
  toLongitude?: number;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  description: string;
  carDetails: RideCarDetails;
  driverImage?: string;
  verified: boolean;
  smoker: boolean;
  music: boolean;
  luggage: boolean;
  createdByUserId?: string;
  createdAt?: string;
}

export interface RideInput {
  driverName: string;
  rating?: number;
  reviews?: number;
  pricePerSeat: number;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  totalSeats: number;
  description: string;
  carDetails: RideCarDetails;
  driverImage?: string;
  verified?: boolean;
  smoker: boolean;
  music: boolean;
  luggage: boolean;
  createdByUserId?: string;
}
