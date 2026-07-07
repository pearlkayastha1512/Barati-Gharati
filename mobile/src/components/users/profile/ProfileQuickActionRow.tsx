import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/ProfileScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ProfileQuickActionRow({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.quickActionRow} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons name={icon} size={20} color="#666" />
        <Text style={styles.quickActionLabel}>{label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}