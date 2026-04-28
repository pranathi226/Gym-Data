import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(20)).current;
  const shimmerPos = useRef(new Animated.Value(-width)).current;
  const ring1Scale = useRef(new Animated.Value(0.5)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const ring3Scale = useRef(new Animated.Value(0.5)).current;
  const ring3Opacity = useRef(new Animated.Value(0)).current;
  const dotPulse1 = useRef(new Animated.Value(0.3)).current;
  const dotPulse2 = useRef(new Animated.Value(0.3)).current;
  const dotPulse3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Logo fade in
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Heartbeat pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ])
    ).start();

    // Ripple rings
    const createRipple = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 2.5, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(opacity, { toValue: 0.4, duration: 400, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );
    };

    createRipple(ring1Scale, ring1Opacity, 0).start();
    createRipple(ring2Scale, ring2Opacity, 700).start();
    createRipple(ring3Scale, ring3Opacity, 1400).start();

    // Shimmer
    Animated.loop(
      Animated.timing(shimmerPos, {
        toValue: width,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating dots pulse
    const dotAnimation = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        ])
      );
    dotAnimation(dotPulse1, 0).start();
    dotAnimation(dotPulse2, 300).start();
    dotAnimation(dotPulse3, 600).start();

    // Tagline fade in after delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(taglineSlide, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    // Navigate after splash
    const timer = setTimeout(() => {
      router.replace('/role-select');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient shimmer */}
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX: shimmerPos }] },
        ]}
      />

      {/* Floating decorative dots */}
      <Animated.View style={[styles.floatingDot, styles.dot1, { opacity: dotPulse1 }]} />
      <Animated.View style={[styles.floatingDot, styles.dot2, { opacity: dotPulse2 }]} />
      <Animated.View style={[styles.floatingDot, styles.dot3, { opacity: dotPulse3 }]} />
      <Animated.View style={[styles.floatingDot, styles.dot4, { opacity: dotPulse1 }]} />
      <Animated.View style={[styles.floatingDot, styles.dot5, { opacity: dotPulse3 }]} />

      {/* Red accent circles */}
      <View style={styles.accentCircle1} />
      <View style={styles.accentCircle2} />

      {/* Ripple rings */}
      <View style={styles.rippleContainer}>
        <Animated.View style={[styles.rippleRing, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />
        <Animated.View style={[styles.rippleRing, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
        <Animated.View style={[styles.rippleRing, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
      </View>

      {/* Logo */}
      <Animated.View style={[styles.logoWrapper, { opacity: logoFade, transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Ionicons name="barbell" size={48} color="#E53935" />
          </View>
        </View>
      </Animated.View>

      {/* Brand Name */}
      <Animated.View style={{ opacity: logoFade }}>
        <Text style={styles.brandName}>
          Fit<Text style={styles.brandAccent}>Kart</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineFade, transform: [{ translateY: taglineSlide }] }}>
        <Text style={styles.tagline}>Train Smart. Track Progress.</Text>
      </Animated.View>

      {/* Bottom loading bar */}
      <View style={styles.loadingBarContainer}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              transform: [{ translateX: shimmerPos }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.6,
    height: height,
    backgroundColor: 'rgba(229, 57, 53, 0.03)',
    transform: [{ skewX: '-20deg' }],
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#E53935',
  },
  dot1: { width: 8, height: 8, top: '15%', left: '10%', opacity: 0.2 },
  dot2: { width: 6, height: 6, top: '25%', right: '15%', opacity: 0.15 },
  dot3: { width: 10, height: 10, bottom: '30%', left: '20%', opacity: 0.1 },
  dot4: { width: 5, height: 5, bottom: '20%', right: '10%', opacity: 0.2 },
  dot5: { width: 7, height: 7, top: '60%', left: '80%', opacity: 0.12 },
  accentCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(229, 57, 53, 0.04)',
    top: -80,
    right: -100,
  },
  accentCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(229, 57, 53, 0.03)',
    bottom: -60,
    left: -60,
  },
  rippleContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E53935',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoOuter: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(229, 57, 53, 0.15)',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: 3,
    marginBottom: 8,
  },
  brandAccent: {
    color: '#E53935',
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    letterSpacing: 2,
    fontWeight: '400',
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: 60,
    width: 120,
    height: 3,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    width: 40,
    height: 3,
    backgroundColor: '#E53935',
    borderRadius: 2,
  },
});
