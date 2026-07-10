import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#333" },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: "#333", marginBottom: 20,
  },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end" },
  cancelButton: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 11, marginRight: 10,
  },
  cancelButtonText: { fontSize: 14, fontWeight: "600", color: "#333" },
  saveButton: { backgroundColor: "#22B07D", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 11 },
  saveButtonDisabled: { backgroundColor: "#a8dcc5" },
  saveButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});