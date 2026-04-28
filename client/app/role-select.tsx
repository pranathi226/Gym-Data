import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type Role = 'owner' | 'trainer' | 'customer';

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  emoji: string;
}

const roles: RoleOption[] = [
  {
    id: 'owner',
    title: 'Owner',
    description: 'Manage your gym empire',
    icon: 'business',
    emoji: '🏢',
  },
  {
    id: 'trainer',
    title: 'Trainer',
    description: 'Guide your clients to greatness',
    icon: 'medal',
    emoji: '🏅',
  },
  {
    id: 'customer',
    title: 'Customer',
    description: 'Transform your body & mind',
    icon: 'fitness',
    emoji: '💪',
  },
];

function RoleCard({
  role,
  isSelected,
  onSelect,
  index,
}: {
  role: RoleOption;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.roleCard,
          isSelected && styles.roleCardSelected,
        ]}
      >
        {/* Glass overlay */}
        {isSelected && <View style={styles.selectedGlow} />}

        <View style={styles.cardContent}>
          <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
            <Ionicons
              name={role.icon as any}
              size={28}
              color={isSelected ? '#FFFFFF' : '#E53935'}
            />
          </View>

          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
              {role.title}
            </Text>
            <Text style={[styles.cardDescription, isSelected && styles.cardDescriptionSelected]}>
              {role.description}
            </Text>
          </View>

          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const btnFade = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  React.useEffect(() => {
    if (selectedRole) {
      Animated.parallel([
        Animated.timing(btnFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(btnSlide, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedRole]);

  const handleContinue = () => {
    if (selectedRole) {
      router.push({ pathname: '/', params: { role: selectedRole } });
    }
  };

  return (
    <View style={styles.container}>
      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <View style={styles.logoRow}>
          <View style={styles.miniLogo}>
            <Ionicons name="barbell" size={20} color="#E53935" />
          </View>
          <Text style={styles.logoText}>
            Fit<Text style={{ color: '#E53935' }}>Kart</Text>
          </Text>
        </View>
        <Text style={styles.headerTitle}>Who are you?</Text>
        <Text style={styles.headerSubtitle}>
          Select your role to personalize your experience
        </Text>
      </Animated.View>

      {/* Role Cards */}
      <View style={styles.cardsContainer}>
        {roles.map((role, index) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            onSelect={() => setSelectedRole(role.id)}
            index={index}
          />
        ))}
      </View>

      {/* Continue Button */}
      <Animated.View
        style={[
          styles.continueContainer,
          { opacity: btnFade, transform: [{ translateY: btnSlide }] },
        ]}
      >
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          style={styles.continueButton}
        >
          <LinearGradient
            colors={['#FF5252', '#E53935', '#C62828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  bgCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(229, 57, 53, 0.04)',
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(229, 57, 53, 0.03)',
    bottom: 100,
    left: -60,
  },
  bgCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
    top: '40%',
    right: -30,
  },
  header: {
    marginBottom: 36,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  miniLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.15)',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
    flex: 1,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  roleCardSelected: {
    borderColor: '#E53935',
    backgroundColor: '#FFFAFA',
    shadowColor: '#E53935',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(229, 57, 53, 0.03)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconCircleSelected: {
    backgroundColor: '#E53935',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  cardTitleSelected: {
    color: '#E53935',
  },
  cardDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  cardDescriptionSelected: {
    color: '#666',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#E53935',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E53935',
  },
  continueContainer: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
