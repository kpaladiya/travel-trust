import Constants from 'expo-constants';

type FirebaseExtraConfig = {
  firebaseConfig?: {
    apiKey?: string;
  };
};

type FirebaseAuthProvider = 'password' | 'google.com' | 'apple.com';

export type FirebaseAuthTokens = {
  localId: string;
  email?: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type FirebaseLookupUser = {
  localId: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoUrl?: string;
  providerUserInfo?: Array<{
    providerId?: string;
    displayName?: string;
    photoUrl?: string;
    federatedId?: string;
  }>;
};

type FirebaseSignInWithIdpResponse = FirebaseAuthTokens & {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  photoUrl?: string;
  providerId?: string;
  emailVerified?: boolean;
  rawUserInfo?: string;
  isNewUser?: boolean | string;
};

const expoExtra = (Constants.expoConfig?.extra as FirebaseExtraConfig | undefined) ?? {};
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? expoExtra.firebaseConfig?.apiKey ?? '';
const identityBaseUrl = 'https://identitytoolkit.googleapis.com/v1';
const secureTokenUrl = 'https://securetoken.googleapis.com/v1/token';

const ensureApiKey = () => {
  if (!apiKey || apiKey.includes('REPLACE_WITH_YOUR_KEY')) {
    throw new Error('Firebase API key is missing. Set EXPO_PUBLIC_FIREBASE_API_KEY before testing auth.');
  }

  return apiKey;
};

const parseFirebaseError = (code?: string) => {
  switch (code) {
    case 'EMAIL_EXISTS':
      return 'This email address is already in use.';
    case 'OPERATION_NOT_ALLOWED':
      return 'This sign-in method is not enabled in Firebase Authentication.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return 'Too many attempts. Please try again later.';
    case 'EMAIL_NOT_FOUND':
      return 'No account was found for this email address.';
    case 'INVALID_PASSWORD':
      return 'The password is incorrect.';
    case 'USER_DISABLED':
      return 'This account has been disabled.';
    case 'INVALID_ID_TOKEN':
    case 'TOKEN_EXPIRED':
      return 'Your session expired. Please sign in again.';
    case 'INVALID_REFRESH_TOKEN':
      return 'Your session is no longer valid. Please sign in again.';
    case 'FEDERATED_USER_ID_ALREADY_LINKED':
      return 'This provider account is already linked to another user.';
    case 'INVALID_CREDENTIAL':
      return 'The provider credential is invalid.';
    default:
      return code ? code.replace(/_/g, ' ').toLowerCase() : 'Authentication request failed.';
  }
};

const requestJson = async <T>(endpoint: string, payload: unknown, init?: RequestInit): Promise<T> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(payload),
    ...init,
  });

  const data = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw new Error(parseFirebaseError(data.error?.message));
  }

  return data;
};

export const signUpWithEmailPassword = async (email: string, password: string) =>
  requestJson<FirebaseAuthTokens>(
    `${identityBaseUrl}/accounts:signUp?key=${ensureApiKey()}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

export const signInWithEmailPassword = async (email: string, password: string) =>
  requestJson<FirebaseAuthTokens>(
    `${identityBaseUrl}/accounts:signInWithPassword?key=${ensureApiKey()}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

export const sendVerificationEmail = async (idToken: string) =>
  requestJson<{ email?: string }>(
    `${identityBaseUrl}/accounts:sendOobCode?key=${ensureApiKey()}`,
    {
      requestType: 'VERIFY_EMAIL',
      idToken,
    }
  );

export const lookupAccount = async (idToken: string) => {
  const response = await requestJson<{ users?: FirebaseLookupUser[] }>(
    `${identityBaseUrl}/accounts:lookup?key=${ensureApiKey()}`,
    {
      idToken,
    }
  );

  const user = response.users?.[0];

  if (!user) {
    throw new Error('No Firebase account data was returned.');
  }

  return user;
};

export const refreshIdToken = async (refreshToken: string) => {
  const response = await fetch(`${secureTokenUrl}?key=${ensureApiKey()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  });

  const data = (await response.json()) as {
    error?: { message?: string };
    user_id: string;
    id_token: string;
    refresh_token: string;
    expires_in: string;
  };

  if (!response.ok) {
    throw new Error(parseFirebaseError(data.error?.message));
  }

  return {
    localId: data.user_id,
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
};

export const signInWithIdp = async ({
  providerId,
  idToken,
  accessToken,
}: {
  providerId: FirebaseAuthProvider;
  idToken?: string;
  accessToken?: string | null;
}) => {
  const postBodyParts = [`providerId=${encodeURIComponent(providerId)}`];

  if (idToken) {
    postBodyParts.push(`id_token=${encodeURIComponent(idToken)}`);
  }

  if (accessToken) {
    postBodyParts.push(`access_token=${encodeURIComponent(accessToken)}`);
  }

  return requestJson<FirebaseSignInWithIdpResponse>(
    `${identityBaseUrl}/accounts:signInWithIdp?key=${ensureApiKey()}`,
    {
      requestUri: 'https://traveltrust.app/auth',
      postBody: postBodyParts.join('&'),
      returnSecureToken: true,
      returnIdpCredential: true,
    }
  );
};
