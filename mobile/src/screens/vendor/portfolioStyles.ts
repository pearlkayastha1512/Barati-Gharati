import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },

  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md, paddingBottom: SPACING.sm,
  },
  backButton: {
    width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.surface,
    justifyContent: "center", alignItems: "center", marginRight: SPACING.sm, elevation: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  heroCard: { borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.lg },
  heroPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: SPACING.md,
  },
  heroPillText: { color: "#fff", fontSize: 11, fontWeight: "600", marginLeft: 5 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30 },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: SPACING.sm, marginBottom: SPACING.lg },

  heroStatsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.lg },
  heroStatValue: { color: "#fff", fontSize: 20, fontWeight: "800" },
  heroStatLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },

  uploadBtn: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "#fff",
    borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 10, gap: 6,
  },
  uploadBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  searchRow: { marginTop: SPACING.sm, marginBottom: SPACING.lg },
  searchWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, gap: 8, elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: SPACING.xxl,
    alignItems: "center", marginBottom: SPACING.lg, elevation: 1,
  },
  emptyTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  emptySubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: SPACING.lg },

  uploadNewCard: {
    borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.primary + "55",
    backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xxl, alignItems: "center",
  },
  uploadNewIconCircle: {
    width: 56, height: 56, borderRadius: RADIUS.full, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", marginBottom: SPACING.md, elevation: 1,
  },
  uploadNewTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  uploadNewSubtitle: {
    fontSize: 12, color: COLORS.textMuted, textAlign: "center",
    marginTop: 6, marginBottom: SPACING.lg, paddingHorizontal: SPACING.xl,
  },
  uploadNewBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 11 },
  uploadNewBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});