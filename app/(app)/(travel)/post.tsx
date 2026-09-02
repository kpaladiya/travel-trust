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
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import {
  computeTravelCompanionPricing,
  formatEuro,
  travelSupportCatalog,
} from '../../../src/services/travel-pricing';
import { submitTravelPlan } from '../../../src/services/travel-plans';
import type { TravelSupportServiceCode } from '../../../src/types/travel-help';
import { FormAction, FormField, ResponsiveForm } from '../../../src/components/forms/ResponsiveForm';
import { DateTimeInput, formatDateInput } from '../../../src/components/forms/DateTimeInput';

export default function PostTravelRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Traveler';

  const [fromCity, setFromCity] = React.useState('');
  const [toCity, setToCity] = React.useState('');
  const [arrivalDate, setArrivalDate] = React.useState('');
  const [arrivalTime, setArrivalTime] = React.useState('');
  const [arrivalAirport, setArrivalAirport] = React.useState('');
  const [assistanceTitle, setAssistanceTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [supportServiceCodes, setSupportServiceCodes] = React.useState<TravelSupportServiceCode[]>([]);
  const [languagesText, setLanguagesText] = React.useState('');
  const [passengerCount, setPassengerCount] = React.useState('1');
  const [luggageCount, setLuggageCount] = React.useState('1');
  const [contactPhone, setContactPhone] = React.useState(user?.phone ?? '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const pricing = computeTravelCompanionPricing(supportServiceCodes);

  const handleSubmit = async () => {
    if (
      !fromCity ||
      !toCity ||
      !arrivalDate ||
      !arrivalTime ||
      !arrivalAirport ||
      !assistanceTitle ||
      !description ||
      !contactPhone
    ) {
      Alert.alert('Missing details', 'Please complete all main trip and contact fields.');
      return;
    }

    const passengers = Number(passengerCount);
    const luggage = Number(luggageCount);

    if (!Number.isFinite(passengers) || passengers < 1 || !Number.isFinite(luggage) || luggage < 0) {
      Alert.alert('Invalid counts', 'Passengers must be at least 1 and luggage cannot be negative.');
      return;
    }

    if (supportServiceCodes.length === 0) {
      Alert.alert('Select support', 'Choose at least one paid support package.');
      return;
    }

    setIsSubmitting(true);
    try {
      const plan = await submitTravelPlan({
        userName: fullName,
        contactPhone,
        fromCity,
        toCity,
        arrivalDate,
        arrivalTime,
        arrivalAirport,
        assistanceTitle,
        description,
        supportServiceCodes,
        supportNeeded: [],
        languages: languagesText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        passengerCount: passengers,
        luggageCount: luggage,
        createdByUserId: user?.id,
      });

      router.replace({
        pathname: '/(app)/(travel)/[id]',
        params: { id: plan.id },
      });
    } catch (error: any) {
      Alert.alert('Request failed', error.message || 'Unable to post your travel request right now.');
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
              <Text style={styles.title}>Post travel request</Text>
              <Text style={styles.subtitle}>New requests start in pending review until your team checks them.</Text>
            </View>
          </View>

          <ResponsiveForm style={styles.form}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{fullName}</Text>
              <Text style={styles.infoText}>This request will be posted from your signed-in profile.</Text>
            </View>

            <FormField label="From city"><TextInput style={styles.input} value={fromCity} onChangeText={setFromCity} placeholder="Delhi" /></FormField>
            <FormField label="To city"><TextInput style={styles.input} value={toCity} onChangeText={setToCity} placeholder="Frankfurt" /></FormField>
            <FormField label="Arrival date">
              <DateTimeInput minDate={formatDateInput(new Date())} mode="date" onChange={setArrivalDate} value={arrivalDate} />
            </FormField>
            <FormField label="Arrival time"><DateTimeInput mode="time" onChange={setArrivalTime} value={arrivalTime} /></FormField>
            <FormField label="Airport / station"><TextInput style={styles.input} value={arrivalAirport} onChangeText={setArrivalAirport} placeholder="Frankfurt Airport (FRA)" /></FormField>
            <FormField label="Request title"><TextInput style={styles.input} value={assistanceTitle} onChangeText={setAssistanceTitle} placeholder="Need airport guidance and local transport help" /></FormField>
            <FormField label="Describe what you need"><TextInput style={[styles.input, styles.multilineInput]} value={description} onChangeText={setDescription} placeholder="I am arriving for the first time and need help reaching my hotel safely." multiline /></FormField>
            <FormField label="Help needed">
              {travelSupportCatalog.map((service) => {
              const selected = supportServiceCodes.includes(service.code);
              return (
                <TouchableOpacity
                  key={service.code}
                  style={[styles.packageCard, selected && styles.packageCardSelected]}
                  onPress={() =>
                    setSupportServiceCodes((current) =>
                      current.includes(service.code)
                        ? current.filter((item) => item !== service.code)
                        : [...current, service.code]
                    )
                  }
                >
                  <View style={[styles.packageCheckbox, selected && styles.packageCheckboxSelected]}>
                    {selected ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
                  </View>
                  <View style={styles.packageCopy}>
                    <Text style={styles.packageTitle}>{service.label}</Text>
                    <Text style={styles.packageDescription}>{service.description}</Text>
                  </View>
                  <Text style={styles.packagePrice}>{formatEuro(service.priceEUR)}</Text>
                </TouchableOpacity>
              );
              })}
            </FormField>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingTitle}>Automatic pricing</Text>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Traveler pays</Text>
                <Text style={styles.pricingValue}>{formatEuro(pricing.travelerPriceEUR)}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Helper receives</Text>
                <Text style={styles.pricingValue}>{formatEuro(pricing.helperPayoutEUR)}</Text>
              </View>
            </View>

            <FormField label="Languages"><TextInput style={styles.input} value={languagesText} onChangeText={setLanguagesText} placeholder="English, Hindi" /></FormField>
            <FormField label="Passenger count"><TextInput style={styles.input} value={passengerCount} onChangeText={setPassengerCount} keyboardType="number-pad" placeholder="1" /></FormField>
            <FormField label="Luggage count"><TextInput style={styles.input} value={luggageCount} onChangeText={setLuggageCount} keyboardType="number-pad" placeholder="2" /></FormField>
            <FormField label="Contact phone"><TextInput style={styles.input} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" placeholder="+49 170 123 4567" /></FormField>
            <FormAction><TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}><Text style={styles.submitButtonText}>{isSubmitting ? 'Posting...' : 'Post Request'}</Text></TouchableOpacity></FormAction>
          </ResponsiveForm>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    lineHeight: 18,
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  infoText: {
    marginTop: 4,
    fontSize: 12,
    color: '#1E40AF',
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
  packageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 10,
  },
  packageCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#EFF6FF',
  },
  packageCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  packageCheckboxSelected: {
    backgroundColor: '#007AFF',
  },
  packageCopy: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  packageDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },
  packagePrice: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  pricingCard: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  pricingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pricingLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  pricingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
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
});
