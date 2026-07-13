import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },

 header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: SPACING.lg,
},

menuButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

headerContent: {
  flex: 1,
  marginHorizontal: 12,
},

headerTitle: {
  fontSize: 22,
  fontWeight: "800",
  color: COLORS.text,
},

headerSubtitle: {
  fontSize: 12,
  color: COLORS.textMuted,
  marginTop: 2,
},

bellButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#FCE4EC",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },

  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: SPACING.md,
  },

  heroPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 5,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  heroButtonRow: {
    flexDirection: "row",
    gap: 10,
  },

  heroButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },

  heroButtonPrimaryText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  heroButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  heroButtonSecondaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  monthCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 1,
  },

  monthCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  chatbotButton: {
  position: "absolute",
  bottom: 30,
  right: 20,
  width: 62,
  height: 62,
  borderRadius: 31,

  backgroundColor: COLORS.primary,

  alignItems: "center",
  justifyContent: "center",

  elevation: 8,

  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 4,
  },
},

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  monthLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  monthValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  sectionSubheading: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },

  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  performanceItem: {
    flexBasis: "48%",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  performanceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  performanceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  upcomingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  upcomingName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },

  upcomingDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  revenueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  revenueLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  revenueValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  reviewName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  reviewComment: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  seeAll: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
});