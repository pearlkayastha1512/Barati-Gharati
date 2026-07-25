import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord } from "../../../store/vendorBookingsStore";
import { useVendorBookingsStore } from "../../../store/vendorBookingsStore";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  Accepted: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A" },
  Rejected: { bg: "#FEE2E2", text: "#991B1B", dot: "#DC2626" },
  Cancelled: { bg: "#FEE2E2", text: "#991B1B", dot: "#DC2626" },
  Completed: { bg: "#DBEAFE", text: "#1E40AF", dot: "#2563EB" },
};

const AVATAR_COLORS = ["#FDE68A", "#BFDBFE", "#FBCFE8", "#C7D2FE", "#A7F3D0", "#FED7AA"];

export function BookingDetailsCard({ booking }: { booking: VendorBookingRecord | null }) {
  const acceptBooking = useVendorBookingsStore((state) => state.acceptBooking);
  const rejectBooking = useVendorBookingsStore((state) => state.rejectBooking);

  const [actionLoading, setActionLoading] = useState<"accept" | "reject" | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const canRespond = booking !== null && booking.adminApproved && booking.status === "Pending";

  const handleAccept = async () => {
    if (!booking) return;
    setActionLoading("accept");
    try {
      await acceptBooking(booking.id);
    } catch (error) {
      Alert.alert("Something went wrong", "Couldn't accept this booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = () => {
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleConfirmReject = async () => {
    if (!booking) return;
    const trimmedReason = rejectReason.trim();

    if (trimmedReason.length === 0) {
      Alert.alert("Reason required", "Please tell the customer why you're rejecting this booking.");
      return;
    }

    setActionLoading("reject");
    try {
      await rejectBooking(booking.id, trimmedReason);
      setRejectModalVisible(false);
    } catch (error) {
      Alert.alert("Something went wrong", "Couldn't reject this booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle = booking ? (STATUS_STYLES[booking.status] || STATUS_STYLES.Pending) : STATUS_STYLES.Pending;
  const showAmountHighlight = booking
    ? booking.payoutStatus === "released" || booking.payoutStatus === "settled"
    : false;
  const initial = booking?.customerName?.charAt(0)?.toUpperCase() || "?";
  const avatarColor = booking ? AVATAR_COLORS[booking.customerName.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconWrap}>
            <MaterialCommunityIcons name="calendar-check-outline" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Booking Details</Text>
        </View>
        {booking && (
          <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
            <Text style={[styles.statusPillText, { color: statusStyle.text }]}>{booking.status}</Text>
          </View>
        )}
      </View>

      {!booking ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="calendar-search" size={30} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Booking Selected</Text>
          <Text style={styles.emptySubtitle}>Tap "View" on a booking above to see its details.</Text>
        </View>
      ) : (
        <View style={{ marginTop: SPACING.lg }}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName} numberOfLines={1}>{booking.customerName}</Text>
              <View style={styles.profileMetaRow}>
                <MaterialCommunityIcons name="party-popper" size={12} color={COLORS.textLight} />
                <Text style={styles.profileMetaText}>{booking.eventType}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailGroup}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <MaterialCommunityIcons name="calendar-month-outline" size={15} color={COLORS.textMuted} />
                <Text style={styles.detailLabel}>Event Date</Text>
              </View>
              <Text style={styles.detailValue}>{booking.date}</Text>
            </View>
          </View>

          <View style={[styles.amountCard, showAmountHighlight && styles.amountCardHighlight]}>
            <View style={styles.amountIconWrap}>
              <MaterialCommunityIcons
                name={showAmountHighlight ? "wallet-outline" : "currency-inr"}
                size={20}
                color={showAmountHighlight ? "#16A34A" : COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.amountLabel}>
                {showAmountHighlight ? "You'll receive" : "Booking amount"}
              </Text>
              <Text style={[styles.amountValue, showAmountHighlight && styles.amountValueHighlight]}>
                ₹
                {showAmountHighlight
                  ? booking.vendorNetAmount.toLocaleString("en-IN")
                  : booking.amount.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          {booking.status === "Pending" && !booking.adminApproved && (
            <View style={styles.pendingApprovalBanner}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#92400E" />
              <Text style={styles.pendingApprovalText}>
                Waiting for admin approval before you can respond.
              </Text>
            </View>
          )}

          {canRespond && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn, actionLoading !== null && styles.actionBtnDisabled]}
                onPress={handleAccept}
                disabled={actionLoading !== null}
                activeOpacity={0.85}
              >
                {actionLoading === "accept" ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check-bold" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Accept</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn, actionLoading !== null && styles.actionBtnDisabled]}
                onPress={openRejectModal}
                disabled={actionLoading !== null}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="close" size={16} color="#DC2626" />
                <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setRejectModalVisible(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <MaterialCommunityIcons name="alert-circle-outline" size={26} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Reject this booking?</Text>
            <Text style={styles.modalSubtitle}>
              Let the customer know why. This helps them find another vendor faster.
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="e.g. Already booked for this date"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              maxLength={250}
              value={rejectReason}
              onChangeText={setRejectReason}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{rejectReason.length}/250</Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setRejectModalVisible(false)}
                disabled={actionLoading !== null}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={handleConfirmReject}
                disabled={actionLoading !== null}
              >
                {actionLoading === "reject" ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Reject Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusPillText: { fontSize: 11, fontWeight: "700" },

  emptyState: { alignItems: "center", paddingVertical: SPACING.xxl },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  emptyTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textMuted, marginTop: SPACING.sm },
  emptySubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 4, textAlign: "center", paddingHorizontal: 20 },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  profileName: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  profileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  profileMetaText: { fontSize: 12, color: COLORS.textMuted },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },

  detailGroup: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailLabel: { fontSize: 12, color: COLORS.textMuted },
  detailValue: { fontSize: 13, fontWeight: "700", color: COLORS.text },

  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  amountCardHighlight: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  amountIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  amountLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 2 },
  amountValue: { fontSize: 19, fontWeight: "800", color: COLORS.text },
  amountValueHighlight: { color: "#166534" },

  pendingApprovalBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 8,
  },
  pendingApprovalText: {
    fontSize: 12,
    color: "#92400E",
    flex: 1,
    fontWeight: "500",
  },

  actionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
  },
  actionBtnDisabled: { opacity: 0.6 },
  acceptBtn: {
    backgroundColor: "#16A34A",
    shadowColor: "#16A34A",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rejectBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, lineHeight: 17 },
  reasonInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    fontSize: 13,
    color: COLORS.text,
    minHeight: 90,
  },
  charCount: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 4,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalCancelText: { color: COLORS.text, fontWeight: "700", fontSize: 13 },
  modalConfirmBtn: { backgroundColor: "#DC2626" },
  modalConfirmText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});