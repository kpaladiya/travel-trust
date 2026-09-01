import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="admin-console" />
      <Stack.Screen name="compliance-center" />
      <Stack.Screen name="trust-dashboard" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="help-support" />
    </Stack>
  );
}
