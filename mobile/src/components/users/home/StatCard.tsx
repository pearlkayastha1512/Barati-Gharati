import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./HomeCards.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  label: string;
  value: string | number;
  onPress?: () => void;
};

export function StatCard({ icon, title, label, value, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress} disabled={!onPress}>
      <View style={styles.statIconCircle}>
        <MaterialIcons name={icon} size={22} color="#ff4d6d" />
      </View>
      <MaterialIcons name="trending-up" size={17} color="#ff4d6d" style={styles.statTrendIcon} />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}