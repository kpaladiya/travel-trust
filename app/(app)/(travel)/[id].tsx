import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { getHelpOffersForPlan } from '../../../src/services/help-offers';
import { formatEuro } from '../../../src/services/travel-pricing';
import { getTravelPlanById } from '../../../src/services/travel-plans';
import type { HelpOffer, TravelHelpPlan, TravelRequestStatus } from '../../../src/types/travel-help';

const offerStatusColors: Record<HelpOffer['status'], string> = {
  submitted: '#2563EB',
  reviewing: '#F59E0B',
  matched: '#1F9D55',
  completed: '#0F766E',
};

const requestStatusColors: Record<TravelRequestStatus, string> = {
  approved: '#1F9D55',
  pending_review: '#F59E0B',
  needs_information: '#7C3AED',
  rejected: '#DC2626',
};

const reviewMessages: Record<TravelRequestStatus, string> = {
  approved: 'Your request passed the current review checks and can receive helper responses.',
  pending_review: 'Your request is waiting for team review before it is treated as trusted.',
  needs_information: 'Your team needs more information or proof before approving this request.',
  rejected: 'This request is not approved. Review the details with your team before posting again.',
};

const formatRequestStatus = (status: TravelRequestStatus) => status.replace('_', ' ');

export default function TravelRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plan, setPlan] = React.useState<TravelHelpPlan | null>(null);
  const [offers, setOffers] = React.useState<HelpOffer[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (!id) {
        return () => undefined;
      }

      let active = true;
      void Promise.all([getTravelPlanById(id), getHelpOffersForPlan(id)]).then(([planItem, offerItems]) => {
        if (active) {
          setPlan(planItem);
          setOffers(offerItems);
        }
      });

      return () => {
        active = false;
      };
    }, [id])
  );

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Traveler request not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnRequest = plan.createdByUserId === user?.id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>{plan.assistanceTitle}</Text>
            <Text style={styles.subtitle}>
              {plan.userName} · {plan.arrivalAirport}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Traveler request</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${requestStatusColors[plan.status]}18` }]}>
                <Text style={[styles.statusText, { color: requestStatusColors[plan.status] }]}>
                  {formatRequestStatus(plan.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.bodyText}>{plan.description}</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoText}>Route: {plan.fromCity} → {plan.toCity}</Text>
              <Text style={styles.infoText}>Arrival: {plan.arrivalDate} at {plan.arrivalTime}</Text>
              <Text style={styles.infoText}>Passengers: {plan.passengerCount}</Text>
              <Text style={styles.infoText}>Luggage: {plan.luggageCount}</Text>
              <Text style={styles.infoText}>Languages: {plan.languages.join(', ')}</Text>
              <Text style={styles.infoText}>Traveler price: {formatEuro(plan.travelerPriceEUR)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Support needed</Text>
            {plan.supportNeeded.map((item) => (
              <View key={item} style={styles.needRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#007AFF" />
                <Text style={styles.needText}>{item}</Text>
              </View>
            ))}
            <View style={styles.pricingBox}>
              <Text style={styles.pricingText}>Helper payout: {formatEuro(plan.helperPayoutEUR)}</Text>
            </View>
          </View>
        </View>

        {isOwnRequest ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Review status</Text>
              <Text style={styles.bodyText}>{reviewMessages[plan.status]}</Text>
              <View style={styles.infoList}>
                <Text style={styles.infoText}>Contact number: {plan.contactPhone}</Text>
                <Text style={styles.infoText}>Verification: {plan.verified ? 'Verified' : 'Pending team review'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Offer status</Text>
                <Text style={styles.offerCount}>{offers.length} offers</Text>
              </View>
              {offers.length === 0 ? (
                <Text style={styles.bodyText}>
                  No help offers submitted yet. You can be the first local helper to respond.
                </Text>
              ) : (
                offers.map((offer) => (
                  <View key={offer.id} style={styles.offerRow}>
                    <View>
                      <Text style={styles.offerName}>{offer.helperName}</Text>
                      <Text style={styles.offerMeta}>
                        {offer.helperCity} · {new Date(offer.submittedAt).toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${offerStatusColors[offer.status]}18` }]}>
                      <Text style={[styles.statusText, { color: offerStatusColors[offer.status] }]}>{offer.status}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {isOwnRequest ? (
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(app)/(travel)')}>
              <Text style={styles.primaryButtonText}>Back to Travel Companions</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                router.push({
                  pathname: '/(app)/(travel)/offer',
                  params: { planId: plan.id },
                })
              }
            >
              <Text style={styles.primaryButtonText}>Offer Help</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 10,
    paddingTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
  },
  infoList: {
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
  needRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  needText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#374151',
  },
  pricingBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 6,
  },
  pricingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  offerCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  offerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  offerMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
