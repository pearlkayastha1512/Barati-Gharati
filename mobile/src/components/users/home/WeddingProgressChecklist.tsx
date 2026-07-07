import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/HomeScreen.styles";

// TODO: replace with categories actually booked/confirmed by the user,
// derived from getBudgetSummary() or a dedicated getWeddingProgress() endpoint —
// each category should be marked "done" once a vendor in that category is booked
const VENDOR_CATEGORIES = [
  { key: "Venue", done: false },
  { key: "Photographer", done: false },
  { key: "Decorator", done: false },
  { key: "Makeup", done: false },
  { key: "Caterer", done: false },
  { key: "DJ", done: false },
];

export function WeddingProgressChecklist() {
  const doneCount = VENDOR_CATEGORIES.filter((c) => c.done).length;
  const percent = Math.round((doneCount / VENDOR_CATEGORIES.length) * 100);

  return (
    <View style={styles.weddingProgressCard}>
      <Text style={styles.weddingProgressTitle}>Wedding Progress</Text>
      <Text style={styles.weddingProgressSubtitle}>Track your wedding planning</Text>

      <View style={styles.weddingProgressTopRow}>
        <Text style={styles.weddingProgressLabel}>Completion</Text>
        <Text style={styles.weddingProgressPercent}>{percent}%</Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: "#C2185B" }]} />
      </View>

      <View style={{ marginTop: 14 }}>
        {VENDOR_CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.key} style={styles.weddingProgressItem}>
            <MaterialIcons
              name={cat.done ? "check-circle" : "radio-button-unchecked"}
              size={20}
              color={cat.done ? "#C2185B" : "#ccc"}
            />
            <Text style={[styles.weddingProgressItemText, cat.done && styles.weddingProgressItemDone]}>
              {cat.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}