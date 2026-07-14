import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/VendorDetailsScreen.styles";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

export function AmenityItem({ icon, label }: Props) {
  return (
    <View style={styles.amenityItem}>
      <MaterialIcons name={icon} size={18} color="#FF4D6D" />
      <Text style={styles.amenityText}>{label}</Text>
    </View>
  );
}
