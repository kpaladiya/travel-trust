import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { submitHelpOffer } from '../../../src/services/help-offers';
import { formatEuro } from '../../../src/services/travel-pricing';
import { getTravelPlanById } from '../../../src/services/travel-plans';
import type { TravelHelpPlan } from '../../../src/types/travel-help';

export default function OfferHelpScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [plan, setPlan] = React.useState<TravelHelpPlan | null>(null);
  const [helperName, setHelperName] = React.useState(
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  );
  const [helperPhone, setHelperPhone] = React.useState(user?.phone ?? '');
  const [helperCity, setHelperCity] = React.useState(user?.city ?? '');
  const [meetingPoint, setMeetingPoint] = React.useState('');
  const [supportNote, setSupportNote] = React.useState('');
  const [canDrive, setCanDrive] = React.useState(true);
  const [canTranslate, setCanTranslate] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!planId) {
        return () => undefined;
      }

      let active = true;
      void getTravelPlanById(planId).then((value) => {
        if (active) {
          setPlan(value);
        }
      });

      return () => {
        active = false;
      };
    }, [planId])
  );

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Travel request not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    if (!helperName || !helperPhone || !helperCity || !meetingPoint) {
      Alert.alert('Missing details', 'Please complete your name, phone, city, and meeting point.');
      return;
    }

    setIsSubmitting(true);
    try {
      const offer = await submitHelpOffer({
        planId: plan.id,
        helperName,
        helperPhone,
        helperCity,
        meetingPoint,
        supportNote,
        canDrive,
        canTranslate,
      });

      router.replace({
        pathname: '/(app)/(travel)/confirmation',
        params: { offerId: offer.id, planId: plan.id },
      });
    } catch (error: any) {
      Alert.alert('Offer failed', error.message || 'Unable to submit help offer right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#007AFF" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Offer Help</Text>
              <Text style={styles.subtitle}>{plan.userName} · {plan.arrivalAirport}</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.pricingCard}>
              <Text style={styles.pricingTitle}>Helper earnings for this request</Text>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Traveler pays</Text>
                <Text style={styles.pricingValue}>{formatEuro(plan.travelerPriceEUR)}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Platform commission</Text>
                <Text style={styles.pricingValue}>{formatEuro(plan.platformCommissionEUR)}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>You receive after 20% deduction</Text>
                <Text style={styles.pricingValue}>{formatEuro(plan.helperPayoutEUR)}</Text>
              </View>
            </View>

            <Text style={styles.label}>Your name</Text>
            <TextInput style={styles.input} value={helperName} onChangeText={setHelperName} placeholder="Anita Sharma" />

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={helperPhone}
              onChangeText={setHelperPhone}
              placeholder="+49 170 123 4567"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={helperCity} onChangeText={setHelperCity} placeholder="Frankfurt" />

            <Text style={styles.label}>Meeting point</Text>
            <TextInput
              style={styles.input}
              value={meetingPoint}
              onChangeText={setMeetingPoint}
              placeholder="Terminal 1 arrivals, gate B"
            />

            <Text style={styles.label}>How will you help?</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={supportNote}
              onChangeText={setSupportNote}
              placeholder="I can meet at arrivals, help with train tickets, and speak Hindi and English."
              multiline
            />

            <ToggleRow
              label="I can drive or coordinate local transport"
              checked={canDrive}
              onToggle={() => setCanDrive(!canDrive)}
            />
            <ToggleRow
              label="I can translate during airport or hotel transfer"
              checked={canTranslate}
              onToggle={() => setCanTranslate(!canTranslate)}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Confirm Help Offer'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
      </View>
      <Text style={styles.toggleLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  form: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  pricingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 6,
  },
  pricingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  pricingLabel: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },
  pricingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  toggleLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
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
