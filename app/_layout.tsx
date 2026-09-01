import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { initializeFirebase } from '../src/services/firebase';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import './global.css';

void SplashScreen.preventAutoHideAsync();

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

function RootNavigator() {
  const { isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen name="legal" options={{ presentation: 'modal' }} />
      {isSignedIn ? (
        <Stack.Screen name="(app)" options={{ animation: 'none' }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      )}
    </Stack>
  );
}

export default function Root() {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
