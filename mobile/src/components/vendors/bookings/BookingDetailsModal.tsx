import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord, useVendorBookingsStore } from "../../../store/vendorBookingsStore";

const STATUS_COLORS: Record<VendorBookingRecord["status"], { bg: string; text: string }> = {
  Pending: { bg: COLORS.warningLight, text: COLORS.warning },
  Accepted: { bg: "#E6F4EA", text: COLORS.success },
  Completed: { bg: COLORS.successLight, text: COLORS.success },
  Cancelled: { bg: "#FDECEC", text: COLORS.danger },
  Rejected: { bg: "#FDECEC", text: COLORS.danger },
};

interface Props {
  visible: boolean;
  booking: VendorBookingRecord | null;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function BookingDetailsModal({ visible, booking, onClose }: Props) {
  const updateStatus = useVendorBookingsStore((state) => state.updateStatus);
  const [actionLoading, setActionLoading] = useState<"accept" | "reject" | "complete" | null>(null);

  if (!booking) return null;
  const statusStyle = STATUS_COLORS[booking.status];

  const showAcceptReject = booking.status === "Pending" && booking.adminApproved;
  const showWaitingBanner = booking.status === "Pending" && !booking.adminApproved;
  const showCompleteAction = booking.status === "Accepted";

  const handleAccept = async () => {
    setActionLoading("accept");
    try {
      await updateStatus(booking.id, "Accepted");
      onClose();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = () => {
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
              onClose();
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      "Mark Event as Completed",
      "Confirm that this event has taken place?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Completed",
          onPress: async () => {
            setActionLoading("complete");
            try {
              await updateStatus(booking.id, "Completed");
              onClose();
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Booking Details</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: SPACING.md }}>
            <Section title="Event Info">
              <Row label="Event Type" value={booking.eventType} />
              <Row label="Event Title" value={booking.eventTitle} />
              <Row label="Event Theme" value={booking.eventTheme} />
              <Row label="Event Date" value={booking.date} />
              <Row label="Event Time" value={booking.eventTime} />
              <Row label="Package" value={booking.packageName} />
              <Row label="Guests" value={booking.guests} />
            </Section>

            <Section title="Celebrant / Primary Person">
              <Row label="Name" value={booking.primaryPersonName || booking.customerName} />
              <Row label="Phone" value={booking.customerPhone} />
              <Row label="Email" value={booking.customerEmail} />
            </Section>

            {(booking.brideName || booking.groomName) && (
              <Section title="Couple Details">
                <Row label="Bride Name" value={booking.brideName} />
                <Row label="Groom Name" value={booking.groomName} />
              </Section>
            )}

            {(booking.partnerName || booking.partnerEmail || booking.partnerPhone || booking.partnerOccupation) && (
              <Section title="Partner Details">
                <Row label="Partner Name" value={booking.partnerName} />
                <Row label="Partner Email" value={booking.partnerEmail} />
                <Row label="Partner Phone" value={booking.partnerPhone} />
                <Row label="Partner Occupation" value={booking.partnerOccupation} />
              </Section>
            )}

            <Section title="Location">
              <Row label="Venue" value={booking.venue} />
              <Row label="City" value={booking.city} />
              <Row label="Address" value={booking.contactAddress} />
              <Row label="State" value={booking.contactState} />
              <Row label="Country" value={booking.contactCountry} />
            </Section>

            {booking.specialRequirements ? (
              <Section title="Special Requirements">
                <Text style={styles.notesText}>{booking.specialRequirements}</Text>
              </Section>
            ) : null}

            <Section title="Payment">
              <Row label="Total Amount" value={`₹${booking.amount.toLocaleString("en-IN")}`} />
              <Row label="Advance Paid" value={`₹${booking.advancePaid.toLocaleString("en-IN")}`} />
              <Row label="Remaining" value={`₹${booking.remainingAmount.toLocaleString("en-IN")}`} />
              <Row label="Payment Status" value={booking.paymentStatus} />
            </Section>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusPillText, { color: statusStyle.text }]}>{booking.status}</Text>
              </View>
            </View>

            {showWaitingBanner && (
              <View style={styles.pendingApprovalBanner}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.pendingApprovalText}>
                  Waiting for admin approval before you can respond.
                </Text>
              </View>
            )}
          </ScrollView>

          {showAcceptReject && (
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

          {showCompleteAction && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={handleComplete}
                disabled={actionLoading !== null}
              >
                {actionLoading === "complete" ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionBtnText}>Mark Event as Completed</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  card: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg, padding: SPACING.lg, maxHeight: "85%" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: COLORS.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: 12, color: COLORS.textMuted },
  detailValue: { fontSize: 13, fontWeight: "700", color: COLORS.text, maxWidth: "60%", textAlign: "right" },
  notesText: { fontSize: 13, color: COLORS.text, lineHeight: 19, marginTop: 2 },
  statusPill: { borderRadius: RADIUS.md, paddingHorizontal: 8, paddingVertical: 3 },
  statusPillText: { fontSize: 11, fontWeight: "700" },

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
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  completeBtn: {
    backgroundColor: COLORS.primary,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});