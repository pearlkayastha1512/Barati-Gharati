import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord } from "../../../store/vendorBookingsStore";
import { useVendorBookingsStore } from "../../../store/vendorBookingsStore";

export function BookingDetailsCard({ booking }: { booking: VendorBookingRecord | null }) {
  const updateStatus = useVendorBookingsStore((state) => state.updateStatus);
  const [actionLoading, setActionLoading] = useState<"accept" | "reject" | null>(null);

  const canRespond =
    booking &&
    booking.adminApproved &&
    (booking.status === "Pending" || booking.status === "Accepted" ? booking.status === "Pending" : false);

  const handleAccept = async () => {
    if (!booking) return;
    setActionLoading("accept");
    try {
      await updateStatus(booking.id, "Accepted");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = () => {
    if (!booking) return;
    Alert.alert(
      "Reject Booking",
      "Are you sure you want to reject this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setActionLoading("reject");
            try {
              await updateStatus(booking.id, "Rejected");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

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
          <View style={[styles.detailRow, { borderBottomWidth: booking.status === "Pending" ? 1 : 0 }]}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{booking.status}</Text>
          </View>

          {booking.status === "Pending" && !booking.adminApproved && (
            <View style={styles.pendingApprovalBanner}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.pendingApprovalText}>
                Waiting for admin approval before you can respond.
              </Text>
            </View>
          )}

          {booking.status === "Pending" && booking.adminApproved && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={handleAccept}
                disabled={actionLoading !== null}
              >
                {actionLoading === "accept" ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionBtnText}>Accept Booking</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={handleReject}
                disabled={actionLoading !== null}
              >
                {actionLoading === "reject" ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionBtnText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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

  pendingApprovalBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 8,
  },
  pendingApprovalText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },

  actionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    backgroundColor: "#16A34A",
  },
  rejectBtn: {
    backgroundColor: "#DC2626",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});