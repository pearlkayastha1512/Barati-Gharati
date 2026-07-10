import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

export const styles = StyleSheet.create({
  card: {
    flexBasis: "48%", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    marginBottom: SPACING.md, overflow: "hidden", elevation: 1,
  },
  imageWrapper: { width: "100%", height: 110, position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    width: "100%", height: "100%", backgroundColor: COLORS.background,
    justifyContent: "center", alignItems: "center",
  },
  deleteBtn: {
    position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center",
  },
  title: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 8, marginHorizontal: 10 },
  category: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, marginHorizontal: 10, marginBottom: 10 },
});