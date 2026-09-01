import Constants from 'expo-constants';

interface GooglePlacesPrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

interface GooglePlacesResponse {
  status: string;
  predictions?: GooglePlacesPrediction[];
  error_message?: string;
}

export interface PlaceSuggestion {
  id: string;
  fullText: string;
  primaryText: string;
  secondaryText?: string;
}

const googleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  ((Constants.expoConfig?.extra?.googleMapsApiKey as string | undefined) ?? '');

export const hasGooglePlacesApiKey =
  googleMapsApiKey.length > 0 && !googleMapsApiKey.includes('REPLACE_WITH_YOUR_KEY');

export async function searchPlaceSuggestions(query: string): Promise<PlaceSuggestion[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2 || !hasGooglePlacesApiKey) {
    return [];
  }

  const params = new URLSearchParams({
    input: trimmedQuery,
    key: googleMapsApiKey,
    language: 'en',
  });

  const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to reach Google Places right now.');
  }

  const data = (await response.json()) as GooglePlacesResponse;

  if (data.status === 'ZERO_RESULTS') {
    return [];
  }

  if (data.status !== 'OK' || !data.predictions) {
    throw new Error(data.error_message || 'Google Places search failed.');
  }

  return data.predictions.map((prediction) => ({
    id: prediction.place_id,
    fullText: prediction.description,
    primaryText: prediction.structured_formatting?.main_text || prediction.description,
    secondaryText: prediction.structured_formatting?.secondary_text,
  }));
}
