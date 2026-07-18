import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F6FA" },
  stepScroll: { padding: 20, paddingBottom: 40 },

  // Step indicator
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  stepItem: { alignItems: "center", width: 60 },
  stepCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#e0e0e0",
    justifyContent: "center", alignItems: "center",
  },
  stepCircleActive: { backgroundColor: "#3B5BFF" },
  stepCircleCompleted: { backgroundColor: "#22B07D" },
  stepNumberText: { fontSize: 13, fontWeight: "700", color: "#999" },
  stepNumberTextActive: { color: "#fff" },
  stepLabel: { fontSize: 10, color: "#999", marginTop: 6, textAlign: "center" },
  stepLabelActive: { color: "#333", fontWeight: "600" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#e0e0e0", marginTop: 17, marginHorizontal: -4 },
  stepLineCompleted: { backgroundColor: "#22B07D" },

  // Card
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: "800", color: "#222" },
  cardSubtitle: { fontSize: 13, color: "#999", marginTop: 4, marginBottom: 20 },

  label: { fontSize: 12, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 4 },
  input: { marginBottom: 14, backgroundColor: "#fff" },
  errorText: { fontSize: 12, color: "#E53935", marginBottom: 10 },

  // Dropdown (Category)
  dropdownField: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc",
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 14, marginBottom: 14,
  },
  dropdownText: { flex: 1, fontSize: 14, color: "#333" },
  dropdownPlaceholder: { color: "#999" },
 dropdownOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
  padding: 30,
},
 dropdownModal: {
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: 16,
  maxHeight: 400,
  paddingVertical: 8,
},
  dropdownOption: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  dropdownOptionText: { fontSize: 14, color: "#333" },

  // Image picker
  imagePickerWrapper: { flex: 1, marginRight: 10 },
  imagePickerLabel: { fontSize: 12, fontWeight: "600", color: "#333", marginBottom: 8 },
  imagePickerBox: {
    height: 140, borderWidth: 2, borderStyle: "dashed", borderColor: "#ccc",
    borderRadius: 14, justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
  imagePickerText: { fontSize: 12, color: "#999", marginTop: 8 },
  imagePickerPreview: { width: "100%", height: "100%" },
  reviewImageBox: {
    height: 100, borderRadius: 12, backgroundColor: "#f5f5f5",
    justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
  emptyReviewImageText: { fontSize: 11, color: "#bbb" },
  galleryRow: { flexDirection: "row", marginBottom: 20 },

  // Navigation buttons
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  prevButton: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd",
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11,
  },
  prevButtonText: { fontSize: 13, fontWeight: "600", color: "#333", marginLeft: 6 },
  nextButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#3B5BFF",
    borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12,
  },
  nextButtonDisabled: { backgroundColor: "#aab8ff" },
  nextButtonText: { fontSize: 13, fontWeight: "700", color: "#fff", marginRight: 6 },

  // Review
  reviewCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  reviewCardTitle: { fontSize: 15, fontWeight: "700", color: "#222", marginBottom: 10 },
  reviewRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f2f2f2",
  },
  reviewRowLabel: { fontSize: 12, color: "#999" },
  reviewRowValue: { fontSize: 13, fontWeight: "600", color: "#333", flexShrink: 1, textAlign: "right" },
  badgeHeadingRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  badgeSubtitle: { color: "#777", fontSize: 12, lineHeight: 17, marginTop: -5, marginBottom: 12 },
  billingToggle: { flexDirection: "row", backgroundColor: "#F4F4F5", borderRadius: 12, padding: 4, marginBottom: 12 },
  billingOption: { flex: 1, alignItems: "center", borderRadius: 9, paddingVertical: 9, paddingHorizontal: 4 },
  billingOptionActive: { backgroundColor: "#FFFFFF", elevation: 2 },
  billingOptionText: { color: "#71717A", fontSize: 11, fontWeight: "700" },
  billingOptionTextActive: { color: "#E4005A" },
  badgeGrid: { gap: 10 },
  badgePlan: { borderWidth: 1, borderRadius: 14, padding: 15 },
  badgePlanActive: { borderWidth: 2, elevation: 2 },
  badgePlanHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  badgePlanName: { fontSize: 16, fontWeight: "800" },
  badgePrice: { color: "#222", fontSize: 23, fontWeight: "900", marginTop: 12 },
  badgePeriod: { color: "#777", fontSize: 11, fontWeight: "600", marginTop: 2 },
  badgeLimit: { color: "#666", fontSize: 12, fontWeight: "600", marginTop: 7 },

  // Document card (available for future use, not wired into current flow)
  documentCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    padding: 16, borderRadius: 14, marginBottom: 12, elevation: 1,
  },
  documentInfo: { flex: 1, marginLeft: 14 },
  documentTitle: { fontWeight: "700", fontSize: 14, color: "#333" },
  documentSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },

  // Success screen
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 30 },
  successIconCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: "#E8F8F0",
    justifyContent: "center", alignItems: "center", marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: "800", color: "#222", marginBottom: 12, textAlign: "center" },
  successText: { fontSize: 13, color: "#666", textAlign: "center", lineHeight: 20, marginBottom: 4 },
  successTextBold: { fontWeight: "700", color: "#333" },
  successHighlight: { fontWeight: "700", color: "#D9A404" },
  goToLoginButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#3B5BFF",
    borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, marginTop: 24,
  },
  goToLoginButtonText: { fontSize: 14, fontWeight: "700", color: "#fff", marginRight: 8 },
});
