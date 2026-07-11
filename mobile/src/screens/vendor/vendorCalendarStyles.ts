import { StyleSheet } from "react-native";
import { CAL_COLORS } from "../../constants/calendarTheme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CAL_COLORS.ivoryBg },
  scroll: { padding: 16, paddingBottom: 40 },

  // Hero
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  heroPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 5,
    marginBottom: 12,
  },
  heroPillText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30, marginBottom: 8 },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 18 },

  grid: {
    flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16,
  },

  // Collapsible calendar card
  sectionCardWrap: {
    backgroundColor: CAL_COLORS.ivoryBgLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CAL_COLORS.peachBorder,
    marginBottom: 16,
    overflow: "hidden",
  },
  calendarHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  calendarHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  calendarIconBox: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: CAL_COLORS.pinkIconBg,
    alignItems: "center", justifyContent: "center",
  },
  calendarHeaderTitle: { fontSize: 15, fontWeight: "700", color: CAL_COLORS.headingPlum },
  calendarHeaderSubtitle: { fontSize: 12, color: CAL_COLORS.bodyRose, marginTop: 2 },
  calendarBody: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  calendarInner: {
    borderRadius: 12,
    overflow: "hidden",
  },

  selectedDateBox: {
    marginTop: 12, backgroundColor: "#fff",
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: CAL_COLORS.paleDivider,
  },
  selectedDateLabel: { fontSize: 12, color: CAL_COLORS.bodyRose },
  selectedDateValue: { fontSize: 15, fontWeight: "700", color: CAL_COLORS.baseText, marginTop: 2 },
  blockedTag: {
    marginTop: 8, alignSelf: "flex-start",
    backgroundColor: CAL_COLORS.yellowHover,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  blockedTagText: { fontSize: 11, fontWeight: "700", color: CAL_COLORS.blocked },

  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 13, color: CAL_COLORS.navText },
  progressValue: { fontSize: 13, fontWeight: "700", color: CAL_COLORS.available },
  progressBarTrack: {
    height: 8, borderRadius: 4, backgroundColor: CAL_COLORS.paleDivider, overflow: "hidden", marginBottom: 16,
  },
  progressBarFill: { height: 8, backgroundColor: CAL_COLORS.available, borderRadius: 4 },

  availabilityRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: CAL_COLORS.paleDivider,
  },
  availabilityLabel: { flex: 1, fontSize: 13, color: CAL_COLORS.navText },
  availabilityValue: { fontSize: 14, fontWeight: "700", color: CAL_COLORS.baseText },

  manageButton: {
    marginTop: 16, backgroundColor: CAL_COLORS.primary,
    borderRadius: 12, paddingVertical: 14, alignItems: "center",
  },
  manageButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  upcomingRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: CAL_COLORS.paleDivider,
  },
  upcomingName: { fontSize: 14, fontWeight: "600", color: CAL_COLORS.baseText },
  upcomingDate: { fontSize: 13, color: CAL_COLORS.bodyRose },
});