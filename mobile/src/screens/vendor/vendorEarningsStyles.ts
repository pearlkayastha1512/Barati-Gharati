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
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30, marginBottom: 8 },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 18, marginBottom: 16 },

  heroStatsRow: { flexDirection: "row", gap: 32, marginBottom: 16 },
  heroStatLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  heroStatValue: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 },

  pendingBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 14,
  },
  pendingIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  pendingLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  pendingValue: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 2 },
  pendingSubtext: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4 },

  grid: {
    flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16,
  },

  miniStatsRow: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16,
  },
  miniStat: {
    flexBasis: "48%",
    borderRadius: 12,
    padding: 12,
  },
  miniStatIconBox: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  miniStatLabel: { fontSize: 11, color: CAL_COLORS.bodyRose },
  miniStatValue: { fontSize: 15, fontWeight: "800", color: CAL_COLORS.baseText, marginTop: 2 },
  miniStatSublabel: { fontSize: 10, color: CAL_COLORS.supportText, marginTop: 2 },

  payoutIconRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  payoutIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: CAL_COLORS.pinkIconBg,
    alignItems: "center", justifyContent: "center",
  },
  payoutLabel: { fontSize: 12, color: CAL_COLORS.bodyRose },
  payoutAmount: { fontSize: 26, fontWeight: "800", color: CAL_COLORS.headingPlum, marginTop: 4 },
  payoutDateRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  payoutDateText: { fontSize: 12, color: CAL_COLORS.bodyRose },

  includedPaymentsRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: CAL_COLORS.paleDivider,
  },
  includedPaymentsLabel: { fontSize: 13, color: CAL_COLORS.navText },
  includedPaymentsValue: { fontSize: 14, fontWeight: "700", color: CAL_COLORS.baseText },

  viewDetailsButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: CAL_COLORS.hoverDeep,
    borderRadius: 12, paddingVertical: 14, marginTop: 16,
  },
  viewDetailsText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  transactionRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: CAL_COLORS.paleDivider,
  },
  transactionName: { fontSize: 14, fontWeight: "600", color: CAL_COLORS.baseText },
  transactionEvent: { fontSize: 12, color: CAL_COLORS.bodyRose, marginTop: 2 },
  transactionTotal: { fontSize: 14, fontWeight: "700", color: CAL_COLORS.baseText },
  transactionStatus: { fontSize: 11, color: CAL_COLORS.bodyRose, marginTop: 2 },
});