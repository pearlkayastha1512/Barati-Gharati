import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 20,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1, marginRight: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#333" },

  messageList: { padding: 20 },
  messageBubble: { maxWidth: "80%", borderRadius: 16, padding: 12, marginBottom: 10 },
  userBubble: { backgroundColor: "#C2185B", alignSelf: "flex-end" },
  vendorBubble: { backgroundColor: "#fff", alignSelf: "flex-start", borderWidth: 1, borderColor: "#eee" },
  messageText: { fontSize: 14, color: "#333", lineHeight: 20 },
  userMessageText: { color: "#fff" },
  messageTime: { fontSize: 10, color: "#999", marginTop: 4, alignSelf: "flex-end" },
  userMessageTime: { color: "rgba(255,255,255,0.7)" },

  inputRow: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: "#eee", backgroundColor: "#fff",
  },
  input: {
    flex: 1, backgroundColor: "#f5f5f5", borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 14, color: "#333", marginRight: 10,
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#C2185B",
    justifyContent: "center", alignItems: "center",
  },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyStateText: { fontSize: 14, color: "#999" },
});