import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/ProfileScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  sublabel: string;
};

export function ProfileStatTile({ icon, iconBg, iconColor, label, value, sublabel }: Props) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSublabel}>{sublabel}</Text>
    </View>
  );
}