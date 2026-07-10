import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import StatCard from '../../components/admin/StatCard';

type Payment = {
  id: string;
  code: string;
  type: string;
  customer: string;
  vendor: string;
  amount: string;
  paid: string;
  remaining: string;
  status: 'partial' | 'processing' | 'completed';
};

const dummyPayments: Payment[] = [
  { id: '1', code: 'WD20260FBF108F', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', amount: '₹50,000', paid: '₹5,000', remaining: '₹45,000', status: 'partial' },
  { id: '2', code: 'WD2026F712EEA7', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', amount: '₹50,000', paid: '₹0', remaining: '₹50,000', status: 'processing' },
  { id: '3', code: 'WD202641B8D270', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', amount: '₹50,000', paid: '₹0', remaining: '₹50,000', status: 'processing' },
  { id: '4', code: 'WD20269A4004FD', type: 'Wedding', customer: 'Pearl', vendor: 'Manav Wedding Studio', amount: '₹50,000', paid: '₹5,000', remaining: '₹45,000', status: 'partial' },
];

const statusColors: Record<string, { text: string; bg: string }> = {
  partial: { text: colors.blue, bg: colors.blueLight },
  processing: { text: colors.yellow, bg: colors.yellowBg },
  completed: { text: colors.green, bg: colors.greenBg },
};

export default function Payments({ navigation }: any) {
  const [search, setSearch] = useState('');

  const total = dummyPayments.length;
  const revenue = '₹20,060';
  const completed = dummyPayments.filter((p) => p.status === 'completed').length;
  const pending = dummyPayments.filter((p) => p.status !== 'completed').length;

  const filtered = dummyPayments.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient colors={[colors.navyDark, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="card-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Payment Management</Text>
        </View>
        <Text style={styles.bannerTitle}>Monitor Platform{'\n'}Payments</Text>
        <Text style={styles.bannerDesc}>View payment history, statuses and transactions across the platform.</Text>
      </LinearGradient>

      <View style={styles.statGrid}>
        <StatCard icon="card-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Transactions" value={total} />
        <StatCard icon="cash-outline" iconColor={colors.green} iconBg={colors.greenBg} label="Revenue" value={revenue} />
        <StatCard icon="checkmark-circle-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Completed" value={completed} />
        <StatCard icon="time-outline" iconColor={colors.yellow} iconBg={colors.yellowBg} label="Pending" value={pending} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textGray} />
        <TextInput
          placeholder="Search payments..."
          placeholderTextColor={colors.textGray}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listCard}>
        {filtered.length === 0 && <Text style={styles.emptyText}>No payments found.</Text>}

        {filtered.map((p) => {
          const sc = statusColors[p.status];
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View>
                  <Text style={styles.code}>{p.code}</Text>
                  <Text style={styles.type}>{p.type}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.pillText, { color: sc.text }]}>{p.status}</Text>
                </View>
              </View>

              <View style={styles.row}><Text style={styles.metaLabel}>Customer</Text><Text style={styles.metaValue}>{p.customer}</Text></View>
              <View style={styles.row}><Text style={styles.metaLabel}>Vendor</Text><Text style={styles.metaValue}>{p.vendor}</Text></View>
              <View style={styles.row}><Text style={styles.metaLabel}>Amount</Text><Text style={styles.metaValue}>{p.amount}</Text></View>
              <View style={styles.row}><Text style={styles.metaLabel}>Paid</Text><Text style={[styles.metaValue, { color: colors.green }]}>{p.paid}</Text></View>
              <View style={styles.row}><Text style={styles.metaLabel}>Remaining</Text><Text style={[styles.metaValue, { color: colors.red }]}>{p.remaining}</Text></View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metaLabel: { fontSize: 12, color: colors.textGray },
  metaValue: { fontSize: 12, color: colors.textDark, fontWeight: '600' },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 10, fontWeight: '700' },
});