import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, marginBottom: SPACING.md },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: SPACING.md },
  twoColumnRow: { marginBottom: SPACING.lg },
});