import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorReviewRecord } from "../../../types/vendorReview";

export function ReviewListItem({ review, onReply }: { review: VendorReviewRecord; onReply: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{review.customerName}</Text>
          <Text style={styles.package}>{review.packageName}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <MaterialCommunityIcons key={i} name={i <= review.rating ? "star" : "star-outline"} size={14} color={COLORS.star} />
          ))}
        </View>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>

      {review.reply ? (
        <View style={styles.replyBox}>
          <Text style={styles.replyLabel}>Your reply</Text>
          <Text style={styles.replyText}>{review.reply}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.replyButton} onPress={onReply}>
          <MaterialCommunityIcons name="reply" size={14} color={COLORS.primary} />
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, elevation: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xs },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  package: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  comment: { fontSize: 13, color: COLORS.text, lineHeight: 19, marginTop: SPACING.xs },
  replyButton: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: SPACING.sm },
  replyButtonText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  replyBox: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.sm, marginTop: SPACING.sm },
  replyLabel: { fontSize: 10, fontWeight: "700", color: COLORS.primary, marginBottom: 2 },
  replyText: { fontSize: 12, color: COLORS.text, lineHeight: 17 },
});