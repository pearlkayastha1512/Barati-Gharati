import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingBottom: 30 },

  heroCard: { marginHorizontal: 20, marginTop: 10, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16,
  },
  heroBadgeText: { fontSize: 12, color: "#fff", fontWeight: "600", marginLeft: 6 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff", lineHeight: 32, marginBottom: 12 },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 19, marginBottom: 18 },
  addTaskButton: {
    alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 12,
    paddingHorizontal: 18, paddingVertical: 12,
  },
  addTaskButtonText: { fontSize: 14, fontWeight: "700", color: "#C2185B" },

  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
    marginHorizontal: 20, marginBottom: 8,
  },
  statCard: {
    width: "48%", backgroundColor: "#fff", borderRadius: 16,
    padding: 14, marginBottom: 12, elevation: 1,
  },
  statCardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statIconCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#FDEEF3",
    justifyContent: "center", alignItems: "center",
  },
  liveBadge: { backgroundColor: "#f0f0f0", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  liveBadgeText: { fontSize: 10, color: "#666", fontWeight: "600" },
  statLabel: { fontSize: 12, color: "#999", marginTop: 10 },
  statValue: { fontSize: 24, fontWeight: "800", color: "#333", marginTop: 2 },
  statSublabel: { fontSize: 11, color: "#bbb", marginTop: 2 },

  sectionCard: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  sectionSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },
  countPill: { backgroundColor: "#f7f7f7", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  countPillText: { fontSize: 12, color: "#666", fontWeight: "600" },

  emptyBox: {
    borderWidth: 1, borderStyle: "dashed", borderColor: "#ddd", borderRadius: 14,
    padding: 30, alignItems: "center", marginTop: 12,
  },
  emptyBoxText: { fontSize: 13, color: "#999" },

  taskCard: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff",
    borderRadius: 14, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: "#f0f0f0",
  },
  taskCardDone: { backgroundColor: "#FAFAFA" },
  taskText: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 10 },
  taskTextDone: { textDecorationLine: "line-through", color: "#aaa" },
  taskDescription: { fontSize: 12, color: "#999", marginTop: 2 },
  taskMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  priorityPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 },
  priorityPillText: { fontSize: 10, fontWeight: "700" },
  dueDateRow: { flexDirection: "row", alignItems: "center" },
  dueDateText: { fontSize: 11, color: "#999", marginLeft: 3 },

  timelineRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#C2185B", marginTop: 4 },
  timelineTask: { fontSize: 13, fontWeight: "600", color: "#333" },
  timelineDate: { fontSize: 11, color: "#999", marginTop: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 20 },
  modalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  modalInput: { marginBottom: 12, backgroundColor: "#fff" },
  modalTextArea: { minHeight: 80 },
  modalRow: { marginBottom: 12 },
  priorityPicker: { flexDirection: "row" },
  priorityChip: {
    flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingVertical: 8, alignItems: "center", marginRight: 8,
  },
  priorityChipActive: { backgroundColor: "#C2185B", borderColor: "#C2185B" },
  priorityChipText: { fontSize: 12, color: "#666", fontWeight: "600" },
  priorityChipTextActive: { color: "#fff" },
  modalButtonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  modalCancelButton: { marginRight: 10 },
  modalAddButton: { backgroundColor: "#C2185B" },

  // Budget + Vendors preview cards
  previewRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginBottom: 16 },
  previewCard: { width: "48%", backgroundColor: "#fff", borderRadius: 16, padding: 14, elevation: 1 },
  previewCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  previewIconCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center", marginRight: 8 },
  previewCardTitle: { fontSize: 13, fontWeight: "700", color: "#333" },
  previewStatRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  previewStatLabel: { fontSize: 11, color: "#999" },
  previewStatValue: { fontSize: 12, fontWeight: "700", color: "#333" },
  previewFootnote: { fontSize: 10, color: "#bbb", marginTop: 6 },
  previewBigValue: { fontSize: 16, fontWeight: "800", color: "#333", marginTop: 2 },
  previewVendorRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  previewVendorText: { fontSize: 11, color: "#666", marginLeft: 6 },

  // Shared progress bar (used by BudgetPreviewCard too)
  progressBarTrack: { height: 6, backgroundColor: "#eee", borderRadius: 3, marginTop: 8, overflow: "hidden" },
  progressBarFill: { height: 6, borderRadius: 3 },
});