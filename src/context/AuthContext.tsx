import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lookupAccount,
  refreshIdToken,
  sendVerificationEmail,
  signInWithEmailPassword,
  signInWithIdp,
  signUpWithEmailPassword,
  type FirebaseAuthTokens,
  type FirebaseLookupUser,
} from '../services/firebase-auth-rest';
import type { ConsentRecord } from '../types/compliance';
import type { UserExperienceMode } from '../types/user-mode';

const USER_STORAGE_KEY = 'user';
const PENDING_VERIFICATION_STORAGE_KEY = 'pending-verification-session';

type AuthProviderName = 'password' | 'google' | 'apple';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  profileImage?: string;
  rating?: number;
  reviews?: number;
  experienceMode: UserExperienceMode;
  compliance: ConsentRecord;
  authProvider: AuthProviderName;
  emailVerified: boolean;
}

type SignUpConsentInput = Omit<
  ConsentRecord,
  'lastUpdatedAt' | 'dataExportRequestedAt' | 'accountDeletionRequestedAt'
>;

type SocialAuthResult = {
  accountJustCreated: boolean;
};

type GoogleSignInInput = {
  idToken: string;
  accessToken?: string | null;
};

type AppleSignInInput = {
  idToken: string;
  rawNonce: string;
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
  };
};

type PendingVerificationSession = FirebaseAuthTokens & {
  authProvider: AuthProviderName;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  consent?: ConsentRecord;
  experienceMode?: UserExperienceMode;
  profileImage?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  pendingVerificationEmail: string | null;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
    city: string,
    consent: SignUpConsentInput
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<SocialAuthResult>;
  signInWithGoogle: (input: GoogleSignInInput) => Promise<SocialAuthResult>;
  signInWithApple: (input: AppleSignInInput) => Promise<SocialAuthResult>;
  signInAsDemo: (mode: UserExperienceMode) => Promise<void>;
  confirmEmailVerification: () => Promise<SocialAuthResult>;
  resendEmailVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  setMarketingConsent: (enabled: boolean) => Promise<void>;
  experienceMode: UserExperienceMode;
  setExperienceMode: (mode: UserExperienceMode) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildDefaultConsent = (marketingEmails = false): ConsentRecord => {
  const now = new Date().toISOString();

  return {
    termsAcceptedAt: now,
    privacyAcceptedAt: now,
    communityRulesAcceptedAt: now,
    ageConfirmedAt: now,
    marketingEmails,
    lastUpdatedAt: now,
  };
};

const normalizeUser = (
  storedUser: Partial<User> &
    Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> & {
      compliance?: ConsentRecord;
      experienceMode?: UserExperienceMode;
      authProvider?: AuthProviderName;
      emailVerified?: boolean;
    }
): User => ({
  id: storedUser.id,
  email: storedUser.email,
  firstName: storedUser.firstName,
  lastName: storedUser.lastName,
  phone: storedUser.phone,
  city: storedUser.city,
  profileImage: storedUser.profileImage,
  rating: storedUser.rating ?? 0,
  reviews: storedUser.reviews ?? 0,
  experienceMode: storedUser.experienceMode ?? 'finder',
  compliance: storedUser.compliance ?? buildDefaultConsent(false),
  authProvider: storedUser.authProvider ?? 'password',
  emailVerified: storedUser.emailVerified ?? true,
});

const buildProfileImage = (firstName: string, lastName: string, fallback = 'U') => {
  const firstInitial = (firstName || fallback).charAt(0).toUpperCase();
  const lastInitial = (lastName || fallback).charAt(0).toUpperCase();

  return `https://via.placeholder.com/120/007AFF/ffffff?text=${firstInitial}${lastInitial}`;
};

const parseName = (fullName?: string | null) => {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];

  return {
    firstName: parts[0] ?? 'User',
    lastName: parts.slice(1).join(' '),
  };
};

const resolveAuthProvider = (lookupUser: FirebaseLookupUser): AuthProviderName => {
  const providerIds = lookupUser.providerUserInfo?.map((provider) => provider.providerId).filter(Boolean) ?? [];

  if (providerIds.includes('google.com')) {
    return 'google';
  }

  if (providerIds.includes('apple.com')) {
    return 'apple';
  }

  return 'password';
};

const readPendingVerificationSession = async () => {
  const rawSession = await AsyncStorage.getItem(PENDING_VERIFICATION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  return JSON.parse(rawSession) as PendingVerificationSession;
};

const persistPendingVerificationSession = async (session: PendingVerificationSession) => {
  await AsyncStorage.setItem(PENDING_VERIFICATION_STORAGE_KEY, JSON.stringify(session));
};

const clearPendingVerificationSession = async () => {
  await AsyncStorage.removeItem(PENDING_VERIFICATION_STORAGE_KEY);
};

const persistUser = async (nextUser: User, setUser: (user: User) => void) => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  setUser(nextUser);
};

const clearPersistedUser = async (setUser: (user: User | null) => void) => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
  setUser(null);
};

const buildUserFromAccountData = ({
  account,
  existingUser,
  pendingSession,
  authProvider,
  overrideName,
  overridePhotoUrl,
}: {
  account: FirebaseLookupUser;
  existingUser: User | null;
  pendingSession: PendingVerificationSession | null;
  authProvider?: AuthProviderName;
  overrideName?: string;
  overridePhotoUrl?: string;
}) => {
  const fallbackName = parseName(
    overrideName ??
      account.displayName ??
      pendingSession?.firstName?.concat(pendingSession.lastName ? ` ${pendingSession.lastName}` : '') ??
      null
  );
  const firstName = pendingSession?.firstName ?? existingUser?.firstName ?? fallbackName.firstName;
  const lastName = pendingSession?.lastName ?? existingUser?.lastName ?? fallbackName.lastName;

  return normalizeUser({
    id: account.localId,
    email: account.email ?? pendingSession?.email ?? existingUser?.email ?? '',
    firstName,
    lastName,
    phone: pendingSession?.phone ?? existingUser?.phone,
    city: pendingSession?.city ?? existingUser?.city,
    profileImage:
      overridePhotoUrl ??
      account.photoUrl ??
      account.providerUserInfo?.find((provider) => provider.photoUrl)?.photoUrl ??
      pendingSession?.profileImage ??
      existingUser?.profileImage ??
      buildProfileImage(firstName, lastName || firstName),
    rating: existingUser?.rating ?? 0,
    reviews: existingUser?.reviews ?? 0,
    experienceMode: pendingSession?.experienceMode ?? existingUser?.experienceMode ?? 'finder',
    compliance: pendingSession?.consent ?? existingUser?.compliance ?? buildDefaultConsent(false),
    authProvider: authProvider ?? resolveAuthProvider(account),
    emailVerified: authProvider === 'password' ? account.emailVerified : true,
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [storedUserData, pendingSession] = await Promise.all([
          AsyncStorage.getItem(USER_STORAGE_KEY),
          readPendingVerificationSession(),
        ]);

        if (storedUserData) {
          setUser(
            normalizeUser(
              JSON.parse(storedUserData) as Partial<User> & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
            )
          );
        }

        setPendingVerificationEmail(pendingSession?.email ?? null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    city: string,
    consent: SignUpConsentInput
  ) => {
    const trimmedName = name.trim();
    const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);
    const lastName = lastNameParts.join(' ');
    const consentRecord: ConsentRecord = {
      ...consent,
      lastUpdatedAt: new Date().toISOString(),
    };
    const authResponse = await signUpWithEmailPassword(email.trim(), password);

    await sendVerificationEmail(authResponse.idToken);
    await persistPendingVerificationSession({
      ...authResponse,
      authProvider: 'password',
      email: authResponse.email ?? email.trim(),
      firstName: firstName || 'User',
      lastName,
      phone,
      city,
      consent: consentRecord,
      experienceMode: 'finder',
      profileImage: buildProfileImage(firstName || 'User', lastName || firstName || 'User'),
    });

    setPendingVerificationEmail(authResponse.email ?? email.trim());
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const authResponse = await signInWithEmailPassword(email.trim(), password);
    const account = await lookupAccount(authResponse.idToken);

    if (!account.emailVerified) {
      const existingPending = await readPendingVerificationSession();
      await persistPendingVerificationSession({
        ...authResponse,
        authProvider: 'password',
        firstName: existingPending?.email === email.trim() ? existingPending.firstName : undefined,
        lastName: existingPending?.email === email.trim() ? existingPending.lastName : undefined,
        phone: existingPending?.email === email.trim() ? existingPending.phone : undefined,
        city: existingPending?.email === email.trim() ? existingPending.city : undefined,
        consent: existingPending?.email === email.trim() ? existingPending.consent : undefined,
        experienceMode: existingPending?.email === email.trim() ? existingPending.experienceMode : undefined,
        profileImage: existingPending?.email === email.trim() ? existingPending.profileImage : undefined,
      });
      setPendingVerificationEmail(account.email ?? email.trim());
      throw new Error('Please verify your email address before signing in.');
    }

    const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const existingUser = storedUserData
      ? normalizeUser(JSON.parse(storedUserData) as Partial<User> & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>)
      : null;
    const nextUser = buildUserFromAccountData({
      account,
      existingUser,
      pendingSession: null,
      authProvider: 'password',
    });

    await persistUser(nextUser, setUser);
    await clearPendingVerificationSession();
    setPendingVerificationEmail(null);

    return { accountJustCreated: false };
  };

  const signInWithGoogle = async ({ idToken, accessToken }: GoogleSignInInput) => {
    if (!idToken) {
      throw new Error('Google did not return an ID token.');
    }

    const idpResponse = await signInWithIdp({
      providerId: 'google.com',
      idToken,
      accessToken,
    });
    const account = await lookupAccount(idpResponse.idToken);
    const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const existingUser = storedUserData
      ? normalizeUser(JSON.parse(storedUserData) as Partial<User> & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>)
      : null;
    const nextUser = buildUserFromAccountData({
      account,
      existingUser,
      pendingSession: null,
      authProvider: 'google',
      overrideName: idpResponse.displayName ?? idpResponse.fullName,
      overridePhotoUrl: idpResponse.photoUrl,
    });

    await persistUser(nextUser, setUser);
    await clearPendingVerificationSession();
    setPendingVerificationEmail(null);

    return {
      accountJustCreated: idpResponse.isNewUser === true || idpResponse.isNewUser === 'true',
    };
  };

  const signInWithApple = async ({ idToken, fullName }: AppleSignInInput) => {
    if (!idToken) {
      throw new Error('Apple did not return an identity token.');
    }

    const idpResponse = await signInWithIdp({
      providerId: 'apple.com',
      idToken,
    });
    const account = await lookupAccount(idpResponse.idToken);
    const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const existingUser = storedUserData
      ? normalizeUser(JSON.parse(storedUserData) as Partial<User> & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>)
      : null;
    const overrideName =
      [fullName?.givenName, fullName?.familyName].filter(Boolean).join(' ').trim() ||
      idpResponse.fullName ||
      idpResponse.displayName;
    const nextUser = buildUserFromAccountData({
      account,
      existingUser,
      pendingSession: null,
      authProvider: 'apple',
      overrideName,
      overridePhotoUrl: idpResponse.photoUrl,
    });

    await persistUser(nextUser, setUser);
    await clearPendingVerificationSession();
    setPendingVerificationEmail(null);

    return {
      accountJustCreated: idpResponse.isNewUser === true || idpResponse.isNewUser === 'true',
    };
  };

  const signInAsDemo = async (mode: UserExperienceMode) => {
    const demoUser = normalizeUser({
      id: 'demo-traveler',
      email: 'demo@traveltrust.app',
      firstName: 'Alex',
      lastName: 'Morgan',
      city: 'Frankfurt',
      rating: 4.9,
      reviews: 24,
      experienceMode: mode,
      compliance: buildDefaultConsent(false),
      authProvider: 'password',
      emailVerified: true,
    });

    await persistUser(demoUser, setUser);
    await clearPendingVerificationSession();
    setPendingVerificationEmail(null);
  };

  const confirmEmailVerification = async () => {
    const pendingSession = await readPendingVerificationSession();

    if (!pendingSession) {
      throw new Error('No signup session was found. Please sign in again to finish verification.');
    }

    const refreshedTokens = await refreshIdToken(pendingSession.refreshToken);
    const refreshedSession: PendingVerificationSession = {
      ...pendingSession,
      ...refreshedTokens,
      email: pendingSession.email,
    };
    const account = await lookupAccount(refreshedSession.idToken);

    if (!account.emailVerified) {
      await persistPendingVerificationSession(refreshedSession);
      setPendingVerificationEmail(account.email ?? pendingSession.email ?? null);
      throw new Error('Your email is not verified yet. Open the link from your inbox and try again.');
    }

    const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const existingUser = storedUserData
      ? normalizeUser(JSON.parse(storedUserData) as Partial<User> & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>)
      : null;
    const nextUser = buildUserFromAccountData({
      account,
      existingUser,
      pendingSession: refreshedSession,
      authProvider: 'password',
    });

    await persistUser(nextUser, setUser);
    await clearPendingVerificationSession();
    setPendingVerificationEmail(null);

    return { accountJustCreated: true };
  };

  const resendEmailVerification = async () => {
    const pendingSession = await readPendingVerificationSession();

    if (!pendingSession) {
      throw new Error('No pending signup session was found. Please create the account again.');
    }

    const refreshedTokens = await refreshIdToken(pendingSession.refreshToken);
    await sendVerificationEmail(refreshedTokens.idToken);
    await persistPendingVerificationSession({
      ...pendingSession,
      ...refreshedTokens,
      email: pendingSession.email,
    });
    setPendingVerificationEmail(pendingSession.email ?? null);
  };

  const signOut = async () => {
    await clearPendingVerificationSession();
    await clearPersistedUser(setUser);
    setPendingVerificationEmail(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const updatedUser: User = normalizeUser({
      ...user,
      ...updates,
    });
    await persistUser(updatedUser, setUser);
  };

  const requestDataExport = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const timestamp = new Date().toISOString();
    await updateProfile({
      compliance: {
        ...user.compliance,
        dataExportRequestedAt: timestamp,
        lastUpdatedAt: timestamp,
      },
    });
  };

  const requestAccountDeletion = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const timestamp = new Date().toISOString();
    await updateProfile({
      compliance: {
        ...user.compliance,
        accountDeletionRequestedAt: timestamp,
        lastUpdatedAt: timestamp,
      },
    });
  };

  const setMarketingConsent = async (enabled: boolean) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const timestamp = new Date().toISOString();
    await updateProfile({
      compliance: {
        ...user.compliance,
        marketingEmails: enabled,
        lastUpdatedAt: timestamp,
      },
    });
  };

  const setExperienceMode = async (mode: UserExperienceMode) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    await updateProfile({
      experienceMode: mode,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: !!user,
        pendingVerificationEmail,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signInAsDemo,
        confirmEmailVerification,
        resendEmailVerification,
        signOut,
        updateProfile,
        requestDataExport,
        requestAccountDeletion,
        setMarketingConsent,
        experienceMode: user?.experienceMode ?? 'finder',
        setExperienceMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
