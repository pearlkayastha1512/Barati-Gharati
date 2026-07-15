import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.78;

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(25,20,25,0.45)",
  },

  sidebar: {
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "#FFF9F6",
    paddingTop: SPACING.xxl,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 6,
      height: 0,
    },
    elevation: 20,
  },

  header: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E6E1",
  },

  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B59AA8",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  navList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,
    paddingHorizontal: 18,

    borderRadius: 18,
    marginBottom: 8,

    backgroundColor: "transparent",
  },

  navItemText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 14,
    flex: 1,
  },

  supportBox: {
    marginHorizontal: SPACING.lg,
    marginTop: "auto",
    marginBottom: SPACING.lg,

    backgroundColor: "#FFF2D9",

    borderRadius: 22,

    paddingHorizontal: 18,
    paddingVertical: 18,

    borderWidth: 1,
    borderColor: "#FFE1A6",

    shadowColor: "#F4A100",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 6,
  },

  supportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textHeading,
  },

  supportSubtitle: {
    marginTop: 8,
    marginBottom: 18,

    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textMuted,
  },

  supportButton: {
    backgroundColor: COLORS.primary,

    borderRadius: 16,

    paddingVertical: 13,

    alignItems: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.30,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },

  supportButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  logoContainer: {
  width: 175,
  height: 110,

  borderRadius: 24,

  justifyContent: "center",
  alignItems: "center",

  marginBottom: 24,

  shadowColor: COLORS.primary,
  shadowOpacity: 0.30,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 8,
  },


  elevation: 12,
},
sectionWrap: {
  paddingHorizontal: SPACING.xl,
},

logo: {
  width: 180,
  height: 65,
  marginBottom: 18,
},



  logoutButton: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,

    paddingHorizontal: 18,
    paddingVertical: 14,

    borderRadius: 18,
  },

  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  divider: {
  width: "88%",
  height: 1,
  backgroundColor: "#F2E6E2",
  marginBottom: 18,
},
});