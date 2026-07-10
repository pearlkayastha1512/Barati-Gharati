import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", alignItems: "center", padding: SPACING.lg,
  },
  modal: {
    width: "100%", maxHeight: "85%", backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: SPACING.lg,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },

  label: { fontSize: 12, fontWeight: "600", color: COLORS.text, marginBottom: 6, marginTop: SPACING.md },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: COLORS.text,
  },
  textArea: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: COLORS.text,
    minHeight: 90, textAlignVertical: "top",
  },

  dropdownField: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm,
    paddingHorizontal: 12, paddingVertical: 12,
  },
  dropdownText: { fontSize: 14, color: COLORS.text },
  dropdownPlaceholder: { color: COLORS.textLight },
  dropdownList: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm,
    marginTop: 6, overflow: "hidden",
  },
  dropdownOption: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  dropdownOptionText: { fontSize: 14, color: COLORS.text },

  imageBox: {
    borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.border, borderRadius: RADIUS.md,
    minHeight: 140, justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
  imagePreview: { width: "100%", height: 160 },
  imagePlaceholderText: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  chooseFileText: { fontSize: 12, fontWeight: "700", color: COLORS.primary, marginTop: 10 },

  footer: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: SPACING.lg },
  cancelBtn: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: 18, paddingVertical: 11,
  },
  cancelBtnText: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: 18, paddingVertical: 11,
  },
  submitBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});