import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
  sublabel: string;
};

export function ChecklistStatCard({ icon, label, value, sublabel }: Props) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTopRow}>
        <View style={styles.statIconCircle}>
          <MaterialIcons name={icon} size={18} color="#C2185B" />
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSublabel}>{sublabel}</Text>
    </View>
  );
}