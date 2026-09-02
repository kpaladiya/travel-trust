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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { hasGooglePlacesApiKey, searchPlaceSuggestions, type PlaceSuggestion } from '../../../src/services/google-places';
import { submitRide } from '../../../src/services/rides';
import { FormAction, FormField, ResponsiveForm } from '../../../src/components/forms/ResponsiveForm';

type ActiveField = 'from' | 'to' | null;

export default function PostRideScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const driverName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Driver';

  const [fromLocation, setFromLocation] = React.useState('');
  const [toLocation, setToLocation] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('');
  const [departureTime, setDepartureTime] = React.useState('');
  const [arrivalTime, setArrivalTime] = React.useState('');
  const [pricePerSeat, setPricePerSeat] = React.useState('');
  const [totalSeats, setTotalSeats] = React.useState('1');
  const [description, setDescription] = React.useState('');
  const [carMake, setCarMake] = React.useState('');
  const [carModel, setCarModel] = React.useState('');
  const [carColor, setCarColor] = React.useState('');
  const [licensePlate, setLicensePlate] = React.useState('');
  const [smoker, setSmoker] = React.useState(false);
  const [music, setMusic] = React.useState(true);
  const [luggage, setLuggage] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeField, setActiveField] = React.useState<ActiveField>(null);
  const [fromSuggestions, setFromSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [isFromLoading, setIsFromLoading] = React.useState(false);
  const [isToLoading, setIsToLoading] = React.useState(false);

  React.useEffect(() => {
    if (!hasGooglePlacesApiKey) {
      setFromSuggestions([]);
      return undefined;
    }

    const trimmedValue = fromLocation.trim();
    if (trimmedValue.length < 2) {
      setFromSuggestions([]);
      return undefined;
    }

    setIsFromLoading(true);
    const timer = setTimeout(() => {
      void searchPlaceSuggestions(trimmedValue)
        .then((items) => setFromSuggestions(items))
        .catch(() => setFromSuggestions([]))
        .finally(() => setIsFromLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [fromLocation]);

  React.useEffect(() => {
    if (!hasGooglePlacesApiKey) {
      setToSuggestions([]);
      return undefined;
    }

    const trimmedValue = toLocation.trim();
    if (trimmedValue.length < 2) {
      setToSuggestions([]);
      return undefined;
    }

    setIsToLoading(true);
    const timer = setTimeout(() => {
      void searchPlaceSuggestions(trimmedValue)
        .then((items) => setToSuggestions(items))
        .catch(() => setToSuggestions([]))
        .finally(() => setIsToLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [toLocation]);

  const handleSelectSuggestion = (field: ActiveField, suggestion: PlaceSuggestion) => {
    if (field === 'from') {
      setFromLocation(suggestion.fullText);
      setFromSuggestions([]);
    }

    if (field === 'to') {
      setToLocation(suggestion.fullText);
      setToSuggestions([]);
    }

    setActiveField(null);
  };

  const handleSubmit = async () => {
    if (
      !fromLocation.trim() ||
      !toLocation.trim() ||
      !departureDate.trim() ||
      !departureTime.trim() ||
      !arrivalTime.trim() ||
      !pricePerSeat.trim() ||
      !totalSeats.trim() ||
      !carMake.trim() ||
      !carModel.trim() ||
      !carColor.trim() ||
      !licensePlate.trim() ||
      !description.trim()
    ) {
      Alert.alert('Missing details', 'Please complete all route, schedule, car, and pricing fields.');
      return;
    }

    const parsedPrice = Number(pricePerSeat);
    const parsedSeats = Number(totalSeats);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isFinite(parsedSeats) || parsedSeats < 1) {
      Alert.alert('Invalid values', 'Price must be greater than 0 and seats must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ride = await submitRide({
        driverName,
        pricePerSeat: parsedPrice,
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        departureDate: departureDate.trim(),
        departureTime: departureTime.trim(),
        arrivalTime: arrivalTime.trim(),
        totalSeats: parsedSeats,
        description: description.trim(),
        carDetails: {
          make: carMake.trim(),
          model: carModel.trim(),
          color: carColor.trim(),
          licensePlate: licensePlate.trim(),
        },
        smoker,
        music,
        luggage,
        createdByUserId: user?.id,
        verified: false,
      });

      router.replace(`/(app)/(rides)/${ride.id}`);
    } catch (error: any) {
      Alert.alert('Post failed', error.message || 'Unable to post the ride right now.');
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
              <Text style={styles.title}>Post a ride</Text>
              <Text style={styles.subtitle}>Create a real ride listing that appears in Find a Ride.</Text>
            </View>
          </View>

          <ResponsiveForm style={styles.form}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{driverName}</Text>
              <Text style={styles.infoText}>This ride will be posted from your current profile.</Text>
            </View>

            <PlaceField
              label="From"
              value={fromLocation}
              placeholder="Enter departure"
              suggestions={fromSuggestions}
              isLoading={isFromLoading}
              isActive={activeField === 'from'}
              onFocus={() => setActiveField('from')}
              onChangeText={(value) => {
                setFromLocation(value);
                setActiveField('from');
              }}
              onSelectSuggestion={(suggestion) => handleSelectSuggestion('from', suggestion)}
            />

            <PlaceField
              label="To"
              value={toLocation}
              placeholder="Enter destination"
              suggestions={toSuggestions}
              isLoading={isToLoading}
              isActive={activeField === 'to'}
              onFocus={() => setActiveField('to')}
              onChangeText={(value) => {
                setToLocation(value);
                setActiveField('to');
              }}
              onSelectSuggestion={(suggestion) => handleSelectSuggestion('to', suggestion)}
            />

            <FormField label="Departure date">
              <TextInput style={styles.input} value={departureDate} onChangeText={setDepartureDate} placeholder="2026-06-12" />
            </FormField>

            <FormField label="Schedule">
              <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Departure time</Text>
                <TextInput style={styles.input} value={departureTime} onChangeText={setDepartureTime} placeholder="09:30" />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Arrival time</Text>
                <TextInput style={styles.input} value={arrivalTime} onChangeText={setArrivalTime} placeholder="11:00" />
              </View>
              </View>
            </FormField>

            <FormField label="Seats and price">
              <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Price per seat</Text>
                <TextInput
                  style={styles.input}
                  value={pricePerSeat}
                  onChangeText={setPricePerSeat}
                  keyboardType="decimal-pad"
                  placeholder="25"
                />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Total seats</Text>
                <TextInput
                  style={styles.input}
                  value={totalSeats}
                  onChangeText={setTotalSeats}
                  keyboardType="number-pad"
                  placeholder="3"
                />
              </View>
              </View>
            </FormField>

            <FormField label="Car make">
              <TextInput style={styles.input} value={carMake} onChangeText={setCarMake} placeholder="Mercedes" />
            </FormField>

            <FormField label="Car model">
              <TextInput style={styles.input} value={carModel} onChangeText={setCarModel} placeholder="C-Class" />
            </FormField>

            <FormField label="Car details">
              <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Color</Text>
                <TextInput style={styles.input} value={carColor} onChangeText={setCarColor} placeholder="Silver" />
              </View>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>License plate</Text>
                <TextInput style={styles.input} value={licensePlate} onChangeText={setLicensePlate} placeholder="FR-123-ABC" />
              </View>
              </View>
            </FormField>

            <FormField label="Description">
              <TextInput style={[styles.input, styles.multilineInput]} value={description} onChangeText={setDescription} placeholder="Describe the route, comfort, luggage space, and pickup notes." multiline />
            </FormField>

            <FormField label="Smoking"><ToggleRow label="Smoking allowed" checked={smoker} onToggle={() => setSmoker(!smoker)} /></FormField>
            <FormField label="Music"><ToggleRow label="Music okay" checked={music} onToggle={() => setMusic(!music)} /></FormField>
            <FormField label="Luggage"><ToggleRow label="Luggage accepted" checked={luggage} onToggle={() => setLuggage(!luggage)} /></FormField>

            <FormAction>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Posting...' : 'Post Ride'}</Text>
              </TouchableOpacity>
            </FormAction>
          </ResponsiveForm>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function PlaceField({
  label,
  value,
  placeholder,
  suggestions,
  isLoading,
  isActive,
  onChangeText,
  onFocus,
  onSelectSuggestion,
}: {
  label: string;
  value: string;
  placeholder: string;
  suggestions: PlaceSuggestion[];
  isLoading: boolean;
  isActive: boolean;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onSelectSuggestion: (suggestion: PlaceSuggestion) => void;
}) {
  const showSuggestions = isActive && suggestions.length > 0;

  return (
    <FormField label={label} labelStyle={styles.label} style={styles.fieldGroup}>
      <View style={styles.inputWrapper}>
        <Ionicons name="location" size={20} color="#007AFF" />
        <TextInput
          style={styles.placeInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
        {isLoading ? <ActivityIndicator size="small" color="#007AFF" /> : null}
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsDropdown}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionOption}
              onPress={() => onSelectSuggestion(suggestion)}
            >
              <Ionicons name="navigate-outline" size={18} color="#6B7280" />
              <View style={styles.suggestionCopy}>
                <Text style={styles.suggestionPrimary}>{suggestion.primaryText}</Text>
                {suggestion.secondaryText ? <Text style={styles.suggestionSecondary}>{suggestion.secondaryText}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </FormField>
  );
}

function ToggleRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { marginRight: 10, paddingTop: 2 },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 13, color: '#6B7280', lineHeight: 18 },
  form: { paddingHorizontal: 16, paddingBottom: 24 },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1D4ED8' },
  infoText: { marginTop: 4, fontSize: 12, color: '#1E40AF' },
  fieldGroup: { marginTop: 0 },
  label: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8, marginTop: 12 },
  inlineLabel: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  placeInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 12,
  },
  suggestionsDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  suggestionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  suggestionCopy: { flex: 1 },
  suggestionPrimary: { fontSize: 14, color: '#111827', fontWeight: '600' },
  suggestionSecondary: { marginTop: 2, fontSize: 12, color: '#6B7280' },
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
  inlineFields: { flexDirection: 'row', gap: 12 },
  inlineField: { flex: 1 },
  multilineInput: { minHeight: 96, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14 },
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
  checkboxChecked: { backgroundColor: '#007AFF' },
  toggleLabel: { flex: 1, fontSize: 13, lineHeight: 19, color: '#4B5563' },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
