import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OwnerDashboard() {
  const router = useRouter();

  const gymStats = [
    { id: 1, label: 'Total Members', value: '1,254', icon: 'people-outline', color: '#4dabf7' },
    { id: 2, label: 'Active Today', value: '86', icon: 'flash-outline', color: '#ff922b' },
    { id: 3, label: 'Monthly Revenue', value: '$12.4k', icon: 'cash-outline', color: '#51cf66' },
    { id: 4, label: 'New Signups', value: '12', icon: 'person-add-outline', color: '#cc5de8' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Checked in', time: '5 mins ago', type: 'checkin' },
    { id: 2, user: 'Sarah Smith', action: 'New membership', time: '15 mins ago', type: 'signup' },
    { id: 3, user: 'Mike Ross', action: 'Payment received', time: '1 hour ago', type: 'payment' },
    { id: 4, user: 'Emma Wilson', action: 'Cancelled session', time: '2 hours ago', type: 'cancel' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#d32f2f', '#b71c1c']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Management Portal,</Text>
            <Text style={styles.userName}>Gym Owner</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/')}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>98%</Text>
            <Text style={styles.quickStatLabel}>Capacity</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>24</Text>
            <Text style={styles.quickStatLabel}>Pending Tasks</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Gym Overview</Text>
        <View style={styles.statsGrid}>
          {gymStats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statCardValue}>{stat.value}</Text>
              <Text style={styles.statCardLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View Log</Text>
            </TouchableOpacity>
          </View>

          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons 
                  name={
                    activity.type === 'checkin' ? 'enter-outline' :
                    activity.type === 'signup' ? 'person-add-outline' :
                    activity.type === 'payment' ? 'card-outline' : 'close-circle-outline'
                  } 
                  size={20} 
                  color="#666" 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Management Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle-outline" size={24} color="#d32f2f" />
              <Text style={styles.actionButtonText}>Add Member</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar-outline" size={24} color="#d32f2f" />
              <Text style={styles.actionButtonText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bar-chart-outline" size={24} color="#d32f2f" />
              <Text style={styles.actionButtonText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  },
  userName: {
    color: '#ffffff',
    fontSize: 26,
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
  quickStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  quickStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#868e96',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#495057',
  },
  activityUser: {
    fontWeight: '600',
    color: '#212529',
  },
  activityTime: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
    marginTop: 8,
  },
});
