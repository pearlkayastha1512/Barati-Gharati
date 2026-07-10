import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, marginBottom: SPACING.md },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },

  heroCard: { borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.lg },
  heroPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: SPACING.md, gap: 5,
  },
  heroPillText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30, marginBottom: SPACING.sm },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 19 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: SPACING.sm },

  searchFilterRow: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg, gap: 10 },
  searchWrapper: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, paddingHorizontal: 12, height: 44, gap: 8, elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },

  tableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    elevation: 1,
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xs,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});