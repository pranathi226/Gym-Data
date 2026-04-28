import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const todayWorkout = [
  { id: '1', name: 'Warm up (Cardio)', duration: '10 mins', icon: 'bicycle', done: true },
  { id: '2', name: 'Bench Press', duration: '4 sets × 12 reps', icon: 'barbell', done: true },
  { id: '3', name: 'Incline Dumbbell Press', duration: '3 sets × 10 reps', icon: 'barbell', done: false },
  { id: '4', name: 'Push-ups', duration: '3 sets × 15 reps', icon: 'body', done: false },
  { id: '5', name: 'Cool down (Stretch)', duration: '5 mins', icon: 'accessibility', done: false },
];

const todayDiet = [
  { id: '1', meal: 'Breakfast', food: 'Oatmeal with protein & berries', time: '8:00 AM', calories: 450, icon: '🥣' },
  { id: '2', meal: 'Lunch', food: 'Grilled chicken, quinoa & broccoli', time: '1:00 PM', calories: 600, icon: '🍗' },
  { id: '3', meal: 'Pre-Workout', food: 'Banana and black coffee', time: '4:30 PM', calories: 150, icon: '🍌' },
  { id: '4', meal: 'Dinner', food: 'Salmon, sweet potato & asparagus', time: '8:00 PM', calories: 550, icon: '🐟' },
];

const aiSuggestions = [
  { id: '1', text: 'Get a new workout plan', icon: 'barbell' },
  { id: '2', text: 'Optimize my diet', icon: 'nutrition' },
  { id: '3', text: 'Track my progress', icon: 'trending-up' },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const [workoutItems, setWorkoutItems] = useState(todayWorkout);

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      ]).start();
    }, 300);
  }, []);

  const completedCount = workoutItems.filter(w => w.done).length;
  const progressPercent = Math.round((completedCount / workoutItems.length) * 100);
  const totalCalories = todayDiet.reduce((sum, m) => sum + m.calories, 0);

  const toggleWorkoutItem = (id: string) => {
    setWorkoutItems(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={{ opacity: headerFade }}>
        <LinearGradient colors={['#FF5252', '#E53935', '#C62828']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Let's crush it today! 💪</Text>
              <Text style={styles.userName}>Welcome back</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/')}>
                <Ionicons name="log-out-outline" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>Chest Day</Text>
              <Text style={styles.quickStatLabel}>Today's Focus</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{totalCalories}</Text>
              <Text style={styles.quickStatLabel}>Daily kcal Goal</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={{ flex: 1, opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Ring Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressRingContainer}>
              <View style={styles.progressRingOuter}>
                <View style={styles.progressRingTrack} />
                <View style={styles.progressRingInner}>
                  <Text style={styles.progressValue}>{progressPercent}%</Text>
                  <Text style={styles.progressLabel}>Complete</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <View style={[styles.progressDot, { backgroundColor: '#E53935' }]} />
                <Text style={styles.progressStatText}>{completedCount} Done</Text>
              </View>
              <View style={styles.progressStatItem}>
                <View style={[styles.progressDot, { backgroundColor: '#DDD' }]} />
                <Text style={styles.progressStatText}>{workoutItems.length - completedCount} Remaining</Text>
              </View>
            </View>
          </View>

          {/* Workout Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Workout</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {workoutItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.workoutCard, item.done && styles.workoutCardDone]}
                activeOpacity={0.8}
                onPress={() => toggleWorkoutItem(item.id)}
              >
                <View style={[styles.workoutIconBg, item.done && styles.workoutIconBgDone]}>
                  <Ionicons name={item.icon as any} size={22} color={item.done ? '#FFF' : '#E53935'} />
                </View>
                <View style={styles.workoutContent}>
                  <Text style={[styles.workoutName, item.done && styles.workoutNameDone]}>{item.name}</Text>
                  <Text style={styles.workoutDuration}>{item.duration}</Text>
                </View>
                <View style={[styles.checkCircle, item.done && styles.checkCircleDone]}>
                  {item.done && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Diet Plan Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Diet Plan</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {todayDiet.map((item) => (
              <View key={item.id} style={styles.dietCard}>
                <View style={styles.dietEmoji}>
                  <Text style={styles.dietEmojiText}>{item.icon}</Text>
                </View>
                <View style={styles.dietContent}>
                  <View style={styles.dietHeaderRow}>
                    <Text style={styles.dietMeal}>{item.meal}</Text>
                    <Text style={styles.dietTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.dietFood}>{item.food}</Text>
                  <Text style={styles.dietCalories}>{item.calories} kcal</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Book a Trainer Card */}
          <TouchableOpacity style={styles.bookTrainerCard} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FF5252', '#E53935']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookTrainerGradient}
            >
              <View style={styles.bookTrainerLeft}>
                <View style={styles.bookTrainerIconBg}>
                  <Ionicons name="person" size={24} color="#E53935" />
                </View>
                <View>
                  <Text style={styles.bookTrainerTitle}>Book a Trainer</Text>
                  <Text style={styles.bookTrainerDesc}>Get personalized guidance</Text>
                </View>
              </View>
              <View style={styles.bookTrainerArrow}>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* AI Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            <View style={styles.aiChipsContainer}>
              {aiSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={styles.aiChip}
                  activeOpacity={0.8}
                  onPress={() => router.push('/ai-assistant')}
                >
                  <Ionicons name={suggestion.icon as any} size={16} color="#E53935" />
                  <Text style={styles.aiChipText}>{suggestion.text}</Text>
                  <Ionicons name="sparkles" size={14} color="#FFB800" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color="#E53935" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="barbell-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="nutrition-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Diet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    marginBottom: 4,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  quickStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  progressRingContainer: {
    marginRight: 24,
  },
  progressRingOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingTrack: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#F0F0F0',
  },
  progressRingInner: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E53935',
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  progressStats: {
    flex: 1,
    gap: 12,
  },
  progressStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '700',
    marginBottom: 14,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutCardDone: {
    backgroundColor: '#FAFAFA',
  },
  workoutIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  workoutIconBgDone: {
    backgroundColor: '#E53935',
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  workoutNameDone: {
    textDecorationLine: 'line-through',
    color: '#AAA',
  },
  workoutDuration: {
    fontSize: 13,
    color: '#999',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dietCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dietEmoji: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dietEmojiText: {
    fontSize: 22,
  },
  dietContent: {
    flex: 1,
  },
  dietHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dietMeal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  dietTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#AAA',
  },
  dietFood: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  dietCalories: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
  bookTrainerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  bookTrainerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  bookTrainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bookTrainerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTrainerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bookTrainerDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  bookTrainerArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiChipsContainer: {
    gap: 10,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFF0F0',
  },
  aiChipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#AAA',
  },
  navLabelActive: {
    color: '#E53935',
  },
});
