import React from "react";
import { View, Text, Switch } from "react-native";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
};

export function ToggleRow({ label, description, value, onToggle }: Props) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {!!description && <Text style={styles.toggleDescription}>{description}</Text>}
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