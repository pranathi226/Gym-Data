import React, { useRef, useEffect } from 'react';
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

const trainers = [
  { id: 1, name: 'Arjun Mehta', specialization: 'Weight Training', status: 'Active', rating: 4.8 },
  { id: 2, name: 'Priya Sharma', specialization: 'Yoga & Pilates', status: 'Active', rating: 4.9 },
  { id: 3, name: 'Rahul Verma', specialization: 'CrossFit', status: 'Inactive', rating: 4.5 },
  { id: 4, name: 'Sneha Patel', specialization: 'Cardio & HIIT', status: 'Active', rating: 4.7 },
];

const revenueData = [
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 75 },
  { month: 'Mar', value: 50 },
  { month: 'Apr', value: 90 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 100 },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const fabPulse = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      ]).start();
    }, 300);

    // FAB pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
        Animated.timing(fabPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const gymStats = [
    { id: 1, label: 'Total Trainers', value: '12', icon: 'people', color: '#FF6B6B', bgColor: '#FFF0F0' },
    { id: 2, label: 'Total Customers', value: '1,254', icon: 'person', color: '#4ECDC4', bgColor: '#EFFFFD' },
    { id: 3, label: 'Revenue', value: '₹2.4L', icon: 'trending-up', color: '#45B7D1', bgColor: '#EDF8FC' },
    { id: 4, label: 'New Signups', value: '28', icon: 'person-add', color: '#96CEB4', bgColor: '#F0FFF5' },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={{ opacity: headerFade }}>
        <LinearGradient colors={['#FF5252', '#E53935', '#C62828']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Evening 👋</Text>
              <Text style={styles.userName}>Welcome, Owner</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFF" />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/')}>
                <Ionicons name="log-out-outline" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>98%</Text>
              <Text style={styles.quickStatLabel}>Capacity</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>24</Text>
              <Text style={styles.quickStatLabel}>Pending</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>86</Text>
              <Text style={styles.quickStatLabel}>Active Today</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={{ flex: 1, opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {gymStats.map((stat) => (
              <TouchableOpacity key={stat.id} style={styles.statCard} activeOpacity={0.8}>
                <View style={[styles.statIconBg, { backgroundColor: stat.bgColor }]}>
                  <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Trainer Button */}
          <TouchableOpacity style={styles.addTrainerCard} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FF5252', '#E53935']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addTrainerGradient}
            >
              <View style={styles.addTrainerIcon}>
                <Ionicons name="add" size={24} color="#E53935" />
              </View>
              <View style={styles.addTrainerContent}>
                <Text style={styles.addTrainerTitle}>Add New Trainer</Text>
                <Text style={styles.addTrainerDesc}>Expand your team with top talent</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Revenue Chart */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Revenue</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartContainer}>
                {revenueData.map((item, i) => (
                  <View key={i} style={styles.chartBarWrapper}>
                    <View style={styles.chartBarBg}>
                      <LinearGradient
                        colors={['#FF5252', '#E53935']}
                        style={[
                          styles.chartBar,
                          { height: `${(item.value / maxRevenue) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{item.month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Trainer List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trainers</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {trainers.map((trainer) => (
              <TouchableOpacity key={trainer.id} style={styles.trainerCard} activeOpacity={0.8}>
                <View style={styles.trainerAvatar}>
                  <Text style={styles.trainerAvatarText}>{trainer.name.charAt(0)}</Text>
                </View>
                <View style={styles.trainerInfo}>
                  <Text style={styles.trainerName}>{trainer.name}</Text>
                  <Text style={styles.trainerSpec}>{trainer.specialization}</Text>
                </View>
                <View style={styles.trainerMeta}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFB800" />
                    <Text style={styles.ratingText}>{trainer.rating}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      trainer.status === 'Active' ? styles.statusActive : styles.statusInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: trainer.status === 'Active' ? '#4CAF50' : '#FF9800' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: trainer.status === 'Active' ? '#4CAF50' : '#FF9800' },
                      ]}
                    >
                      {trainer.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      {/* AI Assistant FAB */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabPulse }] }]}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push('/ai-assistant')}
        >
          <LinearGradient
            colors={['#FF5252', '#E53935']}
            style={styles.fabGradient}
          >
            <Ionicons name="sparkles" size={26} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color="#E53935" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Trainers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Analytics</Text>
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
    color: 'rgba(255,255,255,0.8)',
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
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD600',
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
    fontSize: 20,
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
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  addTrainerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  addTrainerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  addTrainerIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  addTrainerContent: {
    flex: 1,
  },
  addTrainerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  addTrainerDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarBg: {
    width: 28,
    height: '100%',
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#AAA',
    fontWeight: '600',
    marginTop: 8,
  },
  trainerCard: {
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
  trainerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  trainerAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E53935',
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  trainerSpec: {
    fontSize: 13,
    color: '#999',
  },
  trainerMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusActive: {
    backgroundColor: '#F0FFF4',
  },
  statusInactive: {
    backgroundColor: '#FFF8E1',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
