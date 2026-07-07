import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 4,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1, marginRight: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },

  // Send Message card
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 1,
  },
  formBadge: { fontSize: 11, fontWeight: "700", color: "#C2185B", letterSpacing: 1 },
  formTitle: { fontSize: 20, fontWeight: "800", color: "#222", marginTop: 6 },
  formTitleAccent: { color: "#C2185B" },

  fieldRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#666", marginBottom: 6 },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    height: 110,
    textAlignVertical: "top",
    marginTop: 16,
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: "#C2185B",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  sendButtonText: { color: "#fff", fontWeight: "700", fontSize: 15, marginLeft: 8 },

  // Contact Information card
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 1,
  },
  infoCardTitle: { fontSize: 18, fontWeight: "800", color: "#222" },
  infoCardSubtitle: { fontSize: 12, color: "#999", marginTop: 6, marginBottom: 16, lineHeight: 18 },

  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 18 },
  infoIconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#FDEEF3",
    justifyContent: "center", alignItems: "center",
  },
  infoLabel: { fontSize: 14, fontWeight: "700", color: "#333" },
  infoValue: { fontSize: 13, color: "#666", marginTop: 2, lineHeight: 18 },
});