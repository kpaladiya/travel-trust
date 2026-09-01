import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoRides } from '../data/demo-rides';
import type { Ride, RideInput } from '../types/rides';

const RIDES_STORAGE_KEY = 'rides_state';

async function readStoredRides(): Promise<Ride[]> {
  const raw = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Ride[];
  } catch (error) {
    console.error('Failed to parse rides:', error);
    return [];
  }
}

async function writeStoredRides(rides: Ride[]) {
  await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(rides));
}

export async function getRides(): Promise<Ride[]> {
  const storedRides = await readStoredRides();
  return [...storedRides, ...(demoRides as Ride[])];
}

export async function getRideById(rideId: string): Promise<Ride | null> {
  const rides = await getRides();
  return rides.find((ride) => ride.id === rideId) ?? null;
}

export async function submitRide(input: RideInput): Promise<Ride> {
  const storedRides = await readStoredRides();
  const initials = input.driverName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? 'U')
    .join('');

  const ride: Ride = {
    ...input,
    id: `ride_${Date.now()}`,
    rating: input.rating ?? 0,
    reviews: input.reviews ?? 0,
    availableSeats: input.totalSeats,
    driverImage: input.driverImage ?? `https://via.placeholder.com/48/007AFF/ffffff?text=${initials || 'U'}`,
    verified: input.verified ?? false,
    createdAt: new Date().toISOString(),
  };

  storedRides.unshift(ride);
  await writeStoredRides(storedRides);
  return ride;
}
