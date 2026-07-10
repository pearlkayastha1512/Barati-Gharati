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

type Vendor = {
  id: string;
  name: string;
  owner: string;
  category: string;
  city: string;
  approval: 'Approved' | 'Pending' | 'Rejected';
  business: 'Verified' | 'Unverified';
  status: 'Active' | 'Inactive';
};

const dummyVendors: Vendor[] = [
  {
    id: '1',
    name: 'Manav Wedding Studio',
    owner: 'Manav',
    category: 'Photography',
    city: 'Gorakhpur',
    approval: 'Approved',
    business: 'Verified',
    status: 'Active',
  },
];

const approvalColors: Record<string, { text: string; bg: string }> = {
  Approved: { text: colors.green, bg: colors.greenBg },
  Pending: { text: colors.yellow, bg: colors.yellowBg },
  Rejected: { text: colors.red, bg: colors.redBg },
};

export default function VendorManagement({ navigation }: any) {
  const [search, setSearch] = useState('');

  const total = dummyVendors.length;
  const pending = dummyVendors.filter((v) => v.approval === 'Pending').length;
  const approved = dummyVendors.filter((v) => v.approval === 'Approved').length;
  const rejected = dummyVendors.filter((v) => v.approval === 'Rejected').length;

  const filtered = dummyVendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.owner.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendor Management</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient
        colors={[colors.navyDark, colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Vendor Management</Text>
        </View>
        <Text style={styles.bannerTitle}>Manage{'\n'}Platform Vendors</Text>
        <Text style={styles.bannerDesc}>
          Approve new vendors, review business details, manage registrations and monitor
          vendor activity across the platform.
        </Text>
      </LinearGradient>

      <View style={styles.statGrid}>
        <StatCard icon="people-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Total Vendors" value={total} />
        <StatCard icon="time-outline" iconColor={colors.yellow} iconBg={colors.yellowBg} label="Pending" value={pending} />
        <StatCard icon="checkmark-circle-outline" iconColor={colors.green} iconBg={colors.greenBg} label="Approved" value={approved} />
        <StatCard icon="close-circle-outline" iconColor={colors.red} iconBg={colors.redBg} label="Rejected" value={rejected} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textGray} />
        <TextInput
          placeholder="Search by business, owner or city..."
          placeholderTextColor={colors.textGray}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listCard}>
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No vendors found.</Text>
        )}

        {filtered.map((v) => {
          const ac = approvalColors[v.approval];
          return (
            <View key={v.id} style={styles.vendorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{v.name.charAt(0)}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.vendorName}>{v.name}</Text>
                <Text style={styles.vendorOwner}>{v.owner}</Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.pill, { backgroundColor: ac.bg }]}>
                    <Text style={[styles.pillText, { color: ac.text }]}>{v.approval}</Text>
                  </View>
                  <View
                    style={[
                      styles.pill,
                      { backgroundColor: v.business === 'Verified' ? colors.greenBg : colors.yellowBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: v.business === 'Verified' ? colors.green : colors.yellow },
                      ]}
                    >
                      {v.business}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pill,
                      { backgroundColor: v.status === 'Active' ? colors.greenBg : colors.redBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: v.status === 'Active' ? colors.green : colors.red },
                      ]}
                    >
                      {v.status}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.eyeBtn}>
                <Ionicons name="eye-outline" size={18} color={colors.textGray} />
              </TouchableOpacity>
            </View>
          );
        })}
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
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.blue, fontWeight: '700' },
  vendorName: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  vendorOwner: { fontSize: 12, color: colors.textGray, marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 10, fontWeight: '700' },
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});