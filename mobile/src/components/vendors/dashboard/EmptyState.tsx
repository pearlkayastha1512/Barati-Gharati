import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  message: string;
};

export function EmptyState({ icon, message }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={28} color={COLORS.textLight} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
});