import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

type Props = { averageRating: number; totalReviews: number; breakdown: Record<5 | 4 | 3 | 2 | 1, number> };

export function RatingSummaryCard({ averageRating, totalReviews, breakdown }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rating Summary</Text>

      <View style={styles.topBox}>
        <View>
          <Text style={styles.topLabel}>Average Rating</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.topValue}>{averageRating.toFixed(1)}</Text>
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MaterialCommunityIcons
                  key={i}
                  name={i <= Math.round(averageRating) ? "star" : "star-outline"}
                  size={14}
                  color={COLORS.star}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.topLabel}>Total Reviews</Text>
          <Text style={styles.topValue}>{totalReviews}</Text>
        </View>
      </View>

      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = breakdown[star];
        const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return (
          <View key={star} style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>{star}</Text>
              <MaterialCommunityIcons name="star" size={12} color={COLORS.star} />
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.barPercent}>{percent}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, elevation: 1 },
  title: { fontSize: 15, fontWeight: "800", color: COLORS.text, marginBottom: SPACING.md },
  topBox: {
    flexDirection: "row", justifyContent: "space-between", backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md,
  },
  topLabel: { fontSize: 11, color: COLORS.textMuted },
  topValue: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm, gap: 8 },
  barLabelRow: { flexDirection: "row", alignItems: "center", width: 20, gap: 2 },
  barLabel: { fontSize: 12, color: COLORS.textMuted },
  barTrack: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  barFill: { height: 6, backgroundColor: COLORS.star, borderRadius: 3 },
  barPercent: { fontSize: 11, color: COLORS.textMuted, width: 32, textAlign: "right" },
});