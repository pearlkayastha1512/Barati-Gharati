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
  addServiceBtn: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#fff", borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 10, marginTop: SPACING.lg, gap: 6,
  },
  addServiceBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: "700" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: SPACING.sm },

  searchFilterRow: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.lg, gap: 10 },
  searchWrapper: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, paddingHorizontal: 12, height: 44, gap: 8, elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },

  addNewCard: {
    borderWidth: 1, borderColor: COLORS.primary, borderStyle: "dashed",
    borderRadius: RADIUS.xl, alignItems: "center", padding: SPACING.xl, marginTop: SPACING.sm,
  },
  addNewIconCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background,
    alignItems: "center", justifyContent: "center", marginBottom: SPACING.md,
  },
  addNewTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 6 },
  addNewSubtitle: { fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginBottom: SPACING.lg, lineHeight: 18 },
  createServiceBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 12 },
  createServiceBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});