import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator, Alert, Text, Platform } from 'react-native';

const BASE_URL = Platform.OS === 'web' ? 'http://localhost:5001' : 'http://192.168.29.13:5001';

export default function OAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;

    async function handleOAuth() {
      try {
        // The hash fragment comes as params["#"] from Supabase implicit flow
        const hashString = params['#'] as string;

        if (!hashString) {
          // Check if status came as a query param (server callback redirect)
          if (params.status === 'success') {
            navigateToDashboard(params.role as string);
            return;
          }
          Alert.alert('Error', 'No OAuth data received.');
          router.replace('/');
          return;
        }

        // Parse access_token from the hash fragment
        const hashParams = new URLSearchParams(hashString);
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          Alert.alert('Error', 'No access token found in OAuth response.');
          router.replace('/');
          return;
        }

        // Determine role from the hash or default
        // The role might be in user_metadata or we default to customer
        const role = 'customer'; // Default since role is set on login screen

        // Verify the token with the server and create user record
        const res = await fetch(`${BASE_URL}/api/auth/oauth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, role }),
        });
        const data = await res.json();

        if (data.success) {
          navigateToDashboard(data.user?.role || role);
        } else {
          Alert.alert('Google Sign-In Failed', data.message || 'Verification failed.');
          router.replace('/');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        Alert.alert('Error', error?.message || 'Something went wrong.');
        router.replace('/');
      }
    }

    handleOAuth();
  }, [ready]);

  function navigateToDashboard(role: string) {
    if (role === 'customer') {
      router.replace('/customer-dashboard');
    } else if (role === 'owner') {
      router.replace('/owner-dashboard');
    } else {
      Alert.alert('Welcome! 💪', `Signed in with Google as ${role}`);
      router.replace('/');
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#d32f2f" />
      <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>Signing in with Google...</Text>
    </View>
  );
}
