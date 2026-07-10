import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import StatCard from '../../components/admin/StatCard';

type Review = {
  id: string;
  customer: string;
  vendor: string;
  rating: number;
  text: string;
  date: string;
};

const dummyReviews: Review[] = [
  { id: '1', customer: 'Pearl', vendor: 'Manav Wedding Studio', rating: 5, text: 'good experience', date: '9/7/2026' },
  { id: '2', customer: 'Pearl', vendor: 'Manav Wedding Studio', rating: 5, text: 'grt experience', date: '9/7/2026' },
];

export default function Reviews({ navigation }: any) {
  const [search, setSearch] = useState('');

  const total = dummyReviews.length;
  const avgRating = total > 0 ? (dummyReviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0';
  const positive = dummyReviews.filter((r) => r.rating >= 4).length;
  const negative = dummyReviews.filter((r) => r.rating <= 2).length;

  const filtered = dummyReviews.filter(
    (r) =>
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.vendor.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 26 }} />
      </View>

      <LinearGradient colors={[colors.navyDark, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="star-outline" size={13} color={colors.white} />
          <Text style={styles.badgeText}>Reviews Management</Text>
        </View>
        <Text style={styles.bannerTitle}>Manage Customer{'\n'}Reviews</Text>
        <Text style={styles.bannerDesc}>View, monitor and moderate customer reviews across the platform.</Text>
      </LinearGradient>

      <View style={styles.statGrid}>
        <StatCard icon="chatbox-outline" iconColor={colors.blue} iconBg={colors.blueLight} label="Total Reviews" value={total} />
        <StatCard icon="star-outline" iconColor={colors.yellow} iconBg={colors.yellowBg} label="Average Rating" value={avgRating} />
        <StatCard icon="thumbs-up-outline" iconColor={colors.green} iconBg={colors.greenBg} label="Positive" value={positive} />
        <StatCard icon="warning-outline" iconColor={colors.red} iconBg={colors.redBg} label="Negative" value={negative} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textGray} />
        <TextInput
          placeholder="Search reviews..."
          placeholderTextColor={colors.textGray}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listCard}>
        {filtered.length === 0 && <Text style={styles.emptyText}>No reviews found.</Text>}

        {filtered.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{r.customer.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{r.customer}</Text>
                  <Text style={styles.vendor}>{r.vendor}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.eyeBtn}>
                <Ionicons name="eye-outline" size={18} color={colors.textGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.starRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < r.rating ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.yellow}
                />
              ))}
              <Text style={styles.ratingText}>({r.rating})</Text>
            </View>

            <Text style={styles.reviewText}>{r.text}</Text>
            <Text style={styles.date}>{r.date}</Text>
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
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 13, color: colors.textDark },
  listCard: { gap: 12 },
  emptyText: { textAlign: 'center', color: colors.textGray, padding: 20 },
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.blue, fontWeight: '700' },
  name: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  vendor: { fontSize: 11, color: colors.textGray },
  eyeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8 },
  ratingText: { fontSize: 11, color: colors.textGray, marginLeft: 4 },
  reviewText: { fontSize: 13, color: colors.textDark, marginBottom: 6 },
  date: { fontSize: 11, color: colors.textGray },
});