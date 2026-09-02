import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { FormAction, ResponsiveForm } from '../../src/components/forms/ResponsiveForm';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { pendingVerificationEmail, confirmEmailVerification, resendEmailVerification, signOut } = useAuth();
  const [isChecking, setIsChecking] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);

  const handleCheckVerification = async () => {
    setIsChecking(true);

    try {
      const result = await confirmEmailVerification();
      Alert.alert(
        result.accountJustCreated ? 'Account created' : 'Email verified',
        result.accountJustCreated
          ? 'Your account has been created successfully.'
          : 'Your email has been verified successfully.'
      );
      router.replace('/(app)/(rides)');
    } catch (error: any) {
      Alert.alert('Verification incomplete', error.message || 'Your email is not verified yet.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      await resendEmailVerification();
      Alert.alert('Link sent', 'A new verification email has been sent.');
    } catch (error: any) {
      Alert.alert('Unable to resend', error.message || 'Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleUseDifferentEmail = async () => {
    setIsSwitching(true);

    try {
      await signOut();
      router.replace('/(auth)');
    } catch (error: any) {
      Alert.alert('Unable to switch email', error.message || 'Please try again.');
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ResponsiveForm style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="mail-open-outline" size={40} color="#007AFF" />
        </View>

        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.description}>
          We sent a verification link to <Text style={styles.email}>{pendingVerificationEmail ?? 'your email address'}</Text>.
          Open the email, finish verification, then return here.
        </Text>

        <FormAction centered style={styles.primaryAction}>
          <TouchableOpacity
          style={[styles.primaryButton, isChecking && styles.buttonDisabled]}
          onPress={() => void handleCheckVerification()}
          disabled={isChecking || isResending || isSwitching}
        >
          {isChecking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>I&apos;ve verified my email</Text>
            </>
          )}
          </TouchableOpacity>
        </FormAction>

        <FormAction centered style={styles.secondaryAction}>
          <TouchableOpacity
          style={[styles.secondaryButton, isResending && styles.buttonDisabled]}
          onPress={() => void handleResend()}
          disabled={isChecking || isResending || isSwitching}
        >
          {isResending ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={18} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Resend verification link</Text>
            </>
          )}
          </TouchableOpacity>
        </FormAction>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => void handleUseDifferentEmail()}
          disabled={isChecking || isResending || isSwitching}
        >
          {isSwitching ? (
            <ActivityIndicator color="#6B7280" />
          ) : (
            <Text style={styles.tertiaryButtonText}>Use a different email address</Text>
          )}
        </TouchableOpacity>
      </ResponsiveForm>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'center',
  },
  email: {
    fontWeight: '700',
    color: '#111827',
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryAction: {
    marginTop: 28,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '700',
  },
  tertiaryButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
