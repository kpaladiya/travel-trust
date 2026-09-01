import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getRideById } from '../../../src/services/rides';
import type { Ride } from '../../../src/types/rides';

export default function RideDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ride, setRide] = React.useState<Ride | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!id) {
        return () => undefined;
      }

      let active = true;
      void getRideById(id).then((item) => {
        if (active) {
          setRide(item);
        }
      });

      return () => {
        active = false;
      };
    }, [id])
  );

  if (!ride) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={styles.emptyTitle}>Ride not found</Text>
          <Text style={styles.emptyText}>This ride is no longer available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {ride.fromLocation} → {ride.toLocation}
            </Text>
            <Text style={styles.subtitle}>
              {ride.departureDate} at {ride.departureTime}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver</Text>
          <Text style={styles.value}>{ride.driverName}</Text>
          <Text style={styles.meta}>
            Rating {ride.rating.toFixed(1)} ({ride.reviews} reviews)
          </Text>
          <Text style={styles.meta}>{ride.verified ? 'Verified profile' : 'Pending verification review'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip details</Text>
          <Text style={styles.value}>Price per seat: EUR {ride.pricePerSeat.toFixed(2)}</Text>
          <Text style={styles.value}>Available seats: {ride.availableSeats}</Text>
          <Text style={styles.value}>Arrival time: {ride.arrivalTime}</Text>
          <Text style={styles.description}>{ride.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Car</Text>
          <Text style={styles.value}>
            {ride.carDetails.make} {ride.carDetails.model}
          </Text>
          <Text style={styles.meta}>Color: {ride.carDetails.color}</Text>
          <Text style={styles.meta}>License plate: {ride.carDetails.licensePlate}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ride preferences</Text>
          <Text style={styles.meta}>Smoking: {ride.smoker ? 'Allowed' : 'Not allowed'}</Text>
          <Text style={styles.meta}>Music: {ride.music ? 'Allowed' : 'Quiet ride'}</Text>
          <Text style={styles.meta}>Luggage: {ride.luggage ? 'Accepted' : 'Limited'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  content: { padding: 16, gap: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  backButton: { paddingTop: 2 },
  headerText: { flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#000' },
  subtitle: { marginTop: 8, color: '#666', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8 },
  value: { fontSize: 15, color: '#111', marginBottom: 6 },
  meta: { fontSize: 14, color: '#666', marginBottom: 4 },
  description: { marginTop: 8, fontSize: 14, lineHeight: 21, color: '#555' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: { marginTop: 16, fontSize: 20, fontWeight: '700', color: '#000' },
  emptyText: { marginTop: 8, fontSize: 14, color: '#666', textAlign: 'center' },
});
