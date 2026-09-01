import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../../context/AuthContext';
import { getGoogleAuthConfig, hasGoogleAuthConfig } from '../../services/firebase';

WebBrowser.maybeCompleteAuthSession();

type SocialAuthButtonsProps = {
  disabled?: boolean;
  mode?: 'continue' | 'signup';
};

const createNonce = async () => {
  const randomBytes = await Crypto.getRandomBytesAsync(16);

  return Array.from(randomBytes, (value) => value.toString(16).padStart(2, '0')).join('');
};

export default function SocialAuthButtons({
  disabled = false,
  mode = 'continue',
}: SocialAuthButtonsProps) {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [activeProvider, setActiveProvider] = useState<'google' | 'apple' | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const googleConfig = useMemo(() => getGoogleAuthConfig(), []);
  const authScheme = Array.isArray(Constants.expoConfig?.scheme)
    ? Constants.expoConfig?.scheme[0]
    : Constants.expoConfig?.scheme;
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest(
    {
      ...googleConfig,
      scopes: ['profile', 'email'],
    },
    {
      scheme: authScheme ?? 'travelrust',
      path: 'oauth',
    }
  );

  useEffect(() => {
    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    let active = true;

    void AppleAuthentication.isAvailableAsync().then((available) => {
      if (active) {
        setAppleAvailable(available);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!googleResponse || googleResponse.type !== 'success') {
      return;
    }

    const idToken = googleResponse.params.id_token;

    if (!idToken) {
      setActiveProvider(null);
      Alert.alert('Google sign in failed', 'Google did not return a usable identity token.');
      return;
    }

    void (async () => {
      try {
        const result = await signInWithGoogle({
          idToken,
          accessToken: googleResponse.authentication?.accessToken ?? null,
        });

        Alert.alert(
          result.accountJustCreated ? 'Account created' : 'Signed in',
          result.accountJustCreated
            ? 'Your account has been created successfully.'
            : 'You are now signed in with Google.'
        );
        router.replace('/(app)/(rides)');
      } catch (error: any) {
        Alert.alert('Google sign in failed', error.message || 'Unable to continue with Google.');
      } finally {
        setActiveProvider(null);
      }
    })();
  }, [googleResponse, router, signInWithGoogle]);

  const handleGooglePress = async () => {
    if (Platform.OS !== 'web' && Constants.appOwnership === 'expo') {
      Alert.alert(
        'Development build required',
        'Google sign-in needs a development build or production build because Expo Go cannot complete the OAuth redirect.'
      );
      return;
    }

    if (!hasGoogleAuthConfig()) {
      Alert.alert(
        'Google auth not configured',
        'Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and the native Google client IDs before testing Google sign-in.'
      );
      return;
    }

    if (!googleRequest) {
      Alert.alert('Google sign in unavailable', 'The Google auth request is still loading. Please try again.');
      return;
    }

    setActiveProvider('google');
    const result = await promptGoogleAsync();

    if (result.type !== 'success') {
      setActiveProvider(null);
    }
  };

  const handleApplePress = async () => {
    setActiveProvider('apple');

    try {
      const rawNonce = await createNonce();
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const result = await signInWithApple({
        idToken: credential.identityToken ?? '',
        rawNonce,
        fullName: {
          givenName: credential.fullName?.givenName,
          familyName: credential.fullName?.familyName,
        },
      });

      Alert.alert(
        result.accountJustCreated ? 'Account created' : 'Signed in',
        result.accountJustCreated
          ? 'Your account has been created successfully.'
          : 'You are now signed in with Apple.'
      );
      router.replace('/(app)/(rides)');
    } catch (error: any) {
      if (error?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple sign in failed', error.message || 'Unable to continue with Apple.');
      }
    } finally {
      setActiveProvider(null);
    }
  };

  const isBusy = disabled || activeProvider !== null;

  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{mode === 'signup' ? 'or sign up with' : 'or continue with'}</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, isBusy && styles.socialButtonDisabled]}
          onPress={() => void handleGooglePress()}
          disabled={isBusy}
        >
          {activeProvider === 'google' ? (
            <ActivityIndicator color="#EA4335" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.socialButtonText}>Google</Text>
            </>
          )}
        </TouchableOpacity>

        {appleAvailable ? (
          <TouchableOpacity
            style={[styles.socialButton, isBusy && styles.socialButtonDisabled]}
            onPress={() => void handleApplePress()}
            disabled={isBusy}
          >
            {activeProvider === 'apple' ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={20} color="#111827" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
});
