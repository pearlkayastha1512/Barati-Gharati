import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { Platform } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  header: {
  paddingHorizontal: SPACING.lg,
  paddingTop: SPACING.md,
  paddingBottom: SPACING.md,
  backgroundColor: COLORS.background,
  borderBottomWidth: 1,
  borderBottomColor: "#F2F2F2",
},
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  addButton: {
    width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
  },

  // ---- Hero card ----
  heroCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    marginBottom: SPACING.md,
  },
  heroPillText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 26 },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: SPACING.sm, lineHeight: 18 },
  addServiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: SPACING.lg,
    gap: 6,
  },
  addServiceBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: "700" },

  // ---- Stats grid ----
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },

  // ---- Search + category filter row ----
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8, default: 10 }),
    borderWidth: 1,
    borderColor: "#EEE",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
  },
  categoryFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    minWidth: 110,
    marginLeft: 8,
  },
  categoryFilterBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
    maxWidth: 90,
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryModalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    width: "80%",
    maxHeight: "70%",
    paddingVertical: 8,
  },
  categoryModalList: {
    paddingHorizontal: 4,
  },
  categoryModalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
  },
  categoryModalItemSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryModalItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryModalItemTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },

  // ---- "Add New Service" card ----
  addNewCard: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderStyle: "dashed",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  addNewIconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  addNewTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  addNewSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  createServiceBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  createServiceBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  // ---- Existing service card / status / fab (kept as-is) ----
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