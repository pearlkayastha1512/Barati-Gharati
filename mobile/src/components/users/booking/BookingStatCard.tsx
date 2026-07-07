import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sublabel: string;
};

export function BookingStatCard({ icon, iconBg, iconColor, label, value, sublabel }: Props) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTopRow}>
        <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon} size={18} color={iconColor} />
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