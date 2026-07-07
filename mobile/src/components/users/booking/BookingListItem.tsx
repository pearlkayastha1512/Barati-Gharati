import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Booking } from "../../../store/bookingStore";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";

const STATUS_COLORS: Record<Booking["status"], { bg: string; text: string }> = {
  upcoming: { bg: "#FEF6E0", text: "#D9A404" },
  pending: { bg: "#FDEEF3", text: "#C2185B" },
  completed: { bg: "#E8F8F0", text: "#22B07D" },
  cancelled: { bg: "#FDECEC", text: "#E53935" },
};

export function BookingListItem({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const statusStyle = STATUS_COLORS[booking.status];
  return (
    <TouchableOpacity style={styles.bookingItem} onPress={onPress}>
      <Image source={{ uri: booking.image }} style={styles.bookingItemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.bookingItemVendor}>{booking.vendorName}</Text>
        <Text style={styles.bookingItemCategory}>{booking.vendorCategory}</Text>
        <View style={styles.bookingItemDateRow}>
          <MaterialIcons name="event" size={12} color="#999" />
          <Text style={styles.bookingItemDate}>{booking.date} · {booking.time}</Text>
        </View>
      </View>
      <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}