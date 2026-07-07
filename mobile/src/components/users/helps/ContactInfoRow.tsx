import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/HelpSupportScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  lines: string[];
};

export function ContactInfoRow({ icon, label, lines }: Props) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconCircle}>
        <MaterialIcons name={icon} size={20} color="#C2185B" />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        {lines.map((line, i) => (
          <Text key={i} style={styles.infoValue}>{line}</Text>
        ))}
      </View>
    </View>
  );
}