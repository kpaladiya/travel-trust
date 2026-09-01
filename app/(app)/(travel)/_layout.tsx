import { Stack } from 'expo-router';

export default function TravelLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="post" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="offer" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
