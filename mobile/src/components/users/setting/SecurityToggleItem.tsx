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
        <MaterialIcons name={icon} size={18} color="#666" />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securityDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#e0e0e0", true: "#C2185B" }}
        thumbColor="#fff"
      />
    </View>
  );
}