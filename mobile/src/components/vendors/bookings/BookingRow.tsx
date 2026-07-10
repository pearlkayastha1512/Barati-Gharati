import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord } from "../../../store/vendorBookingsStore";

const STATUS_COLORS: Record<
  VendorBookingRecord["status"],
  { bg: string; text: string }
> = {
  Pending: {
    bg: COLORS.warningLight,
    text: COLORS.warning,
  },

  Accepted: {
    bg: "#E6F4EA",
    text: COLORS.success,
  },

  Completed: {
    bg: COLORS.successLight,
    text: COLORS.success,
  },

  Cancelled: {
    bg: "#FDECEC",
    text: COLORS.danger,
  },

  Rejected: {
    bg: "#FDECEC",
    text: COLORS.danger,
  },
};

export function BookingRow({ booking, onPress }: { booking: VendorBookingRecord; onPress: () => void }) {
  const statusStyle = STATUS_COLORS[booking.status];
  return (
    <View style={styles.row}>
      <View style={{ flex: 1.3 }}>
        <Text style={styles.customer} numberOfLines={1}>{booking.customerName}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cellText} numberOfLines={1}>{booking.eventType}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cellText} numberOfLines={1}>{booking.date}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cellText} numberOfLines={1}>₹{booking.amount.toLocaleString("en-IN")}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusPillText, { color: statusStyle.text }]} numberOfLines={1}>
            {booking.status}
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.8, alignItems: "flex-end" }}>
        <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  customer: { fontSize: 12, fontWeight: "700", color: COLORS.text },
  cellText: { fontSize: 11, color: COLORS.textMuted },
  statusPill: {
    borderRadius: RADIUS.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  statusPillText: { fontSize: 10, fontWeight: "700" },
  viewBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewBtnText: { fontSize: 10, fontWeight: "700", color: COLORS.primary },
});