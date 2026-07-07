import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./HomeCards.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
  onPress?: () => void;
};

export function StatCard({ icon, label, value, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress} disabled={!onPress}>
      <View style={styles.statIconCircle}>
        <MaterialIcons name={icon} size={20} color="#C2185B" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}