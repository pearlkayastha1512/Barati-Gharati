import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBookingStore } from "../../../store/bookingStore";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";

const VENDOR_CATEGORIES = [
  { key: "Venue", aliases: ["venue"] },
  { key: "Photography", aliases: ["photography", "photographer"] },
  { key: "Decorator", aliases: ["decorator", "decoration"] },
  { key: "Makeup", aliases: ["makeup", "makeup artist"] },
  { key: "Caterer", aliases: ["caterer", "catering"] },
  { key: "DJ", aliases: ["dj"] },
];

export function VendorsPreviewCard() {
  const navigation = useNavigation<any>();
  const bookings = useBookingStore((state) => state.bookings);
  const bookedCategories = bookings
    .filter((booking) => !["cancelled", "rejected"].includes(booking.bookingStatus))
    .map((booking) => booking.category.trim().toLowerCase());
  const categories = VENDOR_CATEGORIES.map((category) => ({
    ...category,
    done: category.aliases.some((alias) => bookedCategories.includes(alias)),
  }));
  const bookedCount = categories.filter((category) => category.done).length;

  return (
    <TouchableOpacity
      style={styles.previewCard}
      onPress={() => navigation.navigate("Vendors", { screen: "VendorList" })}
      activeOpacity={0.8}
    >
      <View style={styles.previewCardHeader}>
        <View style={[styles.previewIconCircle, { backgroundColor: "#FDEEF3" }]}>
          <MaterialIcons name="storefront" size={18} color="#C2185B" />
        </View>
        <Text style={styles.previewCardTitle}>Vendors</Text>
      </View>

      <Text style={styles.previewStatLabel}>Booking Status</Text>
      <Text style={styles.previewBigValue}>{bookedCount} / {VENDOR_CATEGORIES.length} Booked</Text>

      <View style={{ marginTop: 10 }}>
        {categories.slice(0, 3).map((cat) => (
          <View key={cat.key} style={styles.previewVendorRow}>
            <MaterialIcons
              name={cat.done ? "check-circle" : "radio-button-unchecked"}
              size={16}
              color={cat.done ? "#ff4d6d" : "#d9b9c4"}
            />
            <Text style={styles.previewVendorText}>{cat.key}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}
