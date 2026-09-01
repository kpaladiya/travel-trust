import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { buildTrackingSteps, cancelBooking, getBookingById, payForBooking } from '../../../src/services/bookings';
import { getOrCreateConversation } from '../../../src/services/chat';
import { getDefaultPaymentMethod } from '../../../src/services/profile-tools';
import type { Booking } from '../../../src/types/bookings';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = React.useState<Booking | null>(null);

  const loadBooking = React.useCallback(() => {
    if (!id) {
      return;
    }

    void getBookingById(id).then((item) => setBooking(item));
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      loadBooking();
      return () => undefined;
    }, [loadBooking])
  );

  const handlePayNow = async () => {
    if (!booking) {
      return;
    }

    const method = await getDefaultPaymentMethod();
    if (!method) {
      Alert.alert('No payment method', 'Add a payment method first from Profile > Payment Methods.');
      return;
    }

    await payForBooking(booking.id);
    loadBooking();
    Alert.alert('Payment complete', `Paid with ${method.brand} ending in ${method.last4}.`);
  };

  const handleCancel = async () => {
    if (!booking) {
      return;
    }

    await cancelBooking(booking.id);
    loadBooking();
    Alert.alert('Booking cancelled', 'Your booking has been updated.');
  };

  const handleMessageDriver = async () => {
    if (!booking) {
      return;
    }

    const conversation = await getOrCreateConversation(booking.driverName);
    router.push(`/(app)/(chat)/${conversation.id}`);
  };

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const trackingSteps = buildTrackingSteps(booking);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{booking.driverName}</Text>
            <Text style={styles.subtitle}>
              {booking.fromLocation} → {booking.toLocation}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Booking details</Text>
            <Text style={styles.detailText}>Departure: {booking.departureDate} at {booking.departureTime}</Text>
            <Text style={styles.detailText}>Passengers: {booking.totalPassengers}</Text>
            <Text style={styles.detailText}>Fare: EUR {booking.totalPrice}</Text>
            <Text style={styles.detailText}>Status: {booking.status}</Text>
            <Text style={styles.detailText}>Payment: {booking.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Trip tracking</Text>
            {trackingSteps.map((step) => (
              <View key={step.id} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    step.state === 'done' && styles.stepDotDone,
                    step.state === 'current' && styles.stepDotCurrent,
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    step.state === 'current' && styles.stepLabelCurrent,
                    step.state === 'done' && styles.stepLabelDone,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          {booking.status === 'pending' && (
            <>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
                <Text style={styles.secondaryButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handlePayNow}>
                <Text style={styles.primaryButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleMessageDriver}>
                <Text style={styles.secondaryButtonText}>Message Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={loadBooking}>
                <Text style={styles.primaryButtonText}>Refresh Tracking</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: { marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 13, color: '#6B7280' },
  section: { paddingHorizontal: 16, paddingTop: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  detailText: { fontSize: 14, color: '#374151', marginBottom: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  stepDotDone: { backgroundColor: '#10B981' },
  stepDotCurrent: { backgroundColor: '#007AFF' },
  stepLabel: { fontSize: 14, color: '#6B7280' },
  stepLabelDone: { color: '#111827' },
  stepLabelCurrent: { color: '#007AFF', fontWeight: '700' },
  actions: { padding: 16, gap: 10 },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: { color: '#374151', fontSize: 15, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
});
