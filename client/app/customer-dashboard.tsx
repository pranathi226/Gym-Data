import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomerDashboard() {
  const router = useRouter();

  // Mock data for today's plan
  const todayWorkout = [
    { id: 1, name: 'Warm up (Cardio)', duration: '10 mins', icon: 'bicycle-outline' },
    { id: 2, name: 'Bench Press', duration: '4 sets x 12 reps', icon: 'barbell-outline' },
    { id: 3, name: 'Incline Dumbbell Press', duration: '3 sets x 10 reps', icon: 'barbell-outline' },
    { id: 4, name: 'Push-ups', duration: '3 sets x 15 reps', icon: 'body-outline' },
    { id: 5, name: 'Cool down (Stretching)', duration: '5 mins', icon: 'accessibility-outline' },
  ];

  const todayDiet = [
    { id: 1, meal: 'Breakfast', food: 'Oatmeal with protein powder & berries', time: '8:00 AM', calories: '450 kcal' },
    { id: 2, meal: 'Lunch', food: 'Grilled chicken breast with quinoa and broccoli', time: '1:00 PM', calories: '600 kcal' },
    { id: 3, meal: 'Pre-workout', food: 'Banana and black coffee', time: '4:30 PM', calories: '150 kcal' },
    { id: 4, meal: 'Dinner', food: 'Salmon with sweet potato and asparagus', time: '8:00 PM', calories: '550 kcal' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#ff4b4b', '#d32f2f']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Customer</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/')}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Chest Day</Text>
            <Text style={styles.statLabel}>Today's Focus</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1,750</Text>
            <Text style={styles.statLabel}>Daily kcal Goal</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Workout</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {todayWorkout.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#d32f2f" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.duration}</Text>
              </View>
              <TouchableOpacity style={styles.checkBtn}>
                <Ionicons name="checkmark-circle-outline" size={28} color="#e0e0e0" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Diet Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Diet Plan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {todayDiet.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#fff5f5' }]}>
                <Ionicons name="restaurant-outline" size={24} color="#d32f2f" />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.dietHeaderRow}>
                  <Text style={styles.cardTitle}>{item.meal}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{item.food}</Text>
                <Text style={styles.caloriesText}>{item.calories}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  seeAll: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  checkBtn: {
    padding: 4,
  },
  dietHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
  },
  caloriesText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 6,
  },
});