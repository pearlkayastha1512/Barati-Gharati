import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
}