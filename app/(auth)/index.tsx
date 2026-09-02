import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import SocialAuthButtons from '../../src/components/auth/SocialAuthButtons';
import { CenteredFormContent, FormAction, FormField, ResponsiveForm } from '../../src/components/forms/ResponsiveForm';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInAsDemo, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSigningIn(true);
    try {
      const result = await signIn(email, password);
      if (result.accountJustCreated) {
        Alert.alert('Account created', 'Your account has been created successfully.');
      }
      router.replace('/(app)/(rides)');
    } catch (error: any) {
      const message = error.message || 'Unable to sign in';

      if (message.includes('verify your email')) {
        Alert.alert('Verify your email', message, [
          {
            text: 'Open verification screen',
            onPress: () => router.push('/(auth)/verify-email'),
          },
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Login Failed', message);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoSignIn = async (mode: 'finder' | 'creator') => {
    setIsSigningIn(true);

    try {
      await signInAsDemo(mode);
      router.replace('/(app)/(rides)');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="car" size={60} color="#fff" />
            </View>
            <Text style={styles.appName}>TravelTrust</Text>
            <Text style={styles.tagline}>Safe rides, trusted community</Text>
          </View>

          <ResponsiveForm style={styles.formContainer}>
            <FormField label="Email Address" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSigningIn}
                placeholderTextColor="#999"
              />
              </View>
            </FormField>
            <FormField label="Password" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isSigningIn}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isSigningIn}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              </View>
            </FormField>
            <FormAction>
              <TouchableOpacity
              style={[styles.button, isSigningIn && styles.buttonDisabled]}
              onPress={handleEmailSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Sign In</Text>
                </>
              )}
              </TouchableOpacity>
            </FormAction>
            <FormAction style={styles.complianceAction}>
              <View style={styles.complianceNote}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#007AFF" />
              <Text style={styles.complianceText}>
                We only process data needed for onboarding, trust, safety, and support.
              </Text>
              </View>
            </FormAction>
          </ResponsiveForm>

          <CenteredFormContent>
            <View style={styles.socialSection}>
              <SocialAuthButtons disabled={isSigningIn} mode="continue" />
            </View>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Explore the interactive demo</Text>
              <Text style={styles.demoDescription}>Browse rides as a traveler or publish a ride as a driver. Demo changes stay in this browser.</Text>
              <View style={styles.demoActions}>
                <TouchableOpacity
                  style={[styles.demoButton, isSigningIn && styles.buttonDisabled]}
                  onPress={() => void handleDemoSignIn('finder')}
                  disabled={isSigningIn}
                >
                  <Ionicons name="search-outline" size={18} color="#007AFF" />
                  <Text style={styles.demoButtonText}>Try Finder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoButton, isSigningIn && styles.buttonDisabled]}
                  onPress={() => void handleDemoSignIn('creator')}
                  disabled={isSigningIn}
                >
                  <Ionicons name="car-outline" size={18} color="#007AFF" />
                  <Text style={styles.demoButtonText}>Try Creator</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CenteredFormContent>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isSigningIn}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing in, you continue under our{' '}
              <Text style={styles.termsLink} onPress={() => router.push('/legal/terms-of-service')}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.termsLink} onPress={() => router.push('/legal/privacy-notice')}>
                Privacy Notice
              </Text>
              . You can review your data rights any time in the Compliance Center.
            </Text>
          </View>
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
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  authField: {
    marginTop: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    marginHorizontal: 8,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  complianceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  complianceAction: {
    marginTop: 0,
  },
  complianceText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },
  socialSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  demoSection: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#DCE8FF',
    borderRadius: 12,
  },
  demoTitle: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '700',
  },
  demoDescription: {
    marginTop: 4,
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
  demoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  demoButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A9C8FF',
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  termsText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
