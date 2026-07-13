import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  card: { height: "92%", backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "800", color: "#333" },
  subtitle: { fontSize: 12, color: "#999", marginTop: 4, maxWidth: 260 },
  subtitleBold: { fontWeight: "700", color: "#C2185B" },

  formScroll: { flex: 1, marginBottom: 12 },
  formContent: { paddingBottom: 18 },
  row: { flexDirection: "row", marginBottom: 14 },
  halfField: { flex: 1, marginRight: 10 },
  label: { fontSize: 12, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: "#333",
  },
  dropdownBox: { marginTop: 6, height: 240, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10 },
  dropdownContent: { flexGrow: 0 },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
  optionalSection: { borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 16, marginTop: 2, marginBottom: 14 },
  optionalTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  optionalSubtitle: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  readonlyInput: { justifyContent: "center", backgroundColor: "#F3F4F6" },
  readonlyText: { color: "#6B7280", fontSize: 13 },
  requirementsInput: { minHeight: 86, textAlignVertical: "top", marginBottom: 4 },

  packagePicker: { flexDirection: "row", flexWrap: "wrap" },
  packageChip: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, marginRight: 6, marginBottom: 6,
  },
  packageChipActive: { backgroundColor: "#C2185B", borderColor: "#C2185B" },
  packageChipText: { fontSize: 11, color: "#666", fontWeight: "600" },
  packageChipTextActive: { color: "#fff" },

  priceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#eee", marginBottom: 12,
  },
  priceLabel: { fontSize: 14, color: "#333", fontWeight: "600" },
  priceValue: { fontSize: 22, fontWeight: "800", color: "#C2185B" },

  submitButton: { backgroundColor: "#C2185B", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#f0b8cd" },
  submitButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  validationHint: { fontSize: 11, color: "#E53935", textAlign: "center", marginTop: 8 },
});
