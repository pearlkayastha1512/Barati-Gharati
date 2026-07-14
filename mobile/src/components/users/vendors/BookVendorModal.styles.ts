import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(63,29,47,0.45)", justifyContent: "flex-end" },
  card: { height: "92%", backgroundColor: "#FFFEF7", borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, borderWidth: 1, borderColor: "#FFB3BF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "800", color: "#3F1D2F" },
  subtitle: { fontSize: 12, color: "#8D6171", marginTop: 4, maxWidth: 260 },
  subtitleBold: { fontWeight: "700", color: "#FF4D6D" },

  formScroll: { flex: 1, marginBottom: 12 },
  formContent: { paddingBottom: 18 },
  row: { flexDirection: "row", marginBottom: 14 },
  halfField: { flex: 1, marginRight: 10 },
  label: { fontSize: 12, fontWeight: "600", color: "#3F1D2F", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: "#3F1D2F", backgroundColor: "#FFFFFF",
  },
  dropdownBox: { marginTop: 6, height: 240, borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 12 },
  dropdownContent: { flexGrow: 0 },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#FFCAD3" },
  optionalSection: { borderTopWidth: 1, borderTopColor: "#FFCAD3", paddingTop: 16, marginTop: 2, marginBottom: 14 },
  optionalTitle: { fontSize: 15, fontWeight: "800", color: "#3F1D2F" },
  optionalSubtitle: { marginTop: 4, fontSize: 12, color: "#8D6171" },
  readonlyInput: { justifyContent: "center", backgroundColor: "#FFF5F7" },
  readonlyText: { color: "#8D6171", fontSize: 13 },
  requirementsInput: { minHeight: 86, textAlignVertical: "top", marginBottom: 4 },

  packagePicker: { flexDirection: "row", flexWrap: "wrap" },
  packageChip: {
    borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, marginRight: 6, marginBottom: 6,
  },
  packageChipActive: { backgroundColor: "#FF4D6D", borderColor: "#FF4D6D" },
  packageChipText: { fontSize: 11, color: "#6C2D45", fontWeight: "600" },
  packageChipTextActive: { color: "#fff" },

  priceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#FFCAD3", marginBottom: 12,
  },
  priceLabel: { fontSize: 14, color: "#3F1D2F", fontWeight: "600" },
  priceValue: { fontSize: 22, fontWeight: "800", color: "#FF4D6D" },

  submitButton: { backgroundColor: "#FF4D6D", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#FFCAD3" },
  submitButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  validationHint: { fontSize: 11, color: "#E53935", textAlign: "center", marginTop: 8 },
});
