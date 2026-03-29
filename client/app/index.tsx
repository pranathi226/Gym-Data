import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { login, UserRole, getGoogleOAuthUrl } from '@/services/api';
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: false,
      }),
    ]).start();

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password, role);
      if (result.success) {
        if (role === 'customer') {
          router.push('/customer-dashboard');
        } else if (role === 'owner') {
          router.push('/owner-dashboard');
        } else {
          Alert.alert('Welcome! 💪', result.message);
        }
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Connection Error', 'Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleGoogleLogin = async () => {
    try {
      const resp = await getGoogleOAuthUrl(role);
      if (!resp.success || !resp.url) {
        Alert.alert('Google Sign-In Failed', resp.message || 'Unable to start Google OAuth.');
        return;
      }
      const redirectUrl = 'client://oauth';
      const result = await WebBrowser.openAuthSessionAsync(resp.url, redirectUrl);
      if (result.type === 'success') {
        if (role === 'customer') {
          router.push('/customer-dashboard');
        } else if (role === 'owner') {
          router.push('/owner-dashboard');
        } else {
          Alert.alert('Welcome! 💪', `Signed in with Google as ${role}`);
        }
      } else {
        Alert.alert('Cancelled', 'Google sign-in was cancelled.');
      }
    } catch (e: any) {
      Alert.alert('Google Sign-In Error', e?.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background decorations */}
      <Animated.View style={[styles.circle1, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.circle2, { opacity: glowOpacity }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo / Branding */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoIcon}>
              <Ionicons name="barbell-outline" size={42} color="#d32f2f" />
            </View>
            <Text style={styles.appName}>Fitkart</Text>
            <Text style={styles.tagline}>Train Smart. Track Progress.</Text>
          </Animated.View>

          {/* Role Toggle */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a</Text>
            <View style={styles.roleToggle}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'owner' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('owner')}
                activeOpacity={0.7}
              >
                <Ionicons name="business-outline" size={18} color={role === 'owner' ? '#d32f2f' : '#888'} />
                <Text
                  style={[
                    styles.roleText,
                    role === 'owner' && styles.roleTextActive,
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'trainer' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('trainer')}
                activeOpacity={0.7}
              >
                <Ionicons name="medal-outline" size={18} color={role === 'trainer' ? '#d32f2f' : '#888'} />
                <Text
                  style={[
                    styles.roleText,
                    role === 'trainer' && styles.roleTextActive,
                  ]}
                >
                  Trainer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'customer' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('customer')}
                activeOpacity={0.7}
              >
                <Ionicons name="fitness-outline" size={18} color={role === 'customer' ? '#d32f2f' : '#888'} />
                <Text
                  style={[
                    styles.roleText,
                    role === 'customer' && styles.roleTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#d32f2f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#d32f2f" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff4b4b', '#d32f2f']}
              style={styles.loginGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>
                  Sign In as {role === 'owner' ? 'Owner' : role === 'trainer' ? 'Trainer' : 'Customer'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ alignItems: 'center', marginTop: 14, marginBottom: 8 }}>
            <Text style={{ color: '#888' }}>OR</Text>
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0' },
            ]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <View style={{ paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
              <Ionicons name="logo-google" size={20} color="#d32f2f" />
              <Text style={{ color: '#d32f2f', fontSize: 16, fontWeight: '700' }}>Sign in with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  circle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#ff4b4b',
    top: -120,
    right: -100,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#d32f2f',
    bottom: -80,
    left: -80,
    opacity: 0.1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffd6d6',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
    letterSpacing: 1,
  },
  roleContainer: {
    marginBottom: 28,
  },
  roleLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  roleToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#fff5f5',
    borderColor: '#d32f2f',
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  roleTextActive: {
    color: '#d32f2f',
  },
  inputContainer: {
    gap: 14,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#333333',
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  footerLink: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },
});
