import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { VendorBookingRecord, useVendorBookingsStore } from "../../../store/vendorBookingsStore";

// Keyed by the backend's actual lowercase status strings (see BookingsService.mapBookingStatus).
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" },
  matching: { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" },
  waiting_primary_vendor: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  promote_standby: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  primary_accepted: { bg: "#DBEAFE", text: "#1D4ED8", dot: "#3B82F6" },
  waiting_payment: { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  standby_accepted: { bg: "#DBEAFE", text: "#1D4ED8", dot: "#3B82F6" },
  advance_paid: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  awaiting_admin_review: { bg: "#E0E7FF", text: "#4338CA", dot: "#6366F1" },
  payment_approved: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  payment_held: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  in_progress: { bg: "#FCE7F3", text: "#BE185D", dot: "#EC4899" },
  completed: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  event_completed: { bg: "#E0E7FF", text: "#4338CA", dot: "#6366F1" },
  review_pending: { bg: "#E0E7FF", text: "#4338CA", dot: "#6366F1" },
  closed: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  cancelled: { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
  primary_rejected: { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
  rejected: { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
};

const DEFAULT_STATUS_STYLE = { bg: COLORS.background, text: COLORS.textMuted, dot: COLORS.textLight };

const pretty = (value?: string) =>
  value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "--";

interface Props {
  visible: boolean;
  booking: VendorBookingRecord | null;
  onClose: () => void;
}

function Section({ title, icon, children }: { title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <MaterialCommunityIcons name={icon} size={14} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value?: string | number | null; last?: boolean }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={[styles.detailRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function BookingDetailsModal({ visible, booking, onClose }: Props) {
  // ALL hooks must be called unconditionally, before any early return.
  const updateStatus = useVendorBookingsStore((state) => state.updateStatus);
  const fetchBookings = useVendorBookingsStore((state) => state.fetchBookings);
  const primaryAccept = useVendorBookingsStore((state) => state.primaryAccept);
  const primaryReject = useVendorBookingsStore((state) => state.primaryReject);
  const promotedAccept = useVendorBookingsStore((state) => state.promotedAccept);
  const promotedReject = useVendorBookingsStore((state) => state.promotedReject);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshingModal, setRefreshingModal] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!booking) return null;

  const rawStatus = booking.rawStatus;
  const statusStyle = STATUS_COLORS[rawStatus] ?? DEFAULT_STATUS_STYLE;

  const showAcceptReject = rawStatus === "waiting_primary_vendor";
  const showPromotedAcceptReject = rawStatus === "promote_standby";
  const showMatchingBanner = rawStatus === "pending" || rawStatus === "matching";
  const showPaymentWaiting =
    rawStatus === "primary_accepted" ||
    rawStatus === "waiting_payment" ||
    rawStatus === "standby_accepted";
  const showAdminWaiting = rawStatus === "awaiting_admin_review";

  const isActiveConfirmed = [
    "advance_paid",
    "payment_approved",
    "payment_held",
    "in_progress",
    "completed",
  ].includes(rawStatus);

  const eventHasOccurred = new Date(booking.eventDateRaw) <= new Date();
  const showCompleteAction = isActiveConfirmed && eventHasOccurred;
  const showUpcomingBanner = isActiveConfirmed && !eventHasOccurred;
  const showAlreadyDone = ["event_completed", "review_pending", "closed"].includes(rawStatus);

  const handleAccept = () => {
    Alert.alert("Accept Booking", "Confirm accepting this booking?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          setActionLoading(true);
          try {
            await primaryAccept(booking.id);
            onClose();
          } catch {
            Alert.alert("Error", "Failed to accept booking.");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  // Reject now REQUIRES a reason — validated before the confirm dialog even
  // opens, so an empty submit never reaches the API.
  const handleRejectConfirm = () => {
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      Alert.alert("Reason required", "Please tell the customer why you're rejecting this booking.");
      return;
    }

    Alert.alert("Reject Booking", "Are you sure you want to reject this booking?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          setActionLoading(true);
          try {
            await primaryReject(booking.id, trimmedReason);
            setShowRejectInput(false);
            setRejectReason("");
            onClose();
          } catch {
            Alert.alert("Error", "Failed to reject booking.");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handlePromotedAccept = () => {
    Alert.alert("Accept Booking", "Confirm accepting this booking as the new vendor?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          setActionLoading(true);
          try {
            await promotedAccept(booking.id);
            onClose();
          } catch {
            Alert.alert("Error", "Failed to accept booking.");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  // Same mandatory-reason validation as handleRejectConfirm, for the
  // promoted-standby-vendor decision path.
  const handlePromotedRejectConfirm = () => {
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      Alert.alert("Reason required", "Please tell the customer why you're rejecting this booking.");
      return;
    }

    Alert.alert("Reject Booking", "Are you sure you want to reject this booking?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          setActionLoading(true);
          try {
            await promotedReject(booking.id, trimmedReason);
            setShowRejectInput(false);
            setRejectReason("");
            onClose();
          } catch {
            Alert.alert("Error", "Failed to reject booking.");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleComplete = () => {
    Alert.alert(
      "Mark Event as Completed",
      "Confirm that this event has taken place? The customer will then be asked to pay the remaining amount.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Completed",
          onPress: async () => {
            setActionLoading(true);
            try {
              await updateStatus(booking.id, "Completed");
              await fetchBookings();
              onClose();
            } catch {
              Alert.alert("Error", "Failed to mark event as complete.");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshingModal(true);
    await fetchBookings();
    setRefreshingModal(false);
  };

  const showDecisionActions = showAcceptReject || showPromotedAcceptReject;
  const handleDecisionAccept = showAcceptReject ? handleAccept : handlePromotedAccept;
  const handleDecisionReject = showAcceptReject ? handleRejectConfirm : handlePromotedRejectConfirm;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.dragHandle} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Booking Details</Text>
              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg, marginTop: 6 }]}>
                <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                <Text style={[styles.statusPillText, { color: statusStyle.text }]}>{pretty(rawStatus)}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: SPACING.lg }}>
            <Section title="Event Info" icon="party-popper">
              <Row label="Event Type" value={booking.eventType} />
              <Row label="Event Title" value={booking.eventTitle} />
              <Row label="Event Theme" value={booking.eventTheme} />
              <Row label="Event Date" value={booking.date} />
              <Row label="Event Time" value={booking.eventTime} />
              <Row label="Package" value={booking.packageName} />
              <Row label="Guests" value={booking.guests} last />
            </Section>

            <Section title="Celebrant / Primary Person" icon="account-outline">
              <Row label="Name" value={booking.primaryPersonName || booking.customerName} />
              <Row label="Phone" value={booking.customerPhone} />
              <Row label="Email" value={booking.customerEmail} last />
            </Section>

            {(booking.brideName || booking.groomName) && (
              <Section title="Couple Details" icon="ring">
                <Row label="Bride Name" value={booking.brideName} />
                <Row label="Groom Name" value={booking.groomName} last />
              </Section>
            )}

            {(booking.partnerName || booking.partnerEmail || booking.partnerPhone || booking.partnerOccupation) && (
              <Section title="Partner Details" icon="account-heart-outline">
                <Row label="Partner Name" value={booking.partnerName} />
                <Row label="Partner Email" value={booking.partnerEmail} />
                <Row label="Partner Phone" value={booking.partnerPhone} />
                <Row label="Partner Occupation" value={booking.partnerOccupation} last />
              </Section>
            )}

            <Section title="Location" icon="map-marker-outline">
              <Row label="Venue" value={booking.venue} />
              <Row label="City" value={booking.city} />
              <Row label="Address" value={booking.contactAddress} />
              <Row label="State" value={booking.contactState} />
              <Row label="Country" value={booking.contactCountry} last />
            </Section>

            {booking.specialRequirements ? (
              <Section title="Special Requirements" icon="text-box-outline">
                <Text style={styles.notesText}>{booking.specialRequirements}</Text>
              </Section>
            ) : null}

            <Section title="Payment" icon="cash-multiple">
              <Row label="Total Amount" value={`₹${booking.amount.toLocaleString("en-IN")}`} />
              <Row label="Advance Paid" value={`₹${booking.advancePaid.toLocaleString("en-IN")}`} />
              <Row label="Remaining" value={`₹${booking.remainingAmount.toLocaleString("en-IN")}`} />
              <Row label="Payment Status" value={pretty(booking.paymentStatus)} last />
            </Section>

            {showMatchingBanner && (
              <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.infoBannerText}>
                  This booking is being matched to vendors. You'll be notified if you're selected.
                </Text>
              </View>
            )}

            {showPromotedAcceptReject && !showRejectInput && (
              <View style={styles.highlightBanner}>
                <MaterialCommunityIcons name="star-outline" size={16} color="#92400E" />
                <Text style={styles.highlightBannerText}>
                  You've been selected as a replacement vendor for this booking. Please accept or reject.
                </Text>
              </View>
            )}

            {showPaymentWaiting && (
              <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.infoBannerText}>
                  You accepted this booking — waiting for the customer's advance payment.
                </Text>
              </View>
            )}

            {showAdminWaiting && (
              <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="progress-clock" size={16} color={COLORS.textMuted} />
                <Text style={styles.infoBannerText}>
                  Waiting for admin approval.
                </Text>
                <TouchableOpacity onPress={handleRefresh} disabled={refreshingModal}>
                  {refreshingModal ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={{ color: COLORS.primary, fontWeight: "700", fontSize: 12 }}>Refresh</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {showUpcomingBanner && (
              <View style={styles.infoBanner}>
                <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.textMuted} />
                <Text style={styles.infoBannerText}>
                  You can mark this event complete on or after {booking.date}.
                </Text>
              </View>
            )}

            {showAlreadyDone && (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons name="check-circle-outline" size={16} color="#15803D" />
                <Text style={styles.successBannerText}>
                  This event has been marked complete.
                </Text>
              </View>
            )}

            {showDecisionActions && showRejectInput && (
              <View style={styles.rejectSection}>
                <View style={styles.rejectHeaderRow}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="#DC2626" />
                  <Text style={styles.rejectSectionTitle}>Reason for rejecting</Text>
                  <Text style={styles.optionalTag}>required</Text>
                </View>
                <TextInput
                  style={styles.rejectInput}
                  placeholder="e.g. Not available on this date"
                  placeholderTextColor={COLORS.textLight}
                  value={rejectReason}
                  onChangeText={setRejectReason}
                  multiline
                  numberOfLines={4}
                  maxLength={250}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{rejectReason.length}/250</Text>
              </View>
            )}

            <View style={{ height: SPACING.md }} />
          </ScrollView>

          {showDecisionActions && !showRejectInput && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={handleDecisionAccept}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check-bold" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Accept Booking</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtnOutline]}
                onPress={() => setShowRejectInput(true)}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="close" size={16} color="#DC2626" />
                <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>Reject Booking</Text>
              </TouchableOpacity>
            </View>
          )}

          {showDecisionActions && showRejectInput && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => {
                  setShowRejectInput(false);
                  setRejectReason("");
                }}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                <Text style={[styles.actionBtnText, { color: COLORS.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={handleDecisionReject}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionBtnText}>Confirm Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {showCompleteAction && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={handleComplete}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="flag-checkered" size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Mark Event as Completed</Text>
                  </>
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
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  card: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusPillText: { fontSize: 11, fontWeight: "700" },

  section: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {},

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: { fontSize: 12, color: COLORS.textMuted },
  detailValue: { fontSize: 13, fontWeight: "700", color: COLORS.text, maxWidth: "60%", textAlign: "right" },
  notesText: { fontSize: 13, color: COLORS.text, lineHeight: 19 },

  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
  },
  infoBannerText: { fontSize: 12, color: COLORS.textMuted, flex: 1 },

  highlightBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
  },
  highlightBannerText: { fontSize: 12, color: "#92400E", flex: 1, fontWeight: "500" },

  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    gap: 8,
  },
  successBannerText: { fontSize: 12, color: "#15803D", flex: 1, fontWeight: "500" },

  rejectSection: {
    marginTop: SPACING.md,
    backgroundColor: "#FEF2F2",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rejectSectionTitle: { fontSize: 12, fontWeight: "700", color: "#991B1B" },
  optionalTag: { fontSize: 10, color: COLORS.textLight, marginLeft: "auto" },
  rejectInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    minHeight: 80,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  charCount: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 4,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
  },
  acceptBtn: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rejectBtnOutline: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rejectBtn: {
    backgroundColor: COLORS.danger,
  },
  completeBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});