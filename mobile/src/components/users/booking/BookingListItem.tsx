import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { Booking } from "../../../types/booking";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";
import { downloadBookingInvoice } from "../../../api/bookings.api";
import { getVendorById } from "../../../api/vendor.api";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FFF3B0", text: "#6C2D45" },

  matching: { bg: "#E0F2FE", text: "#0369A1" },

  waiting_primary_vendor: {
    bg: "#E0F2FE",
    text: "#0369A1",
  },

  primary_accepted: {
    bg: "#DCFCE7",
    text: "#15803D",
  },

  waiting_payment: {
    bg: "#FEF3C7",
    text: "#92400E",
  },

  primary_rejected: {
    bg: "#FEE2E2",
    text: "#B91C1C",
  },

  promote_standby: {
    bg: "#F3E8FF",
    text: "#7E22CE",
  },

  standby_accepted: {
    bg: "#DCFCE7",
    text: "#15803D",
  },

  advance_paid: {
    bg: "#DBEAFE",
    text: "#2563EB",
  },

  accepted: {
    bg: "#DCFCE7",
    text: "#15803D",
  },

  in_progress: {
    bg: "#DBEAFE",
    text: "#2563EB",
  },

  event_completed: {
    bg: "#E0E7FF",
    text: "#4338CA",
  },

  awaiting_admin_review: {
    bg: "#F3E8FF",
    text: "#7E22CE",
  },

  payment_approved: {
    bg: "#DCFCE7",
    text: "#15803D",
  },

  payment_held: {
    bg: "#FEE2E2",
    text: "#B91C1C",
  },

  review_pending: {
    bg: "#FDF2F8",
    text: "#BE185D",
  },

  completed: {
    bg: "#D1FAE5",
    text: "#047857",
  },

  closed: {
    bg: "#D1FAE5",
    text: "#047857",
  },

  rejected: {
    bg: "#FEE2E2",
    text: "#B91C1C",
  },

  cancelled: {
    bg: "#FEE2E2",
    text: "#B91C1C",
  },
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800";

const prettyStatus = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let result = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    result +=
      BASE64_CHARS[bytes[i] >> 2] +
      BASE64_CHARS[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)] +
      BASE64_CHARS[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)] +
      BASE64_CHARS[bytes[i + 2] & 63];
  }
  const remaining = bytes.length - i;
  if (remaining === 1) {
    result +=
      BASE64_CHARS[bytes[i] >> 2] + BASE64_CHARS[(bytes[i] & 3) << 4] + "==";
  } else if (remaining === 2) {
    result +=
      BASE64_CHARS[bytes[i] >> 2] +
      BASE64_CHARS[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)] +
      BASE64_CHARS[(bytes[i + 1] & 15) << 2] +
      "=";
  }
  return result;
}

type Props = {
  booking: Booking;
  onPress: () => void;
  onPay: (mode: "advance" | "remaining") => void;
  onWriteReview: () => void; // NEW
};

export function BookingListItem({ booking, onPress, onPay, onWriteReview }: Props) {
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [vendorImage, setVendorImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getVendorById(String(booking.vendorId))
      .then((vendor) => {
        if (active && vendor?.image) setVendorImage(vendor.image);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [booking.vendorId]);

  console.log("Booking Status =", booking.bookingStatus);

const statusStyle =
  STATUS_COLORS[booking.bookingStatus as keyof typeof STATUS_COLORS] ?? {
    bg: "#DCFCE7",
    text: "#15803D",
  };
 const canPayAdvance =
  booking.bookingStatus === "waiting_payment";

const canPayRemaining =
  booking.bookingStatus === "payment_approved" &&
  booking.remainingAmount > 0;

const canWriteReview =
  booking.bookingStatus === "event_completed";

  const partialLabel = booking.bookingStatus === "awaiting_admin_review"
    ? "Awaiting Admin Review"
    : booking.bookingStatus === "payment_held"
      ? "Payment On Hold"
      : booking.adminApproved
        ? "Advance Paid"
        : "Awaiting Booking Approval";
  let paymentLabel = "Waiting...";

if (booking.bookingStatus === "cancelled") {
  paymentLabel = "Booking Cancelled";
}
else if (booking.bookingStatus === "matching") {
  paymentLabel = "Finding Best Vendor";
}
else if (booking.bookingStatus === "waiting_primary_vendor") {
  paymentLabel = "Waiting Vendor Response";
}
else if (booking.bookingStatus === "primary_accepted") {
  paymentLabel = "Vendor Accepted";
}
else if (booking.bookingStatus === "waiting_payment") {
  paymentLabel = "Pay Secure Advance";
}
else if (booking.bookingStatus === "advance_paid") {
  paymentLabel = "Advance Paid";
}
else if (booking.bookingStatus === "accepted") {
  paymentLabel = "Booking Confirmed";
}
else if (booking.bookingStatus === "event_completed") {
  paymentLabel = "Write Review";
}
else if (booking.bookingStatus === "awaiting_admin_review") {
  paymentLabel = "Review Under Approval";
}
else if (booking.bookingStatus === "payment_approved") {
  paymentLabel = "Pay Remaining Amount";
}
else if (booking.bookingStatus === "payment_held") {
  paymentLabel = "Payment On Hold";
}
else if (booking.bookingStatus === "review_pending") {
  paymentLabel = "Review Pending";
}
else if (
  booking.bookingStatus === "completed" ||
  booking.bookingStatus === "closed"
) {
  paymentLabel = "Booking Completed";
}
else if (booking.bookingStatus === "rejected") {
  paymentLabel = "Booking Rejected";
}

  const handleDownloadInvoice = async () => {
    if (downloadingInvoice) return;
    setDownloadingInvoice(true);
    try {
      const data = await downloadBookingInvoice(String(booking.id));
      const base64 = arrayBufferToBase64(data);
      const fileUri = `${FileSystem.cacheDirectory}invoice-${booking.bookingNumber}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Booking Invoice",
        });
      } else {
        Alert.alert("Invoice Downloaded", `Saved to: ${fileUri}`);
      }
    } catch (error) {
      console.log("DOWNLOAD INVOICE ERROR =>", error);
      Alert.alert("Download Failed", "Unable to download the invoice. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  return (
    <View style={styles.bookingCard}>
      <Image source={{ uri: vendorImage ?? FALLBACK_IMAGE }} style={styles.bookingHeroImage} />

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

      {/* NEW: Write Review CTA — shows only right after vendor marks event complete */}
      {canWriteReview && (
        <TouchableOpacity style={styles.reviewButton} onPress={onWriteReview}>
          <MaterialIcons name="rate-review" size={17} color="#FFFFFF" />
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      )}

      {/* NEW: Pending badge — review already submitted, waiting on admin */}
      {booking.bookingStatus === "awaiting_admin_review" && (
        <View style={styles.pendingReviewBadge}>
          <MaterialIcons name="hourglass-empty" size={14} color="#7E22CE" />
          <Text style={styles.pendingReviewText}>Review submitted — awaiting admin approval</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.payButton, !canPayAdvance && !canPayRemaining && styles.payButtonDisabled]}
        disabled={!canPayAdvance && !canPayRemaining}
        onPress={() => onPay(canPayRemaining ? "remaining" : "advance")}
      >
        <MaterialIcons name="credit-card" size={17} color={canPayAdvance || canPayRemaining ? "#FFFFFF" : "#8D6171"} />
        <Text style={[styles.payButtonText, !canPayAdvance && !canPayRemaining && styles.payButtonTextDisabled]}>{paymentLabel}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={[styles.viewDetailsButton, { flex: 1 }]} onPress={onPress}>
          <MaterialIcons name="visibility" size={17} color="#FFFFFF" />
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewDetailsButton, { flex: 1, opacity: downloadingInvoice ? 0.7 : 1 }]}
          onPress={handleDownloadInvoice}
          disabled={downloadingInvoice}
        >
          {downloadingInvoice ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons name="download" size={17} color="#FFFFFF" />
          )}
          <Text style={styles.viewDetailsText}>{downloadingInvoice ? "Downloading..." : "Invoice"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}