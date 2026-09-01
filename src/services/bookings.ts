import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoBookings } from '../data/demo-rides';
import type { Booking, TrackingStep } from '../types/bookings';

const BOOKINGS_STORAGE_KEY = 'bookings_state';

async function readBookings(): Promise<Booking[]> {
  const raw = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!raw) {
    return demoBookings as Booking[];
  }

  try {
    return JSON.parse(raw) as Booking[];
  } catch (error) {
    console.error('Failed to parse bookings:', error);
    return demoBookings as Booking[];
  }
}

async function writeBookings(bookings: Booking[]) {
  await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export async function getBookings(): Promise<Booking[]> {
  return readBookings();
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const bookings = await readBookings();
  return bookings.find((booking) => booking.id === bookingId) ?? null;
}

export async function payForBooking(bookingId: string): Promise<Booking> {
  const bookings = await readBookings();
  let updatedBooking: Booking | null = null;

  const nextBookings = bookings.map((booking) => {
    if (booking.id !== bookingId) {
      return booking;
    }

    updatedBooking = {
      ...booking,
      paymentStatus: 'paid',
      status: booking.status === 'pending' ? 'confirmed' : booking.status,
    };
    return updatedBooking;
  });

  if (!updatedBooking) {
    throw new Error('Booking not found');
  }

  await writeBookings(nextBookings);
  return updatedBooking;
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const bookings = await readBookings();
  let updatedBooking: Booking | null = null;

  const nextBookings = bookings.map((booking) => {
    if (booking.id !== bookingId) {
      return booking;
    }

    updatedBooking = {
      ...booking,
      status: 'cancelled',
      paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus,
    };
    return updatedBooking;
  });

  if (!updatedBooking) {
    throw new Error('Booking not found');
  }

  await writeBookings(nextBookings);
  return updatedBooking;
}

export function buildTrackingSteps(booking: Booking): TrackingStep[] {
  if (booking.status === 'cancelled') {
    return [
      { id: 'requested', label: 'Booking requested', state: 'done' },
      { id: 'cancelled', label: 'Booking cancelled', state: 'current' },
    ];
  }

  if (booking.status === 'pending') {
    return [
      { id: 'requested', label: 'Booking requested', state: 'done' },
      { id: 'payment', label: 'Payment pending', state: 'current' },
      { id: 'confirmation', label: 'Driver confirmation', state: 'upcoming' },
    ];
  }

  if (booking.status === 'completed') {
    return [
      { id: 'requested', label: 'Booking requested', state: 'done' },
      { id: 'confirmed', label: 'Driver confirmed booking', state: 'done' },
      { id: 'pickup', label: 'Pickup completed', state: 'done' },
      { id: 'dropoff', label: 'Drop-off completed', state: 'done' },
    ];
  }

  return [
    { id: 'requested', label: 'Booking requested', state: 'done' },
    { id: 'confirmed', label: 'Driver confirmed booking', state: 'done' },
    { id: 'pickup', label: 'Meet at pickup point', state: 'current' },
    { id: 'route', label: 'Trip in progress', state: 'upcoming' },
    { id: 'dropoff', label: 'Reached destination', state: 'upcoming' },
  ];
}
