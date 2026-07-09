import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  header: { marginBottom: SPACING.lg },
  headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  filterRow: { flexDirection: "row", marginBottom: SPACING.lg, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
  filterChipTextActive: { color: "#fff" },

  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.md, elevation: 1,
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  customerName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  eventType: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "800", color: COLORS.text },

  metaRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.md, gap: 6 },
  metaText: { fontSize: 12, color: COLORS.textMuted },

  statusBadge: {
    alignSelf: "flex-start", borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: SPACING.sm,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  statusPending: { backgroundColor: COLORS.warningLight },
  statusPendingText: { color: COLORS.warning },
  statusConfirmed: { backgroundColor: COLORS.primaryLight },
  statusConfirmedText: { color: COLORS.primary },
  statusCompleted: { backgroundColor: COLORS.successLight },
  statusCompletedText: { color: COLORS.success },
  statusCancelled: { backgroundColor: "#FBEAEA" },
  statusCancelledText: { color: COLORS.danger },
});