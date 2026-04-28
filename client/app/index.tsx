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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { login, UserRole, getGoogleOAuthUrl } from '@/services/api';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

function getOAuthRedirectUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:8081/oauth';
  }
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    '192.168.29.13:8081';
  return `exp://${hostUri}/--/oauth`;
}

const { width, height } = Dimensions.get('window');

const roleConfig: Record<UserRole, { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = {
  owner: { icon: 'business', label: 'Owner', color: '#E53935' },
  trainer: { icon: 'medal', label: 'Trainer', color: '#E53935' },
  customer: { icon: 'fitness', label: 'Customer', color: '#E53935' },
};

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params.role as UserRole) || 'customer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const badgeSlide = useRef(new Animated.Value(-20)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Role badge animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(badgeFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(badgeSlide, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]).start();
    }, 400);

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
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
        if (role === 'customer') router.push('/customer-dashboard');
        else if (role === 'owner') router.push('/owner-dashboard');
        else if (role === 'trainer') router.push('/trainer-dashboard');
        else Alert.alert('Welcome! 💪', result.message);
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Connection Error', 'Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = getOAuthRedirectUrl();
      const resp = await getGoogleOAuthUrl(role, redirectUrl);
      if (!resp.success || !resp.url) {
        Alert.alert('Google Sign-In Failed', resp.message || 'Unable to start Google OAuth.');
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(resp.url, redirectUrl);
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const status = url.searchParams.get('status');
        if (status === 'success') {
          if (role === 'customer') router.push('/customer-dashboard');
          else if (role === 'owner') router.push('/owner-dashboard');
          else if (role === 'trainer') router.push('/trainer-dashboard');
          else Alert.alert('Welcome! 💪', `Signed in with Google as ${role}`);
        } else {
          const message = url.searchParams.get('message') || 'Google sign-in failed.';
          Alert.alert('Google Sign-In Failed', decodeURIComponent(message));
        }
      } else {
        Alert.alert('Cancelled', 'Google sign-in was cancelled.');
      }
    } catch (e: any) {
      Alert.alert('Google Sign-In Error', e?.message || 'Unknown error');
    }
  };

  const handleBtnPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.96, tension: 100, friction: 8, useNativeDriver: true }).start();
  };
  const handleBtnPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const currentRole = roleConfig[role];

  return (
    <View style={styles.container}>
      {/* Background decorations */}
      <Animated.View style={[styles.circle1, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.circle2, { opacity: glowOpacity }]} />
      <View style={styles.circle3} />

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
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          {/* Logo / Branding */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoIcon}>
              <Ionicons name="barbell" size={40} color="#E53935" />
            </View>
            <Text style={styles.appName}>
              Fit<Text style={{ color: '#E53935' }}>Kart</Text>
            </Text>
          </Animated.View>

          {/* Role Badge */}
          <Animated.View
            style={[
              styles.roleBadge,
              { opacity: badgeFade, transform: [{ translateY: badgeSlide }] },
            ]}
          >
            <View style={styles.roleBadgeIcon}>
              <Ionicons name={currentRole.icon as any} size={16} color="#E53935" />
            </View>
            <Text style={styles.roleBadgeText}>Signing in as {currentRole.label}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.roleBadgeChange}>Change</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <Ionicons name="mail-outline" size={20} color={emailFocused ? '#E53935' : '#AAA'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#AAA"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? '#E53935' : '#AAA'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#AAA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#AAA" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              onPressIn={handleBtnPressIn}
              onPressOut={handleBtnPressOut}
              disabled={loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF5252', '#E53935', '#C62828']}
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="#E53935" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
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
    backgroundColor: '#FFFFFF',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#E53935',
    top: -100,
    right: -80,
    opacity: 0.06,
  },
  circle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E53935',
    bottom: -60,
    left: -60,
    opacity: 0.05,
  },
  circle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(229, 57, 53, 0.03)',
    top: '50%',
    right: -30,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 57, 53, 0.12)',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: 3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.12)',
    gap: 8,
  },
  roleBadgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  roleBadgeChange: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
  inputContainer: {
    gap: 14,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    paddingHorizontal: 16,
    height: 58,
  },
  inputWrapperFocused: {
    borderColor: '#E53935',
    backgroundColor: '#FFFAFA',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#1A1A2E',
    fontSize: 16,
    height: '100%',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    flexDirection: 'row',
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EEE',
    paddingVertical: 15,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '700',
  },
});
