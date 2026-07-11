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
 actionContainer: {
  position: "absolute",
  top: 8,
  right: 8,
  flexDirection: "row",
  alignItems: "center",
},

editBtn: {
  width: 28,
  height: 28,
  borderRadius: RADIUS.full,
  backgroundColor: "#4F46E5",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

deleteBtn: {
  width: 28,
  height: 28,
  borderRadius: RADIUS.full,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
  title: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 8, marginHorizontal: 10 },
  category: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, marginHorizontal: 10, marginBottom: 10 },
});