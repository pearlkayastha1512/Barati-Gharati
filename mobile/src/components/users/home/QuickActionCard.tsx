import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./HomeCards.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function QuickActionCard({ icon, title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={styles.quickActionIconCircle}>
        <MaterialIcons name={icon} size={24} color="#ff4d6d" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      <View style={styles.quickActionOpenRow}>
        <Text style={styles.quickActionOpen}>Open</Text>
        <MaterialIcons name="arrow-forward" size={15} color="#ff4d6d" />
      </View>
    </TouchableOpacity>
  );
}
