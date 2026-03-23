import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getBaseUrl(): string {
  // On web, localhost works fine
  if (Platform.OS === 'web') {
    return 'http://localhost:5001';
  }

  // On mobile (iOS/Android), get the dev machine's IP from Expo
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5001`;
  }

  // Fallback
  return 'http://localhost:5001';
}

const BASE_URL = getBaseUrl();

export type UserRole = 'owner' | 'trainer' | 'customer';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export async function login(
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  const data: AuthResponse = await res.json();
  return data;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data: AuthResponse = await res.json();
  return data;
}
