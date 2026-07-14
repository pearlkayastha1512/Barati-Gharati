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
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {!!description && <Text style={styles.toggleDescription}>{description}</Text>}
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
