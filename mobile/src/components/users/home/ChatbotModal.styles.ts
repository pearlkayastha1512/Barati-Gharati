import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 50 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  botIconCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#C2185B",
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#333" },

  messageList: { padding: 20 },
  messageBubble: { maxWidth: "80%", borderRadius: 16, padding: 12, marginBottom: 10 },
  botBubble: { backgroundColor: "#fff", alignSelf: "flex-start", borderWidth: 1, borderColor: "#eee" },
  userBubble: { backgroundColor: "#C2185B", alignSelf: "flex-end" },
  messageText: { fontSize: 14, color: "#333", lineHeight: 20 },
  userMessageText: { color: "#fff" },

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
});