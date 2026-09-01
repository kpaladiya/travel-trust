import Constants from 'expo-constants';
import type { FirebaseApp } from 'firebase/app';
import { getApp, getApps, initializeApp } from 'firebase/app';

const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyDEXAMPLE_REPLACE_WITH_YOUR_KEY',
  authDomain: 'travelrust.firebaseapp.com',
  projectId: 'travelrust',
  storageBucket: 'travelrust.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:EXAMPLE',
};

type FirebaseExtraConfig = Partial<typeof fallbackFirebaseConfig>;
type GoogleAuthExtraConfig = {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
};

type ExpoExtraConfig = {
  firebaseConfig?: FirebaseExtraConfig;
  auth?: {
    google?: GoogleAuthExtraConfig;
  };
};

const expoExtra = (Constants.expoConfig?.extra as ExpoExtraConfig | undefined) ?? {};

const firebaseConfig = {
  ...fallbackFirebaseConfig,
  ...expoExtra.firebaseConfig,
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? expoExtra.firebaseConfig?.apiKey ?? fallbackFirebaseConfig.apiKey,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    expoExtra.firebaseConfig?.authDomain ??
    fallbackFirebaseConfig.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? expoExtra.firebaseConfig?.projectId ?? fallbackFirebaseConfig.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    expoExtra.firebaseConfig?.storageBucket ??
    fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    expoExtra.firebaseConfig?.messagingSenderId ??
    fallbackFirebaseConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? expoExtra.firebaseConfig?.appId ?? fallbackFirebaseConfig.appId,
};

let app: FirebaseApp | null = null;

const ensureFirebaseApp = () => {
  if (app) {
    return app;
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  return app;
};

export const initializeFirebase = () => {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('REPLACE_WITH_YOUR_KEY')) {
    console.warn('⚠️ Firebase is using placeholder credentials. Set your EXPO_PUBLIC_FIREBASE_* values before production auth testing.');
  }

  return ensureFirebaseApp();
};

export const getFirebaseApp = () => {
  if (!app) {
    initializeFirebase();
  }

  return app;
};

export const getGoogleAuthConfig = (): GoogleAuthExtraConfig => {
  const extraGoogleConfig = expoExtra.auth?.google;

  return {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extraGoogleConfig?.webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extraGoogleConfig?.iosClientId,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? extraGoogleConfig?.androidClientId,
  };
};

export const hasGoogleAuthConfig = () => {
  const googleConfig = getGoogleAuthConfig();

  return Boolean(googleConfig.webClientId || googleConfig.iosClientId || googleConfig.androidClientId);
};
