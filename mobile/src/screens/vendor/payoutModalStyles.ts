import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";

export const payoutModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "90%",
    maxWidth: 560,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#6B7280", marginTop: 2, maxWidth: 260 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  summaryIconRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: "#374151", fontWeight: "600" },
  summaryValue: { fontSize: 20, fontWeight: "800", color: COLORS.primary },
  summaryValueDark: { fontSize: 16, fontWeight: "700", color: "#111827" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    borderRadius: 8,
  },
  th: { fontSize: 12, fontWeight: "700", color: "#374151", paddingHorizontal: 8 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  td: { fontSize: 12, color: "#374151", paddingHorizontal: 8 },
  tdBold: { fontWeight: "700", color: "#111827" },
  statusPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusPillText: { fontSize: 11, fontWeight: "700", color: "#16A34A" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  footerLabel: { fontSize: 12, color: "#6B7280" },
  footerValue: { fontSize: 18, fontWeight: "800", color: "#111827" },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  closeButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});