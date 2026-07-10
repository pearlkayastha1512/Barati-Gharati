import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import StatCard from '../../components/admin/StatCard';

type Customer = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  verified: boolean;
};

const dummyCustomers: Customer[] = [
  {
    id: '1',
    name: 'Pearl',
    role: 'Customer',
    email: 'pearl.gkp@gmail.com',
    phone: '6393609526',
    verified: true,
  },
];

export default function CustomerManagement({ navigation }: any) {
  const [search, setSearch] = useState('');

  const total = dummyCustomers.length;
  const verified = dummyCustomers.filter((c) => c.verified).length;
  const unverified = total - verified;
  const active = dummyCustomers.length; // adjust when real "active" field exists

  const filtered = dummyCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Management</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient
        colors={[colors.navyDark, colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <View style={styles.badge}>
          <Ionicons name="people-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Customer Management</Text>
        </View>
        <Text style={styles.bannerTitle}>Manage Platform{'\n'}Customers</Text>
        <Text style={styles.bannerDesc}>View registered customers and manage platform users.</Text>
      </LinearGradient>

      <View style={styles.statGrid}>
        <StatCard icon="people-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Total Customers" value={total} />
        <StatCard icon="shield-checkmark-outline" iconColor={colors.green} iconBg={colors.greenBg} label="Verified" value={verified} />
        <StatCard icon="person-remove-outline" iconColor={colors.yellow} iconBg={colors.yellowBg} label="Unverified" value={unverified} />
        <StatCard icon="person-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Active Accounts" value={active} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textGray} />
        <TextInput
          placeholder="Search customer..."
          placeholderTextColor={colors.textGray}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listCard}>
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No customers found.</Text>
        )}

        {filtered.map((c) => (
          <View key={c.id} style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{c.name.charAt(0)}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.role}>{c.role}</Text>
            </View>

            <View style={{ flex: 1.4 }}>
              <Text style={styles.meta}>{c.email}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.meta}>{c.phone}</Text>
            </View>

            <View
              style={[
                styles.pill,
                { backgroundColor: c.verified ? colors.greenBg : colors.yellowBg },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: c.verified ? colors.green : colors.yellow },
                ]}
              >
                {c.verified ? 'Verified' : 'Unverified'}
              </Text>
            </View>

            <TouchableOpacity style={styles.eyeBtn}>
              <Ionicons name="eye-outline" size={18} color={colors.textGray} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  banner: { borderRadius: 18, padding: 20, marginBottom: 16 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  bannerTitle: { color: colors.white, fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  bannerDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 13, color: colors.textDark },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
  },
  emptyText: { textAlign: 'center', color: colors.textGray, padding: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.blue, fontWeight: '700' },
  name: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  role: { fontSize: 11, color: colors.textGray },
  meta: { fontSize: 12, color: colors.textDark },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 10, fontWeight: '700' },
  eyeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});