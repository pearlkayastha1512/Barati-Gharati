import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { Booking } from "../../../types/booking";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";
import { downloadBookingInvoice } from "../../../api/bookings.api";
import { getVendorById } from "../../../api/vendor.api";

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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800";

const prettyStatus = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// Converts a raw arraybuffer to base64 without depending on `global`/`btoa`,
// which TypeScript's lib types don't recognize in this project.
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

export function BookingListItem({ booking, onPress, onPay }: { booking: Booking; onPress: () => void; onPay: (mode: "advance" | "remaining") => void }) {
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [vendorImage, setVendorImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getVendorById(String(booking.vendorId))
      .then((vendor) => {
        if (active && vendor?.image) setVendorImage(vendor.image);
      })
      .catch(() => {
        // silently fall back to the placeholder below if the vendor lookup fails
      });
    return () => {
      active = false;
    };
  }, [booking.vendorId]);

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
      <Image
        source={{ uri: vendorImage ?? FALLBACK_IMAGE }}
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