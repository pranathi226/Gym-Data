import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getBaseUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:5001';
  }
  return 'http://192.168.29.13:5001';
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

export async function getGoogleOAuthUrl(role: UserRole, redirectUrl: string): Promise<{ success: boolean; url?: string; message?: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/oauth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, redirectUrl }),
  });
  const data = await res.json();
  return data;
}

export async function verifyOAuthToken(accessToken: string, role: UserRole): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/oauth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, role }),
  });
  const data: AuthResponse = await res.json();
  return data;
}
