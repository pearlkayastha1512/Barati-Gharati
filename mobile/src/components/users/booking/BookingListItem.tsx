import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Booking } from "../../../types/booking";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";

const STATUS_COLORS: Record<Booking["bookingStatus"], { bg: string; text: string }> = {
  pending: { bg: "#FFF3B0", text: "#6C2D45" },
  advance_paid: { bg: "#DBEAFE", text: "#1D4ED8" },
  accepted: { bg: "#FFF8D8", text: "#6C2D45" },
  event_completed: { bg: "#E0E7FF", text: "#4338CA" },
  awaiting_admin_review: { bg: "#F3E8FF", text: "#7E22CE" },
  payment_approved: { bg: "#D1FAE5", text: "#047857" },
  payment_held: { bg: "#FEE2E2", text: "#B91C1C" },
  completed: { bg: "#FFE6EB", text: "#FF4D6D" },
  rejected: { bg: "#FFE6EB", text: "#E63B5F" },
  cancelled: { bg: "#FFE6EB", text: "#E63B5F" },
};

const prettyStatus = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export function BookingListItem({ booking, onPress, onPay }: { booking: Booking; onPress: () => void; onPay: (mode: "advance" | "remaining") => void }) {
  const statusStyle = STATUS_COLORS[booking.bookingStatus];
  const canPayAdvance = booking.advancePaid <= 0 && booking.bookingStatus === "pending" && booking.paymentStatus !== "paid";
  const canPayRemaining = booking.bookingStatus === "payment_approved" && booking.remainingAmount > 0;
  const partialLabel = booking.bookingStatus === "awaiting_admin_review"
    ? "Awaiting Admin Review"
    : booking.bookingStatus === "payment_held"
      ? "Payment On Hold"
      : booking.adminApproved
        ? "Advance Paid"
        : "Awaiting Booking Approval";
  const paymentLabel = booking.bookingStatus === "cancelled"
    ? "Booking Cancelled"
    : booking.paymentStatus === "paid"
      ? "Payment Completed"
      : canPayRemaining
        ? "Pay Remaining Amount"
        : booking.paymentStatus === "partial"
          ? partialLabel
          : "Pay Secure Advance";

  return (
    <View style={styles.bookingCard}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" }}
        style={styles.bookingHeroImage}
      />

      <View style={styles.bookingHeaderRow}>
        <View style={styles.bookingHeaderCopy}>
          <Text style={styles.bookingItemVendor}>{booking.vendorName}</Text>
          <Text style={styles.bookingItemCategory}>
            {booking.category} · {booking.eventType}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
            {prettyStatus(booking.bookingStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingMetaGrid}>
        <View style={styles.bookingMetaRow}>
          <MaterialIcons name="event" size={17} color="#FF4D6D" />
          <Text style={styles.bookingMetaText}>{dateLabel(booking.eventDate)}</Text>
        </View>
        <View style={styles.bookingMetaRow}>
          <MaterialIcons name="schedule" size={17} color="#FF4D6D" />
          <Text style={styles.bookingMetaText}>{booking.eventTime || "--"}</Text>
        </View>
        <View style={styles.bookingMetaRow}>
          <MaterialIcons name="location-on" size={17} color="#FF4D6D" />
          <Text style={styles.bookingMetaText}>{booking.city || "--"}</Text>
        </View>
        <View style={styles.bookingMetaRow}>
          <MaterialIcons name="currency-rupee" size={17} color="#FF4D6D" />
          <Text style={styles.bookingMetaText}>₹{booking.amount.toLocaleString("en-IN")}</Text>
        </View>
      </View>

      <View style={styles.paymentBox}>
        <View style={styles.paymentColumn}>
          <Text style={styles.paymentLabel}>Total Amount</Text>
          <Text style={styles.paymentValue}>₹{booking.amount.toLocaleString("en-IN")}</Text>
        </View>
        <View style={styles.paymentColumn}>
          <Text style={styles.paymentLabel}>Advance Paid</Text>
          <Text style={styles.paymentValue}>₹{booking.advancePaid.toLocaleString("en-IN")}</Text>
        </View>
        <View style={styles.paymentColumn}>
          <Text style={styles.paymentLabel}>Remaining</Text>
          <Text style={styles.remainingValue}>₹{booking.remainingAmount.toLocaleString("en-IN")}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !canPayAdvance && !canPayRemaining && styles.payButtonDisabled]}
        disabled={!canPayAdvance && !canPayRemaining}
        onPress={() => onPay(canPayRemaining ? "remaining" : "advance")}
      >
        <MaterialIcons name="credit-card" size={17} color={canPayAdvance || canPayRemaining ? "#FFFFFF" : "#8D6171"} />
        <Text style={[styles.payButtonText, !canPayAdvance && !canPayRemaining && styles.payButtonTextDisabled]}>{paymentLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.viewDetailsButton} onPress={onPress}>
        <MaterialIcons name="visibility" size={17} color="#FFFFFF" />
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}
