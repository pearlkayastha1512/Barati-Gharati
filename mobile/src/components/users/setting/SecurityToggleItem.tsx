import React from "react";
import { View, Text, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
};

export function SecurityToggleItem({ icon, title, description, value, onToggle }: Props) {
  return (
    <View style={styles.securityItem}>
      <View style={styles.securityIconCircle}>
        <MaterialIcons name={icon} size={18} color="#ff4d6d" />
      </View>
      <View style={styles.securityCopy}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securityDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#ffcad3", true: "#ff4d6d" }}
        thumbColor="#fffef7"
      />
    </View>
  );
}
