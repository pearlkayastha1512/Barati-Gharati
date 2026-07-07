import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";
// TODO: replace with categories actually booked, derived from the same source
// as WeddingProgressChecklist.tsx once a real getWeddingProgress() endpoint exists
const VENDOR_CATEGORIES = [
  { key: "Venue", done: false },
  { key: "Photographer", done: false },
  { key: "Decorator", done: false },
  { key: "Makeup", done: false },
  { key: "Caterer", done: false },
  { key: "DJ", done: false },
];

export function VendorsPreviewCard() {
  const navigation = useNavigation<any>();
  const bookedCount = VENDOR_CATEGORIES.filter((c) => c.done).length;

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
        {VENDOR_CATEGORIES.slice(0, 3).map((cat) => (
          <View key={cat.key} style={styles.previewVendorRow}>
            <MaterialIcons
              name={cat.done ? "check-circle" : "radio-button-unchecked"}
              size={16}
              color={cat.done ? "#C2185B" : "#ccc"}
            />
            <Text style={styles.previewVendorText}>{cat.key}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}