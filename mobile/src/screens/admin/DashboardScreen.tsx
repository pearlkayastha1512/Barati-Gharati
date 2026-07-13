import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useAdminStore } from '../../store/adminStore';

const quickActions = [
  { title: 'Vendor Management', desc: 'Approve and manage vendors.', icon: 'checkmark-circle-outline', route: 'VendorManagement' },
  { title: 'Bookings', desc: 'Monitor all bookings.', icon: 'calendar-outline', route: 'Bookings' },
  { title: 'Notifications', desc: 'Send platform announcements.', icon: 'notifications-outline', route: 'Notifications' },
  { title: 'Settings', desc: 'Configure platform settings.', icon: 'settings-outline', route: 'Settings' },
];

const bannerStats = [
  { label: 'Platform\nVendors', icon: 'people-outline' },
  { label: 'Platform\nCustomers', icon: 'person-outline' },
  { label: 'Platform\nBookings', icon: 'calendar-outline' },
  { label: 'Platform\nRevenue', icon: 'wallet-outline' },
];

export default function DashboardScreen({ navigation }: any) {
  const {
    dashboard,
    isDashboardLoading,
    dashboardError,
    loadDashboard,
  } = useAdminStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statCards = [
    { label: 'Vendors', value: dashboard.totalVendors.toString(), sub: 'Registered Vendors', icon: 'people-outline' },
    { label: 'Customers', value: dashboard.totalCustomers.toString(), sub: 'Registered Customers', icon: 'person-outline' },
    { label: 'Bookings', value: dashboard.totalBookings.toString(), sub: 'Platform Bookings', icon: 'calendar-outline' },
    { label: 'Revenue', value: `₹${dashboard.totalRevenue.toLocaleString('en-IN')}`, sub: 'Advance Collected', icon: 'wallet-outline' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isDashboardLoading}
          onRefresh={loadDashboard}
          tintColor={colors.blue}
        />
      }
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Monitor and manage the complete Wedding Planner platform.</Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={colors.red} />
        </View>
      </View>

      {/* Gradient Banner */}
      <LinearGradient
        colors={[colors.navyDark, colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Platform Administration</Text>
        </View>
        <Text style={styles.bannerTitle}>Welcome to{'\n'}Admin Dashboard</Text>
        <Text style={styles.bannerDesc}>
          Monitor vendors, customers, bookings, payments and overall platform performance.
        </Text>

        <View style={styles.bannerGrid}>
          {bannerStats.map((b, i) => (
            <View key={i} style={styles.bannerMiniCard}>
              <Ionicons name={b.icon as any} size={18} color={colors.white} />
              <Text style={styles.bannerMiniLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {dashboardError && (
        <View style={styles.errorCard} accessibilityRole="alert">
          <View style={styles.errorCopy}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.red} />
            <Text style={styles.errorText}>{dashboardError}</Text>
          </View>
          <TouchableOpacity onPress={loadDashboard} disabled={isDashboardLoading}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stat Cards */}
      <View style={styles.statGrid}>
        {statCards.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name={s.icon as any} size={20} color={colors.blue} />
            </View>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statSub}>{s.sub}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <Text style={styles.sectionDesc}>Manage your platform efficiently.</Text>

      <View style={styles.actionGrid}>
        {quickActions.map((a, i) => (
          <TouchableOpacity
            key={i}
            style={styles.actionCard}
            onPress={() => navigation.navigate(a.route)}
          >
            <View style={styles.actionIconBox}>
              <Ionicons name={a.icon as any} size={18} color={colors.white} />
            </View>
            <Text style={styles.actionTitle}>{a.title}</Text>
            <Text style={styles.actionDesc}>{a.desc}</Text>
            <Text style={styles.actionLink}>Manage →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 12, color: colors.textGray, marginTop: 2 },
  bell: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.redBg, alignItems: 'center', justifyContent: 'center',
  },
  banner: { borderRadius: 18, padding: 20, marginBottom: 16 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 14,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  bannerTitle: { color: colors.white, fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 10 },
  bannerDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19, marginBottom: 18 },
  bannerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bannerMiniCard: {
    width: '47%', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 12, gap: 8,
  },
  bannerMiniLabel: { color: colors.white, fontSize: 12, fontWeight: '700' },
  errorCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, padding: 12, marginBottom: 16, borderRadius: 12,
    borderWidth: 1, borderColor: colors.red, backgroundColor: colors.redBg,
  },
  errorCopy: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorText: { flex: 1, color: colors.red, fontSize: 12 },
  retryText: { color: colors.red, fontSize: 12, fontWeight: '800' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    width: '47%', backgroundColor: colors.white, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  statIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blueLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statLabel: { fontSize: 12, color: colors.textGray, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.textDark },
  statSub: { fontSize: 11, color: colors.textGray, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  sectionDesc: { fontSize: 12, color: colors.textGray, marginBottom: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 24 },
  actionCard: {
    width: '47%', backgroundColor: colors.white, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  actionIconBox: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: colors.navyMid,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  actionTitle: { fontWeight: '700', fontSize: 13, color: colors.textDark, marginBottom: 4 },
  actionDesc: { fontSize: 11, color: colors.textGray, marginBottom: 8 },
  actionLink: { fontSize: 12, color: colors.blue, fontWeight: '700' },
});
