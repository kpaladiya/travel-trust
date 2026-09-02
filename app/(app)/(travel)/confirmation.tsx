import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { getHelpOfferById } from '../../../src/services/help-offers';
import { formatEuro } from '../../../src/services/travel-pricing';
import { getTravelPlanById } from '../../../src/services/travel-plans';
import type { HelpOffer, TravelHelpPlan } from '../../../src/types/travel-help';

export default function HelpConfirmationScreen() {
  const router = useRouter();
  const { offerId, planId } = useLocalSearchParams<{ offerId: string; planId: string }>();
  const [offer, setOffer] = React.useState<HelpOffer | null>(null);
  const [plan, setPlan] = React.useState<TravelHelpPlan | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!offerId || !planId) {
        return () => undefined;
      }

      let active = true;
      void Promise.all([getHelpOfferById(offerId), getTravelPlanById(planId)]).then(([offerItem, planItem]) => {
        if (active) {
          setOffer(offerItem);
          setPlan(planItem);
        }
      });

      return () => {
        active = false;
      };
    }, [offerId, planId])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={44} color="#1F9D55" />
        </View>
        <Text style={styles.title}>Help offer submitted</Text>
        <Text style={styles.subtitle}>
          {offer?.helperName ?? 'Your offer'} was sent for {plan?.userName ?? 'the traveler'}.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Status</Text>
          <Text style={styles.summaryValue}>{offer?.status ?? 'submitted'}</Text>
          <Text style={styles.summaryLabel}>Traveler pays</Text>
          <Text style={styles.summaryValue}>{formatEuro(plan?.travelerPriceEUR ?? 0)}</Text>
          <Text style={styles.summaryLabel}>Estimated payout</Text>
          <Text style={styles.summaryValue}>{formatEuro(plan?.helperPayoutEUR ?? 0)}</Text>
          <Text style={styles.summaryLabel}>Meeting point</Text>
          <Text style={styles.summaryValue}>{offer?.meetingPoint ?? 'Not available'}</Text>
          <Text style={styles.summaryLabel}>Support note</Text>
          <Text style={styles.summaryValue}>{offer?.supportNote || 'No extra note added.'}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.replace({
              pathname: '/(app)/(travel)/[id]',
              params: { id: planId },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Track Request Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(app)/(travel)')}>
          <Text style={styles.secondaryButtonText}>Back to Travel Companions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 10,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
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
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
