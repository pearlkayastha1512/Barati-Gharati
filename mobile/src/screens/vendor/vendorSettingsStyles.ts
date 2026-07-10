import { StyleSheet } from "react-native";
import { CAL_COLORS } from "../../constants/calendarTheme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CAL_COLORS.ivoryBg },
  scroll: { padding: 16, paddingBottom: 40 },

  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  heroPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 5,
    marginBottom: 12,
  },
  heroPillText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 18 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CAL_COLORS.baseText, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: CAL_COLORS.bodyRose, marginBottom: 14 },

  input: {
    borderWidth: 1,
    borderColor: CAL_COLORS.paleDivider,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: CAL_COLORS.baseText,
    marginBottom: 12,
  },

  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: CAL_COLORS.paleDivider,
  },
  toggleLabel: { fontSize: 14, fontWeight: "700", color: CAL_COLORS.baseText },
  toggleSubtext: { fontSize: 11, color: CAL_COLORS.bodyRose, marginTop: 2, flexShrink: 1 },

  dangerSection: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  dangerTitle: { fontSize: 16, fontWeight: "800", color: "#DC2626", marginBottom: 8 },
  dangerText: { fontSize: 12, color: CAL_COLORS.bodyRose, marginBottom: 14 },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  statusLabel: { fontSize: 14, fontWeight: "700", color: CAL_COLORS.baseText },
  statusSubtext: { fontSize: 11, color: CAL_COLORS.bodyRose, marginTop: 2 },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeText: { color: "#16A34A", fontSize: 12, fontWeight: "700" },

  dangerButton: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});