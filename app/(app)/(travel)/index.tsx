import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { getHelpOffers } from '../../../src/services/help-offers';
import { formatEuro } from '../../../src/services/travel-pricing';
import { getTravelPlans } from '../../../src/services/travel-plans';
import type { HelpOffer, TravelHelpPlan, TravelRequestStatus } from '../../../src/types/travel-help';
import { userExperienceCopy } from '../../../src/types/user-mode';

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

const formatRequestStatus = (status: TravelRequestStatus) => status.replace('_', ' ');

export default function TravelScreen() {
  const router = useRouter();
  const { user, experienceMode, setExperienceMode } = useAuth();
  const [offers, setOffers] = React.useState<HelpOffer[]>([]);
  const [plans, setPlans] = React.useState<TravelHelpPlan[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      void Promise.all([getHelpOffers(), getTravelPlans()]).then(([offerItems, planItems]) => {
        if (active) {
          setOffers(offerItems);
          setPlans(planItems);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  const myRequests = plans.filter((plan) => plan.createdByUserId === user?.id);
  const modeCopy = userExperienceCopy[experienceMode];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.headerEyebrow}>{experienceMode === 'creator' ? 'Travel assistance board' : 'Community helper board'}</Text>
              <Text style={styles.title}>{modeCopy.travelTitle}</Text>
              <Text style={styles.subtitle}>{modeCopy.travelSubtitle}</Text>
              <View style={styles.modeSwitcher}>
                {(['creator', 'finder'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.modeButton, experienceMode === mode && styles.modeButtonActive]}
                    onPress={() => void setExperienceMode(mode)}
                  >
                    <Text style={[styles.modeButtonText, experienceMode === mode && styles.modeButtonTextActive]}>
                      {userExperienceCopy[mode].shortLabel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {experienceMode === 'creator' && (
              <TouchableOpacity style={styles.postButton} onPress={() => router.push('/(app)/(travel)/post')}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.postButtonText}>Post Request</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroCardTitle}>
              {experienceMode === 'creator' ? 'Publish your support request before arrival.' : 'Offer trusted travel help and see your payout clearly.'}
            </Text>
            <Text style={styles.heroCardSubtitle}>
              {experienceMode === 'creator'
                ? 'Create a polished help request with fixed package pricing and visible review status.'
                : 'Browse traveler needs, review helper earnings, and respond with a cleaner marketplace experience.'}
            </Text>
          </View>
        </View>

        {experienceMode === 'creator' && myRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My posted requests</Text>
            {myRequests.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.requestCard}
                onPress={() => router.push(`/(app)/(travel)/${plan.id}`)}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.flexCard}>
                    <Text style={styles.offerTitle}>{plan.assistanceTitle}</Text>
                    <Text style={styles.offerSubtitle}>
                      {plan.toCity} · {plan.arrivalDate} at {plan.arrivalTime}
                    </Text>
                    <Text style={styles.priceMeta}>Traveler pays {formatEuro(plan.travelerPriceEUR)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${requestStatusColors[plan.status]}18` }]}>
                    <Text style={[styles.statusText, { color: requestStatusColors[plan.status] }]}>
                      {formatRequestStatus(plan.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {experienceMode === 'finder' && offers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My active help offers</Text>
            {offers.map((offer) => {
              const plan = plans.find((item) => item.id === offer.planId);
              return (
                <TouchableOpacity
                  key={offer.id}
                  style={styles.offerCard}
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/(travel)/confirmation',
                      params: { offerId: offer.id, planId: offer.planId },
                    })
                  }
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.flexCard}>
                      <Text style={styles.offerTitle}>{plan?.userName ?? 'Traveler request'}</Text>
                      <Text style={styles.offerSubtitle}>
                        {plan?.toCity ?? 'Destination'} · {new Date(offer.submittedAt).toLocaleDateString()}
                      </Text>
                      {plan ? <Text style={styles.priceMeta}>Payout {formatEuro(plan.helperPayoutEUR)}</Text> : null}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${offerStatusColors[offer.status]}18` }]}>
                      <Text style={[styles.statusText, { color: offerStatusColors[offer.status] }]}>{offer.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.content}>
           {plans.map((plan) => {
            const isOwnRequest = plan.createdByUserId === user?.id;
            if (experienceMode === 'creator' && !isOwnRequest) {
              return null;
            }
            return (
              <View key={plan.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{plan.userName.split(' ')[0][0]}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{plan.userName}</Text>
                    <Text style={styles.cardSubtitle}>
                      {plan.fromCity} → {plan.toCity}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${requestStatusColors[plan.status]}18` }]}>
                    <Text style={[styles.statusText, { color: requestStatusColors[plan.status] }]}>
                      {formatRequestStatus(plan.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>{plan.description}</Text>
                <View style={styles.detailList}>
                  <Text style={styles.detailText}>Arrival: {plan.arrivalAirport}</Text>
                  <Text style={styles.detailText}>
                    Passengers: {plan.passengerCount} · Luggage: {plan.luggageCount}
                  </Text>
                  <Text style={styles.detailText}>
                    Price: {formatEuro(plan.travelerPriceEUR)} · Helper payout {formatEuro(plan.helperPayoutEUR)}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.badge}>
                    <Ionicons name="checkmark-circle" size={14} color="#007AFF" />
                    <Text style={styles.badgeText}>{plan.verified ? 'Verified' : 'Team review in progress'}</Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => router.push(`/(app)/(travel)/${plan.id}`)}
                    >
                      <Text style={styles.secondaryButtonText}>{isOwnRequest ? 'View Status' : 'View Request'}</Text>
                    </TouchableOpacity>
                     {experienceMode === 'finder' && !isOwnRequest && (
                       <TouchableOpacity
                         style={styles.helpButton}
                        onPress={() =>
                          router.push({
                            pathname: '/(app)/(travel)/offer',
                            params: { planId: plan.id },
                          })
                        }
                      >
                        <Text style={styles.helpButtonText}>Offer Help</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  heroSection: {
    backgroundColor: '#111827',
    paddingBottom: 22,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#D1D5DB',
    marginTop: 8,
    lineHeight: 19,
  },
  modeSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  postButton: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  heroCardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#D1D5DB',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  offerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  priceMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  flexCard: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  detailList: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgeText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  helpButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
