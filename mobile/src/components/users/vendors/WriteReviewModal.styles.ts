import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(63,29,47,0.45)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#FFFEF7", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#FFB3BF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "800", color: "#3F1D2F" },
  label: { fontSize: 13, fontWeight: "600", color: "#3F1D2F", marginBottom: 8 },
  starsRow: { flexDirection: "row", marginBottom: 20 },
  textArea: {
    borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 14, padding: 12,
    fontSize: 14, color: "#3F1D2F", minHeight: 100, textAlignVertical: "top", marginBottom: 20, backgroundColor: "#FFFFFF",
  },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end" },
  cancelButton: {
    borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 11, marginRight: 10,
  },
  cancelButtonText: { fontSize: 14, fontWeight: "600", color: "#6C2D45" },
  submitButton: { backgroundColor: "#FF4D6D", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 11 },
  submitButtonDisabled: { backgroundColor: "#FFCAD3" },
  submitButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
