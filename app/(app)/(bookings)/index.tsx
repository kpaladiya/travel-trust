import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { cancelBooking, getBookings, payForBooking } from '../../../src/services/bookings';
import { getOrCreateConversation } from '../../../src/services/chat';
import { getDefaultPaymentMethod } from '../../../src/services/profile-tools';
import type { Booking } from '../../../src/types/bookings';

export default function BookingsScreen() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  const loadBookings = React.useCallback(() => {
    void getBookings().then((items) => setBookings(items));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
      return () => undefined;
    }, [loadBookings])
  );

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'completed') {
      return booking.status === 'completed' || booking.status === 'cancelled';
    }
    return booking.status === 'pending' || booking.status === 'confirmed';
  });

  const handlePayNow = async (booking: Booking) => {
    const method = await getDefaultPaymentMethod();
    if (!method) {
      Alert.alert('No payment method', 'Add a payment method first from Profile > Payment Methods.');
      return;
    }

    await payForBooking(booking.id);
    loadBookings();
    Alert.alert('Payment complete', `Paid with ${method.brand} ending in ${method.last4}.`);
  };

  const handleCancel = async (booking: Booking) => {
    await cancelBooking(booking.id);
    loadBookings();
    Alert.alert('Booking cancelled', 'The booking status is now cancelled.');
  };

  const handleMessage = async (booking: Booking) => {
    const conversation = await getOrCreateConversation(booking.driverName);
    router.push(`/(app)/(chat)/${conversation.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'upcoming', 'completed'] as const).map((f) => (
            <Pressable
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterButtonText, filter === f && styles.filterButtonTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.content}>
          {filteredBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              onPress={() => router.push(`/(app)/(bookings)/${booking.id}`)}
            >
              <View style={styles.bookingCardTop}>
                <View>
                  <Text style={styles.driverName}>{booking.driverName}</Text>
                  <Text style={styles.route}>
                    {booking.fromLocation} → {booking.toLocation}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    booking.status === 'confirmed' && styles.statusBadgeConfirmed,
                    booking.status === 'cancelled' && styles.statusBadgeCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      booking.status === 'confirmed' && styles.statusTextConfirmed,
                      booking.status === 'cancelled' && styles.statusTextCancelled,
                    ]}
                  >
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detail}>
                  <Ionicons name="time" size={14} color="#666" />
                  <Text style={styles.detailText}>{booking.departureTime}</Text>
                </View>
                <View style={styles.detail}>
                  <Ionicons name="people" size={14} color="#666" />
                  <Text style={styles.detailText}>{booking.totalPassengers} passenger</Text>
                </View>
                <Text style={styles.price}>EUR {booking.totalPrice}</Text>
              </View>

              <View style={styles.bookingActions}>
                {booking.status === 'pending' && (
                  <>
                    <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => handleCancel(booking)}>
                      <Text style={styles.actionButtonSecondaryText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => handlePayNow(booking)}>
                      <Text style={styles.actionButtonPrimaryText}>Pay Now</Text>
                    </TouchableOpacity>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => handleMessage(booking)}>
                      <Ionicons name="chatbubble-outline" size={14} color="#007AFF" />
                      <Text style={styles.actionButtonSecondaryText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButtonPrimary}
                      onPress={() => router.push(`/(app)/(bookings)/${booking.id}`)}
                    >
                      <Ionicons name="map-outline" size={14} color="#fff" />
                      <Text style={styles.actionButtonPrimaryText}>Track</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterButtonText: { fontSize: 12, fontWeight: '500', color: '#666' },
  filterButtonTextActive: { color: '#fff' },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverName: { fontSize: 14, fontWeight: '600', color: '#000' },
  route: { fontSize: 12, color: '#666', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF3CD',
    borderRadius: 4,
  },
  statusBadgeConfirmed: { backgroundColor: '#D4EDDA' },
  statusBadgeCancelled: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#856404', textTransform: 'capitalize' },
  statusTextConfirmed: { color: '#155724' },
  statusTextCancelled: { color: '#B91C1C' },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  detail: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 6, fontSize: 12, color: '#666' },
  price: { fontSize: 14, fontWeight: '700', color: '#007AFF' },
  bookingActions: { flexDirection: 'row', gap: 8 },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonSecondaryText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
