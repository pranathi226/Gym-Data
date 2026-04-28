import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const assignedClients = [
  { id: '1', name: 'Ravi Kumar', plan: 'Weight Loss', progress: 72, avatar: 'R' },
  { id: '2', name: 'Ananya Iyer', plan: 'Muscle Gain', progress: 85, avatar: 'A' },
  { id: '3', name: 'Deepak Roy', plan: 'Endurance', progress: 45, avatar: 'D' },
  { id: '4', name: 'Meera Shah', plan: 'Flexibility', progress: 60, avatar: 'M' },
  { id: '5', name: 'Kiran Joshi', plan: 'CrossFit', progress: 90, avatar: 'K' },
];

const dailyPlan = [
  { id: '1', time: '6:00 AM', client: 'Ravi Kumar', workout: 'Cardio + Abs', duration: '45 min', icon: 'bicycle' },
  { id: '2', time: '7:30 AM', client: 'Ananya Iyer', workout: 'Upper Body Strength', duration: '60 min', icon: 'barbell' },
  { id: '3', time: '10:00 AM', client: 'Deepak Roy', workout: 'HIIT Training', duration: '40 min', icon: 'flash' },
  { id: '4', time: '4:00 PM', client: 'Meera Shah', workout: 'Yoga & Stretch', duration: '50 min', icon: 'body' },
  { id: '5', time: '6:00 PM', client: 'Kiran Joshi', workout: 'CrossFit WOD', duration: '55 min', icon: 'fitness' },
];

const notifications = [
  { id: '1', text: 'New client Priya Gupta assigned to you', time: '10 min ago', type: 'client', read: false },
  { id: '2', text: 'Payment of ₹5,000 received from Ravi', time: '1 hour ago', type: 'payment', read: false },
  { id: '3', text: 'Ananya completed her weekly goal! 🎉', time: '3 hours ago', type: 'achievement', read: true },
  { id: '4', text: 'Schedule updated for tomorrow', time: 'Yesterday', type: 'schedule', read: true },
];

export default function TrainerDashboard() {
  const router = useRouter();
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
  }, []);

  const getNotifIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'client': return 'person-add';
      case 'payment': return 'card';
      case 'achievement': return 'trophy';
      case 'schedule': return 'calendar';
      default: return 'notifications';
    }
  };

  const getNotifColor = (type: string): string => {
    switch (type) {
      case 'client': return '#4ECDC4';
      case 'payment': return '#45B7D1';
      case 'achievement': return '#FFB800';
      case 'schedule': return '#96CEB4';
      default: return '#999';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={{ opacity: headerFade }}>
        <LinearGradient colors={['#FF5252', '#E53935', '#C62828']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning 🏋️</Text>
              <Text style={styles.userName}>Welcome, Trainer</Text>
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

          {/* Quick Stats */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{assignedClients.length}</Text>
              <Text style={styles.quickStatLabel}>Clients</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{dailyPlan.length}</Text>
              <Text style={styles.quickStatLabel}>Sessions Today</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>4.8</Text>
              <Text style={styles.quickStatLabel}>Rating</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={{ flex: 1, opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Assigned Clients - Horizontal Scroll */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Clients</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientsScroll}>
              {assignedClients.map((client) => (
                <TouchableOpacity key={client.id} style={styles.clientCard} activeOpacity={0.8}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>{client.avatar}</Text>
                  </View>
                  <Text style={styles.clientName}>{client.name.split(' ')[0]}</Text>
                  <Text style={styles.clientPlan}>{client.plan}</Text>
                  {/* Progress bar */}
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${client.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{client.progress}%</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Daily Workout Plans */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Full Week</Text>
              </TouchableOpacity>
            </View>

            {dailyPlan.map((session, index) => (
              <TouchableOpacity key={session.id} style={styles.scheduleCard} activeOpacity={0.8}>
                <View style={styles.timelineContainer}>
                  <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
                  {index < dailyPlan.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.scheduleContent}>
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleTime}>{session.time}</Text>
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={12} color="#E53935" />
                      <Text style={styles.durationText}>{session.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.scheduleBody}>
                    <View style={styles.scheduleIconBg}>
                      <Ionicons name={session.icon as any} size={20} color="#E53935" />
                    </View>
                    <View style={styles.scheduleInfo}>
                      <Text style={styles.scheduleWorkout}>{session.workout}</Text>
                      <Text style={styles.scheduleClient}>with {session.client}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Mark all read</Text>
              </TouchableOpacity>
            </View>

            {notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                activeOpacity={0.8}
              >
                <View style={[styles.notifIconBg, { backgroundColor: getNotifColor(notif.type) + '15' }]}>
                  <Ionicons name={getNotifIcon(notif.type) as any} size={18} color={getNotifColor(notif.type)} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifText, !notif.read && styles.notifTextUnread]}>{notif.text}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                {!notif.read && <View style={styles.unreadIndicator} />}
              </TouchableOpacity>
            ))}
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
          <Ionicons name="people-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={22} color="#AAA" />
          <Text style={styles.navLabel}>Schedule</Text>
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
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  clientsScroll: {
    paddingLeft: 20,
  },
  clientCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E53935',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  clientPlan: {
    fontSize: 11,
    color: '#999',
    marginBottom: 10,
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E53935',
    marginTop: 4,
  },
  scheduleCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 30,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD6D6',
    borderWidth: 3,
    borderColor: '#FFF0F0',
  },
  timelineDotActive: {
    backgroundColor: '#E53935',
    borderColor: '#FFD6D6',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  scheduleContent: {
    flex: 1,
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
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E53935',
  },
  scheduleBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleWorkout: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  scheduleClient: {
    fontSize: 13,
    color: '#999',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: '#FFFAFA',
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  notifIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notifTextUnread: {
    fontWeight: '600',
    color: '#1A1A2E',
  },
  notifTime: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 2,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
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
