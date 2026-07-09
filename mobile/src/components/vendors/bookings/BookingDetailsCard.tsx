import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord } from "../../../store/vendorBookingsStore";

export function BookingDetailsCard({ booking }: { booking: VendorBookingRecord | null }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Booking Details</Text>

      {!booking ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="calendar-search" size={28} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No Booking Selected</Text>
          <Text style={styles.emptySubtitle}>Tap "View" on a booking above to see its details.</Text>
        </View>
      ) : (
        <View style={{ marginTop: SPACING.md }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{booking.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Event</Text>
            <Text style={styles.detailValue}>{booking.eventType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{booking.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>₹{booking.amount.toLocaleString("en-IN")}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{booking.status}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, elevation: 1 },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  emptyState: { alignItems: "center", paddingVertical: SPACING.xxl },
  emptyTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textMuted, marginTop: SPACING.sm },
  emptySubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 4, textAlign: "center", paddingHorizontal: 20 },
  detailRow: {
    flexDirection: "row", justifyContent: "space-between", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  detailLabel: { fontSize: 12, color: COLORS.textMuted },
  detailValue: { fontSize: 13, fontWeight: "700", color: COLORS.text },
});