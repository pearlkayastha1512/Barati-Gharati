import { StyleSheet } from "react-native";
import { CAL_COLORS } from "../../../constants/calendarTheme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(50,24,39,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: CAL_COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: CAL_COLORS.headingPlum,
  },
  selectedDateLabel: {
    fontSize: 12,
    color: CAL_COLORS.bodyRose,
    marginBottom: 2,
  },
  selectedDateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: CAL_COLORS.baseText,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: CAL_COLORS.navText,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: CAL_COLORS.peachBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: CAL_COLORS.baseText,
    marginBottom: 16,
    backgroundColor: CAL_COLORS.ivoryBgLight,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CAL_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 20,
  },
  unblockButton: {
    backgroundColor: CAL_COLORS.available,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  listHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: CAL_COLORS.headingPlum,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: CAL_COLORS.bodyRose,
    fontStyle: "italic",
  },
  blockedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CAL_COLORS.paleDivider,
  },
  blockedDate: {
    fontSize: 14,
    fontWeight: "600",
    color: CAL_COLORS.baseText,
  },
  blockedReason: {
    fontSize: 12,
    color: CAL_COLORS.bodyRose,
    marginTop: 2,
  },
});