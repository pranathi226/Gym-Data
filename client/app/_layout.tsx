import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Auto-redirect to splash on first load
    if (!hasNavigated && segments.length > 0 && segments[0] !== 'splash') {
      setHasNavigated(true);
      router.replace('/splash');
    }
  }, [segments]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="splash" options={{ animation: 'fade' }} />
        <Stack.Screen name="role-select" options={{ animation: 'fade' }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="owner-dashboard" />
        <Stack.Screen name="trainer-dashboard" />
        <Stack.Screen name="customer-dashboard" />
        <Stack.Screen name="ai-assistant" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="oauth" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
