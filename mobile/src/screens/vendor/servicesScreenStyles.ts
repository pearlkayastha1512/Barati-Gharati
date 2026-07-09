import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.lg },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  addButton: {
    width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
  },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.md, elevation: 1,
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  serviceName: { fontSize: 15, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 8 },
  serviceCategory: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  servicePrice: { fontSize: 15, fontWeight: "800", color: COLORS.primary, marginTop: SPACING.sm },

  statusBadge: {
    alignSelf: "flex-start", borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: SPACING.sm,
  },
  statusActive: { backgroundColor: COLORS.successLight },
  statusActiveText: { color: COLORS.success, fontSize: 11, fontWeight: "700" },
  statusInactive: { backgroundColor: "#F0F0F0" },
  statusInactiveText: { color: COLORS.textMuted, fontSize: 11, fontWeight: "700" },

  fab: {
    position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 4,
  },
});