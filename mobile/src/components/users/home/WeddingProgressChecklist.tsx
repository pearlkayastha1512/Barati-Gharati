import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/HomeScreen.styles";

const VENDOR_CATEGORIES = [
  { key: "Venue", aliases: ["venue"] },
  { key: "Photography", aliases: ["photography", "photographer"] },
  { key: "Decorator", aliases: ["decorator", "decoration"] },
  { key: "Makeup", aliases: ["makeup", "makeup artist"] },
  { key: "Caterer", aliases: ["caterer", "catering"] },
  { key: "DJ", aliases: ["dj"] },
];

type Props = {
  bookedCategories: string[];
};

export function WeddingProgressChecklist({ bookedCategories }: Props) {
  const normalizedBookings = bookedCategories.map((category) => category.trim().toLowerCase());
  const categories = VENDOR_CATEGORIES.map((category) => ({
    ...category,
    done: category.aliases.some((alias) => normalizedBookings.includes(alias)),
  }));
  const doneCount = categories.filter((category) => category.done).length;
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
        <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: "#ff4d6d" }]} />
      </View>

      <View style={{ marginTop: 14 }}>
        {categories.map((cat) => (
          <View key={cat.key} style={styles.weddingProgressItem}>
            <MaterialIcons
              name={cat.done ? "check-circle" : "radio-button-unchecked"}
              size={20}
              color={cat.done ? "#ff4d6d" : "#ffcad3"}
            />
            <Text style={[styles.weddingProgressItemText, cat.done && styles.weddingProgressItemDone]}>
              {cat.key}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
