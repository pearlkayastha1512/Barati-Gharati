import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import StatCard from '../../components/admin/StatCard';

type Booking = {
  id: string;
  code: string;
  type: string;
  customer: string;
  vendor: string;
  eventDate: string;
  amount: string;
  payment: 'partial' | 'processing' | 'completed';
  status: 'accepted' | 'pending' | 'cancelled';
};

const dummyBookings: Booking[] = [
  { id: '1', code: 'WD20260FBF108F', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', eventDate: '15/12/2026', amount: '₹50,000', payment: 'partial', status: 'accepted' },
  { id: '2', code: 'WD2026F712EEA7', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', eventDate: '15/12/2026', amount: '₹50,000', payment: 'processing', status: 'pending' },
  { id: '3', code: 'WD202641B8D270', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', eventDate: '15/12/2026', amount: '₹50,000', payment: 'processing', status: 'pending' },
  { id: '4', code: 'WD20269A4004FD', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', eventDate: '15/12/2026', amount: '₹50,000', payment: 'partial', status: 'pending' },
];

const paymentColors: Record<string, { text: string; bg: string }> = {
  partial: { text: colors.blue, bg: colors.blueLight },
  processing: { text: colors.yellow, bg: colors.yellowBg },
  completed: { text: colors.green, bg: colors.greenBg },
};

const statusColors: Record<string, { text: string; bg: string }> = {
  accepted: { text: colors.green, bg: colors.greenBg },
  pending: { text: colors.yellow, bg: colors.yellowBg },
  cancelled: { text: colors.red, bg: colors.redBg },
};

export default function Bookings({ navigation }: any) {
  const [search, setSearch] = useState('');

  const total = dummyBookings.length;
  const pending = dummyBookings.filter((b) => b.status === 'pending').length;
  const accepted = dummyBookings.filter((b) => b.status === 'accepted').length;
  const cancelled = dummyBookings.filter((b) => b.status === 'cancelled').length;

  const filtered = dummyBookings.filter(
    (b) =>
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient colors={[colors.navyDark, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="calendar-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Booking Management</Text>
        </View>
        <Text style={styles.bannerTitle}>Manage All{'\n'}Platform Bookings</Text>
        <Text style={styles.bannerDesc}>Monitor bookings between customers and vendors across the platform.</Text>
      </LinearGradient>

      <View style={styles.statGrid}>
        <StatCard icon="calendar-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Total Bookings" value={total} />
        <StatCard icon="time-outline" iconColor={colors.yellow} iconBg={colors.yellowBg} label="Pending" value={pending} />
        <StatCard icon="checkmark-circle-outline" iconColor={colors.green} iconBg={colors.greenBg} label="Accepted" value={accepted} />
        <StatCard icon="close-circle-outline" iconColor={colors.red} iconBg={colors.redBg} label="Cancelled" value={cancelled} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textGray} />
        <TextInput
          placeholder="Search booking..."
          placeholderTextColor={colors.textGray}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listCard}>
        {filtered.length === 0 && <Text style={styles.emptyText}>No bookings found.</Text>}

        {filtered.map((b) => {
          const pc = paymentColors[b.payment];
          const sc = statusColors[b.status];
          return (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View>
                  <Text style={styles.code}>{b.code}</Text>
                  <Text style={styles.type}>{b.type}</Text>
                </View>
                <TouchableOpacity style={styles.eyeBtn}>
                  <Ionicons name="eye-outline" size={18} color={colors.textGray} />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Text style={styles.metaLabel}>Customer</Text>
                <Text style={styles.metaValue}>{b.customer}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.metaLabel}>Vendor</Text>
                <Text style={styles.metaValue}>{b.vendor}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.metaLabel}>Event Date</Text>
                <Text style={styles.metaValue}>{b.eventDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.metaLabel}>Amount</Text>
                <Text style={styles.metaValue}>{b.amount}</Text>
              </View>

              <View style={styles.badgeRow}>
                <View style={[styles.pill, { backgroundColor: pc.bg }]}>
                  <Text style={[styles.pillText, { color: pc.text }]}>{b.payment}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.pillText, { color: sc.text }]}>{b.status}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 13, color: colors.textDark },
  listCard: { gap: 12 },
  emptyText: { textAlign: 'center', color: colors.textGray, padding: 20 },
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  code: { fontSize: 13, fontWeight: '800', color: colors.textDark },
  type: { fontSize: 11, color: colors.textGray, marginTop: 2 },
  eyeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metaLabel: { fontSize: 12, color: colors.textGray },
  metaValue: { fontSize: 12, color: colors.textDark, fontWeight: '600' },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 10, fontWeight: '700' },
});