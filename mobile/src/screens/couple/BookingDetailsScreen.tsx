import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useBookingStore } from "../../store/bookingStore";
import { PaymentCheckoutModal } from "../../components/users/booking/PaymentCheckoutModal";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const pretty = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function BookingDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { selectedBooking, isLoading, isSubmitting, error, loadBooking, cancel } = useBookingStore();
  const bookingId = String(route.params?.bookingId ?? "");
  const [paymentMode, setPaymentMode] = useState<"advance" | "remaining" | null>(null);

  useEffect(() => {
    loadBooking(bookingId);
  }, [bookingId, loadBooking]);

  const confirmCancel = () => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "Keep Booking", style: "cancel" },
      {
        text: "Cancel Booking",
        style: "destructive",
        onPress: async () => {
          const success = await cancel(bookingId, "Cancelled by customer");
          if (success) Alert.alert("Booking Cancelled", "Your booking has been cancelled.");
        },
      },
    ]);
  };

  if (isLoading && !selectedBooking) {
    return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#FF4D6D" /></SafeAreaView>;
  }

  if (error || !selectedBooking) {
    return <SafeAreaView style={styles.center}><Text style={styles.error}>{error ?? "Booking not found."}</Text><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backLink}>Go Back</Text></TouchableOpacity></SafeAreaView>;
  }

  const booking = selectedBooking;
  const canCancel = !["cancelled", "completed", "payment_approved"].includes(booking.bookingStatus);
  const canPayAdvance = booking.advancePaid <= 0 && booking.bookingStatus === "pending" && booking.paymentStatus !== "paid";
  const canPayRemaining = booking.bookingStatus === "payment_approved" && booking.remainingAmount > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#3F1D2F" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Booking Details</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>BOOKING #{booking.bookingNumber}</Text>
          <Text style={styles.heroTitle}>{booking.vendorName}</Text>
          <Text style={styles.heroSub}>{booking.category} · {booking.eventType}</Text>
          <View style={styles.status}><Text style={styles.statusText}>{pretty(booking.bookingStatus)}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vendor Information</Text>
          <Row icon="storefront" label="Vendor" value={booking.vendorName} />
          <Row icon="inventory-2" label="Package" value={booking.packageName} />
          <Row icon="event" label="Event Date" value={new Date(booking.eventDate).toLocaleDateString("en-IN")} />
          <Row icon="location-on" label="City" value={booking.city || "--"} />
          <Row icon="groups" label="Guests" value={String(booking.guests)} />
        </View>

        {(canPayAdvance || canPayRemaining) && (
          <TouchableOpacity style={styles.payButton} onPress={() => setPaymentMode(canPayRemaining ? "remaining" : "advance")}>
            <MaterialIcons name="credit-card" size={18} color="#FFFFFF" />
            <Text style={styles.payText}>{canPayRemaining ? "Pay Remaining Amount" : "Pay Secure Advance"}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event & Contact Details</Text>
          <Row icon="person" label="Primary Person" value={booking.primaryPersonName || booking.customerName} />
          <Row icon="phone" label="Phone" value={booking.customerPhone} />
          <Row icon="email" label="Email" value={booking.customerEmail} />
          <Row icon="celebration" label="Theme" value={booking.eventTheme || booking.weddingTheme || "--"} />
          <Row icon="notes" label="Requirements" value={booking.specialRequirements || "--"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Information</Text>
          <PaymentRow label="Total Amount" value={money(booking.amount)} />
          <PaymentRow label="Advance Paid" value={money(booking.advancePaid)} />
          <PaymentRow label="Remaining" value={money(booking.remainingAmount)} accent />
          <PaymentRow label="Payment Status" value={pretty(booking.paymentStatus)} />
        </View>

        {canCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={confirmCancel} disabled={isSubmitting}>
            <MaterialIcons name="cancel" size={18} color="#E63B5F" />
            <Text style={styles.cancelText}>{isSubmitting ? "Cancelling..." : "Cancel Booking"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <PaymentCheckoutModal
        booking={booking}
        mode={paymentMode ?? "advance"}
        visible={paymentMode !== null}
        onClose={() => setPaymentMode(null)}
        onPaid={() => loadBooking(bookingId)}
      />
    </SafeAreaView>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return <View style={styles.row}><MaterialIcons name={icon} size={18} color="#FF4D6D" /><View style={styles.rowCopy}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View></View>;
}

function PaymentRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <View style={styles.paymentRow}><Text style={styles.paymentLabel}>{label}</Text><Text style={[styles.paymentValue, accent && styles.paymentAccent]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" }, content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }, error: { color: "#E63B5F", textAlign: "center" }, backLink: { marginTop: 14, color: "#FF4D6D", fontWeight: "700" },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }, iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" }, topTitle: { color: "#3F1D2F", fontSize: 18, fontWeight: "800" },
  hero: { borderRadius: 26, padding: 22, backgroundColor: "#FF4D6D", marginBottom: 18 }, eyebrow: { color: "#FFF3B0", fontSize: 11, fontWeight: "700" }, heroTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", marginTop: 10 }, heroSub: { color: "#FFE6EB", marginTop: 5 }, status: { alignSelf: "flex-start", backgroundColor: "#FFF8D8", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginTop: 16 }, statusText: { color: "#6C2D45", fontSize: 12, fontWeight: "700" },
  card: { borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#FFB3BF", backgroundColor: "#FFFDF0", marginBottom: 16 }, cardTitle: { color: "#3F1D2F", fontSize: 17, fontWeight: "800", marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 11, paddingVertical: 9 }, rowCopy: { flex: 1 }, rowLabel: { color: "#8D6171", fontSize: 11 }, rowValue: { color: "#3F1D2F", fontSize: 13, fontWeight: "600", marginTop: 2 },
  paymentRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#FFE6EB" }, paymentLabel: { color: "#8D6171" }, paymentValue: { color: "#3F1D2F", fontWeight: "700" }, paymentAccent: { color: "#E63B5F" },
  cancelButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, borderWidth: 1, borderColor: "#FFB3BF", paddingVertical: 14, backgroundColor: "#FFFDF0" }, cancelText: { color: "#E63B5F", fontWeight: "700" },
  payButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, paddingVertical: 15, backgroundColor: "#FF4D6D", marginBottom: 14 }, payText: { color: "#FFFFFF", fontWeight: "800" },
});
