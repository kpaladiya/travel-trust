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
import { FormAction, FormField, ResponsiveForm } from '../../src/components/forms/ResponsiveForm';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCommunityRules, setAcceptedCommunityRules] = useState(false);
  const [confirmedAdult, setConfirmedAdult] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const validateForm = () => {
    if (!firstName || !lastName || !email || !phone || !password || !city) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptedTerms || !acceptedPrivacy || !acceptedCommunityRules || !confirmedAdult) {
      Alert.alert(
        'Consent required',
        'Please accept the Terms, Privacy Notice, Community Rules, and confirm you are at least 18 years old.'
      );
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSigningUp(true);
    try {
      const timestamp = new Date().toISOString();
      await signUp(email, password, `${firstName} ${lastName}`, phone, city, {
        termsAcceptedAt: timestamp,
        privacyAcceptedAt: timestamp,
        communityRulesAcceptedAt: timestamp,
        ageConfirmedAt: timestamp,
        marketingEmails,
      });
      Alert.alert(
        'Verify your email',
        'We sent a verification link to your email address. Open it first, then come back and confirm to finish creating the account.'
      );
      router.replace('/(auth)/verify-email');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Unable to create account');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ResponsiveForm style={styles.formContainer}>
            <FormField label="First Name" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              </View>
            </FormField>
            <FormField label="Last Name" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="Sharma"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              </View>
            </FormField>
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
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              </View>
            </FormField>
            <FormField label="Phone Number" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="+49 171 234 5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              </View>
            </FormField>
            <FormField label="City" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="Frankfurt"
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
                editable={!isSigningUp}
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
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isSigningUp}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              </View>
            </FormField>
            <FormField label="Confirm Password" labelStyle={styles.label} style={styles.authField}>
              <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isSigningUp}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSigningUp}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              </View>
            </FormField>

            <View style={styles.noticeCard}>
              <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
              <Text style={styles.noticeText}>
                Replace the placeholder legal contacts and legal entity details before submitting the app to EU or Germany stores.
              </Text>
            </View>

            <ConsentRow
              checked={acceptedTerms}
              onToggle={() => setAcceptedTerms(!acceptedTerms)}
              disabled={isSigningUp}
            >
              I accept the{' '}
              <Text style={styles.link} onPress={() => router.push('/legal/terms-of-service')}>
                Terms of Service
              </Text>
              .
            </ConsentRow>

            <ConsentRow
              checked={acceptedPrivacy}
              onToggle={() => setAcceptedPrivacy(!acceptedPrivacy)}
              disabled={isSigningUp}
            >
              I acknowledge the{' '}
              <Text style={styles.link} onPress={() => router.push('/legal/privacy-notice')}>
                Privacy Notice
              </Text>
              .
            </ConsentRow>

            <ConsentRow
              checked={acceptedCommunityRules}
              onToggle={() => setAcceptedCommunityRules(!acceptedCommunityRules)}
              disabled={isSigningUp}
            >
              I agree to the{' '}
              <Text style={styles.link} onPress={() => router.push('/legal/community-rules')}>
                Community Rules
              </Text>
              .
            </ConsentRow>

            <ConsentRow
              checked={confirmedAdult}
              onToggle={() => setConfirmedAdult(!confirmedAdult)}
              disabled={isSigningUp}
            >
              I confirm that I am at least 18 years old and can enter into these terms.
            </ConsentRow>

            <ConsentRow
              checked={marketingEmails}
              onToggle={() => setMarketingEmails(!marketingEmails)}
              disabled={isSigningUp}
            >
              I want optional product updates by email. I understand this consent can be changed later.
            </ConsentRow>

            <FormAction>
              <TouchableOpacity
              style={[styles.button, isSigningUp && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Create Account</Text>
                </>
              )}
              </TouchableOpacity>
            </FormAction>

            <SocialAuthButtons disabled={isSigningUp} mode="signup" />

            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()} disabled={isSigningUp}>
                <Text style={styles.signinLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
            </ResponsiveForm>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function ConsentRow({
  checked,
  onToggle,
  disabled,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity style={[styles.checkbox, checked && styles.checkboxChecked]} onPress={onToggle} disabled={disabled}>
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>{children}</Text>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 24,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
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
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signinText: {
    color: '#666',
    fontSize: 14,
  },
  signinLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
