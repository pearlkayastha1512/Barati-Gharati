import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sublabel: string;
};

export function BudgetStatCard({ icon, iconColor, iconBg, label, value, sublabel }: Props) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTopRow}>
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