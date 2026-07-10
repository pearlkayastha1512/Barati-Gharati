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
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 18 },

  grid: {
    flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16,
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  chartCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  chartCardTitle: { fontSize: 16, fontWeight: "800", color: CAL_COLORS.baseText },
  chartCardSubtitle: { fontSize: 12, color: CAL_COLORS.bodyRose, marginBottom: 16 },
  chartPill: {
    backgroundColor: CAL_COLORS.pinkIconBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chartPillText: { fontSize: 11, fontWeight: "700", color: CAL_COLORS.hoverDeep },
  greenPill: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  greenPillText: { fontSize: 11, fontWeight: "700", color: "#16A34A" },

  emptyChartBox: {
    borderRadius: 12,
    backgroundColor: CAL_COLORS.ivoryBg,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChartText: { fontSize: 13, color: CAL_COLORS.bodyRose },

  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  serviceCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceCardTitle: { fontSize: 16, fontWeight: "800", color: CAL_COLORS.baseText },
  serviceCardSubtitle: { fontSize: 12, color: CAL_COLORS.bodyRose, marginBottom: 16 },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: CAL_COLORS.paleDivider,
  },
  serviceIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: CAL_COLORS.pinkIconBg,
    alignItems: "center", justifyContent: "center",
    marginRight: 12,
  },
  serviceName: { fontSize: 13, fontWeight: "700", color: CAL_COLORS.baseText },
  serviceBookings: { fontSize: 11, color: CAL_COLORS.bodyRose, marginTop: 2 },
  serviceRevenue: { fontSize: 13, fontWeight: "700", color: CAL_COLORS.baseText },
  serviceRank: { fontSize: 11, color: "#16A34A", marginTop: 2 },

  insightsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  insightsTitle: { fontSize: 16, fontWeight: "800", color: CAL_COLORS.baseText, marginBottom: 12 },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CAL_COLORS.ivoryBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  insightText: { fontSize: 12, color: CAL_COLORS.baseText, marginLeft: 8, flex: 1 },
});