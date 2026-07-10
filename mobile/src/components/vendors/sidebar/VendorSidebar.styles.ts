import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xxl,
  },
  header: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  logoText: { fontSize: 18, fontWeight: "800", color: COLORS.primary, marginBottom: SPACING.md },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: COLORS.textLight, letterSpacing: 1 },

  navList: { paddingHorizontal: SPACING.sm },
  navItem: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.md,
    paddingVertical: 12, gap: 14,
  },
  navItemText: { fontSize: 14, fontWeight: "600", color: COLORS.text },

  supportBox: {
    marginHorizontal: SPACING.lg, marginTop: "auto", marginBottom: SPACING.md,
    padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.primaryLight,
  },
  supportTitle: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  supportSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.md },
  supportButton: {
    backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.md,
    paddingVertical: 10, alignItems: "center",
  },
  supportButtonText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  logoutButton: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, marginBottom: SPACING.md,
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
});