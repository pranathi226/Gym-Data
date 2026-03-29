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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signup, UserRole } from '@/services/api';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name.trim(), email.trim(), password, role);
      if (result.success) {
        // Since "Confirm email" is ON in Supabase, we shouldn't redirect to the dashboard yet.
        // The user must verify their email first before they can log in.
        Alert.alert('Verification Required 📧', result.message, [
          { text: 'Go to Login', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('Sign Up Failed', result.message);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      Alert.alert('Connection Error', `Unable to connect to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background decorations */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

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
                  <Ionicons name="business-outline" size={16} color={role === 'owner' ? '#d32f2f' : '#888'} />
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
                    role === 'customer' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('customer')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="fitness-outline" size={16} color={role === 'customer' ? '#d32f2f' : '#888'} />
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
              {/* Name Input */}
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#d32f2f" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Confirm Password Input */}
              <View style={styles.inputWrapper}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#d32f2f" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ff4b4b', '#d32f2f']}
                style={styles.signupGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.signupButtonText}>
                    Sign Up as {role === 'owner' ? 'Owner' : role === 'trainer' ? 'Trainer' : 'Customer'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  content: {
    paddingHorizontal: 28,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  roleContainer: {
    marginBottom: 24,
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
    gap: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  roleButtonActive: {
    backgroundColor: '#fff5f5',
    borderColor: '#d32f2f',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  roleTextActive: {
    color: '#d32f2f',
  },
  inputContainer: {
    gap: 16,
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
    height: 58,
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
    padding: 8,
  },
  signupButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666666',
    fontSize: 15,
  },
  footerLink: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '700',
  },
});
