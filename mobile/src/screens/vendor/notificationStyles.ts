import { StyleSheet } from "react-native";
import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: SPACING.xl,
  },

  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: COLORS.textMuted,
    lineHeight: 22,
  },
});