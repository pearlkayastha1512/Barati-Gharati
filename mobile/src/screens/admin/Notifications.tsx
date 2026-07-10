import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  by: string;
  time: string;
  unread: boolean;
};

const dummyNotifications: NotificationItem[] = [
  { id: '1', title: 'Vendor Badge Updated', message: 'Your vendor badge is now BRONZE. You can receive up to 5 bookings per month.', by: 'Manav (vendor)', time: '10/7/2026, 10:10:16 AM', unread: true },
  { id: '2', title: 'Vendor Badge Purchased', message: 'Manav Wedding Studio upgraded to SILVER.', by: 'Pearl (admin)', time: '10/7/2026, 10:08:14 AM', unread: true },
  { id: '3', title: 'Badge Upgraded', message: 'Your vendor badge is now SILVER. You can receive up to 15 bookings per month.', by: 'Manav (vendor)', time: '10/7/2026, 10:08:14 AM', unread: true },
  { id: '4', title: 'Vendor Badge Updated', message: 'Your vendor badge is now BRONZE. You can receive up to 5 bookings per month.', by: 'Manav (vendor)', time: '10/7/2026, 9:41:13 AM', unread: true },
  { id: '5', title: 'Vendor Badge Updated', message: 'Your vendor badge is now GOLD. You can receive up to 50 bookings per month.', by: 'Manav (vendor)', time: '10/7/2026, 9:41:11 AM', unread: true },
  { id: '6', title: 'Vendor Badge Updated', message: 'Your vendor badge is now SILVER. You can receive up to 15 bookings per month.', by: 'Manav (vendor)', time: '10/7/2026, 9:41:10 AM', unread: true },
];

export default function Notifications({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient colors={[colors.navyDark, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="notifications-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Notifications</Text>
        </View>
        <Text style={styles.bannerTitle}>Platform{'\n'}Notifications</Text>
        <Text style={styles.bannerDesc}>Monitor recent activities happening across the platform.</Text>
      </LinearGradient>

      <View style={styles.listCard}>
        {dummyNotifications.map((n) => (
          <View key={n.id} style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="person-add-outline" size={18} color={colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{n.title}</Text>
                {n.unread && (
                  <View style={styles.unreadPill}>
                    <Text style={styles.unreadText}>Unread</Text>
                  </View>
                )}
              </View>
              <Text style={styles.message}>{n.message}</Text>
              <Text style={styles.meta}>
                {n.by} - {n.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  banner: { borderRadius: 18, padding: 20, marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  bannerTitle: { color: colors.white, fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  bannerDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19 },
  listCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  unreadPill: { backgroundColor: colors.blueLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  unreadText: { fontSize: 9, color: colors.blue, fontWeight: '700' },
  message: { fontSize: 12, color: colors.textGray, marginBottom: 4, lineHeight: 17 },
  meta: { fontSize: 10, color: colors.textGray },
});