import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../../src/context/AuthContext';
import { hasGooglePlacesApiKey, searchPlaceSuggestions, type PlaceSuggestion } from '../../../src/services/google-places';
import { getRides } from '../../../src/services/rides';
import type { Ride } from '../../../src/types/rides';
import { userExperienceCopy } from '../../../src/types/user-mode';

type ActiveField = 'from' | 'to' | null;

const normalizeLocation = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const placeMatches = (rideLocation: string, query: string) => {
  const normalizedRideLocation = normalizeLocation(rideLocation);
  const normalizedQuery = normalizeLocation(query);

  if (!normalizedQuery) {
    return true;
  }

  if (normalizedRideLocation.includes(normalizedQuery) || normalizedQuery.includes(normalizedRideLocation)) {
    return true;
  }

  const searchTokens = normalizedQuery.split(' ').filter((token) => token.length > 2);
  return searchTokens.some((token) => normalizedRideLocation.includes(token));
};

export default function RidesHomeScreen() {
  const router = useRouter();
  const { user, experienceMode, setExperienceMode } = useAuth();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [fromSuggestions, setFromSuggestions] = useState<PlaceSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isFromLoading, setIsFromLoading] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      void getRides().then((items) => {
        if (active) {
          setAllRides(items);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!hasGooglePlacesApiKey) {
      setFromSuggestions([]);
      return undefined;
    }

    const trimmedValue = fromCity.trim();
    if (trimmedValue.length < 2) {
      setFromSuggestions([]);
      setPlacesError(null);
      return undefined;
    }

    setIsFromLoading(true);
    const timer = setTimeout(() => {
      void searchPlaceSuggestions(trimmedValue)
        .then((items) => {
          setFromSuggestions(items);
          setPlacesError(null);
        })
        .catch((error: Error) => {
          setFromSuggestions([]);
          setPlacesError(error.message);
        })
        .finally(() => setIsFromLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [fromCity]);

  useEffect(() => {
    if (!hasGooglePlacesApiKey) {
      setToSuggestions([]);
      return undefined;
    }

    const trimmedValue = toCity.trim();
    if (trimmedValue.length < 2) {
      setToSuggestions([]);
      setPlacesError(null);
      return undefined;
    }

    setIsToLoading(true);
    const timer = setTimeout(() => {
      void searchPlaceSuggestions(trimmedValue)
        .then((items) => {
          setToSuggestions(items);
          setPlacesError(null);
        })
        .catch((error: Error) => {
          setToSuggestions([]);
          setPlacesError(error.message);
        })
        .finally(() => setIsToLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [toCity]);

  const myPostedRides = allRides.filter((ride) => ride.createdByUserId === user?.id);
  const modeCopy = userExperienceCopy[experienceMode];

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSearch = () => {
    if (!fromCity.trim() || !toCity.trim()) {
      Alert.alert('Error', 'Please enter both departure and destination.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setActiveField(null);

    setTimeout(() => {
      const filteredRides = allRides.filter(
        (ride) =>
          placeMatches(ride.fromLocation, fromCity) &&
          placeMatches(ride.toLocation, toCity) &&
          (!date || ride.departureDate === ride.departureDate)
      );
      setRides(filteredRides);
      setIsLoading(false);
    }, 500);
  };

  const selectSuggestion = (field: ActiveField, suggestion: PlaceSuggestion) => {
    if (field === 'from') {
      setFromCity(suggestion.fullText);
      setFromSuggestions([]);
    }

    if (field === 'to') {
      setToCity(suggestion.fullText);
      setToSuggestions([]);
    }

    setActiveField(null);
  };

  const renderRideCard = ({ item }: { item: Ride }) => (
    <TouchableOpacity style={styles.rideCard} onPress={() => router.push(`/(app)/(rides)/${item.id}`)}>
      <View style={styles.rideCardTop}>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.driverName.charAt(0)}</Text>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{item.driverName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({item.reviews})</Text>
            </View>
          </View>
        </View>
        <Text style={styles.price}>EUR {item.pricePerSeat.toFixed(2)}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View>
          <View style={styles.routePoint}>
            <Ionicons name="location" size={16} color="#007AFF" />
            <Text style={styles.routeText}>{item.fromLocation}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.routeText}>{item.toLocation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rideCardBottom}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.timeText}>{item.departureTime}</Text>
        </View>
        <View style={styles.seatsContainer}>
          <Ionicons name="people" size={14} color="#666" />
          <Text style={styles.seatsText}>{item.availableSeats} seats</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchEyebrow}>{experienceMode === 'creator' ? 'Driver marketplace' : 'Ride marketplace'}</Text>
            <Text style={styles.searchTitle}>{modeCopy.ridesTitle}</Text>
            <Text style={styles.searchSubtitle}>{modeCopy.ridesSubtitle}</Text>
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

          <View style={styles.heroActionCard}>
            <Text style={styles.heroActionTitle}>
              {experienceMode === 'creator' ? 'Publish a ride and fill your empty seats.' : 'Search trusted rides with a modern marketplace feel.'}
            </Text>
            <Text style={styles.heroActionSubtitle}>
              {experienceMode === 'creator'
                ? 'Share your route, seats, and car details like a professional ride listing.'
                : 'Enter your route once and compare drivers, timing, and seats like Uber meets BlaBlaCar.'}
            </Text>
            {experienceMode === 'creator' ? (
              <TouchableOpacity style={styles.heroActionButton} onPress={() => router.push('/(app)/(rides)/post')}>
                <Text style={styles.heroActionButtonText}>Post Ride</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.heroMetrics}>
                <View style={styles.metricChip}>
                  <Text style={styles.metricNumber}>{allRides.length}</Text>
                  <Text style={styles.metricLabel}>live rides</Text>
                </View>
                <View style={styles.metricChip}>
                  <Text style={styles.metricNumber}>Fast</Text>
                  <Text style={styles.metricLabel}>matching</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.searchContainer}>
          {!hasGooglePlacesApiKey && (
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#92400E" />
              <Text style={styles.infoBannerText}>
                Search by city, airport, or address to find a matching ride.
              </Text>
            </View>
          )}

          {placesError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
              <Text style={styles.errorBannerText}>{placesError}</Text>
            </View>
          )}

          <PlaceField
            label="From"
            value={fromCity}
            placeholder="Enter departure"
            isActive={activeField === 'from'}
            isLoading={isFromLoading}
            suggestions={fromSuggestions}
            onFocus={() => setActiveField('from')}
            onChangeText={(value) => {
              setFromCity(value);
              setActiveField('from');
            }}
            onSelectSuggestion={(suggestion) => selectSuggestion('from', suggestion)}
          />

          <PlaceField
            label="To"
            value={toCity}
            placeholder="Enter destination"
            isActive={activeField === 'to'}
            isLoading={isToLoading}
            suggestions={toSuggestions}
            onFocus={() => setActiveField('to')}
            onChangeText={(value) => {
              setToCity(value);
              setActiveField('to');
            }}
            onSelectSuggestion={(suggestion) => selectSuggestion('to', suggestion)}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />
          )}

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="search" size={18} color="#fff" />
                <Text style={styles.searchButtonText}>Search Rides</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {experienceMode === 'creator' && myPostedRides.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>My posted rides</Text>
              <Ionicons name="car-sport-outline" size={20} color="#007AFF" />
            </View>
            <FlatList
              data={myPostedRides}
              renderItem={renderRideCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.ridesList}
            />
          </View>
        )}

        {hasSearched && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{isLoading ? 'Searching...' : `${rides.length} rides found`}</Text>
              {rides.length > 0 && <Ionicons name="car-outline" size={20} color="#007AFF" />}
            </View>

            {rides.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Ionicons name="car-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No rides found</Text>
                <Text style={styles.emptySubtext}>Try another place name, airport, or city.</Text>
              </View>
            )}

            {rides.length > 0 && (
              <FlatList
                data={rides}
                renderItem={renderRideCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                style={styles.ridesList}
              />
            )}
          </View>
        )}

        {!hasSearched && !(experienceMode === 'creator' && myPostedRides.length > 0) && (
          <View style={styles.noSearchState}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noSearchText}>
              {experienceMode === 'creator' ? 'Post a ride or search the market to get started' : 'Search for rides to get started'}
            </Text>
          </View>
        )}
      </ScrollView>

      {experienceMode === 'creator' && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/(rides)/post')}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
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
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
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
    </View>
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  searchEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  searchTitle: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  searchSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#D1D5DB',
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
  searchContainer: {
    backgroundColor: '#fff',
    marginTop: -14,
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  heroActionCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  heroActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  heroActionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#D1D5DB',
  },
  heroActionButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroActionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metricChip: {
    borderRadius: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#92400E',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#B91C1C',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  placeInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
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
  suggestionCopy: {
    flex: 1,
  },
  suggestionPrimary: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  suggestionSecondary: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  ridesList: {
    marginTop: 8,
  },
  rideCard: {
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
  rideCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 12,
    color: '#999',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  routeContainer: {
    marginVertical: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  routeLine: {
    height: 20,
    width: 2,
    backgroundColor: '#007AFF',
    marginLeft: 7,
    marginVertical: 4,
  },
  rideCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 8,
  },
  noSearchState: {
    alignItems: 'center',
    paddingVertical: 88,
    paddingHorizontal: 24,
  },
  noSearchText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
