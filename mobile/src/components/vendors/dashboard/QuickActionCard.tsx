import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function QuickActionCard({ icon, title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 1,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});