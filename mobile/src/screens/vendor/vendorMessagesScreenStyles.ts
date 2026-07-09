import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  header: { marginBottom: SPACING.lg },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  row: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, elevation: 1,
  },
  avatar: {
    width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight,
    justifyContent: "center", alignItems: "center", marginRight: SPACING.md,
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  content: { flex: 1 },
  nameRow: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  timestamp: { fontSize: 11, color: COLORS.textLight },
  lastMessage: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  unreadDot: {
    width: 9, height: 9, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, marginLeft: 8,
  },
});