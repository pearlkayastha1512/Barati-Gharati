import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

type Props = {
  averageRating: number;
  totalReviews: number;
  latestReviewName?: string;
  onOpenFeedback: () => void;
};

export function ReviewOverviewHero({ averageRating, totalReviews, latestReviewName, onOpenFeedback }: Props) {
  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.card}>
      <View style={styles.pill}>
        <MaterialCommunityIcons name="star-outline" size={13} color="#fff" />
        <Text style={styles.pillText}>Customer Reviews</Text>
      </View>

      <Text style={styles.title}>Build trust with{"\n"}happy customers</Text>
      <Text style={styles.subtitle}>
        View ratings, respond to customer feedback and improve your wedding business.
      </Text>

      <View style={styles.overviewBox}>
        <View style={styles.overviewHeader}>
          <MaterialCommunityIcons name="trending-up" size={16} color="#fff" />
          <Text style={styles.overviewTitle}>Review Overview</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Average Rating</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MaterialCommunityIcons name="star" size={13} color={COLORS.star} />
            <Text style={styles.overviewValue}>{averageRating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Total Reviews</Text>
          <Text style={styles.overviewValue}>{totalReviews}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Latest Review</Text>
          <Text style={styles.overviewValue}>{latestReviewName ?? "No reviews"}</Text>
        </View>

        <TouchableOpacity style={styles.feedbackButton} onPress={onOpenFeedback}>
          <MaterialCommunityIcons name="message-text-outline" size={14} color="#fff" />
          <Text style={styles.feedbackButtonText}>Customer Feedback</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.lg },
  pill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: SPACING.md, gap: 5,
  },
  pillText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30, marginBottom: SPACING.sm },
  subtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 19, marginBottom: SPACING.lg },

  overviewBox: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: RADIUS.lg, padding: SPACING.md },
  overviewHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: SPACING.sm },
  overviewTitle: { fontSize: 13, fontWeight: "700", color: "#fff" },
  overviewRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  overviewLabel: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
  overviewValue: { fontSize: 13, fontWeight: "700", color: "#fff" },

  feedbackButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: RADIUS.md,
    paddingVertical: 10, marginTop: SPACING.md,
  },
  feedbackButtonText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});