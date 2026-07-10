import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1, marginRight: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  searchRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, marginHorizontal: 20, paddingHorizontal: 14, height: 46,
    marginBottom: 16, elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },

  conversationItem: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 16, padding: 12, marginBottom: 10, elevation: 1,
  },
  conversationAvatar: { width: 48, height: 48, borderRadius: 24 },
  conversationTopRow: { flexDirection: "row", justifyContent: "space-between" },
  conversationName: { fontSize: 14, fontWeight: "700", color: "#333" },
  conversationTime: { fontSize: 11, color: "#999" },
  conversationPreview: { fontSize: 12, color: "#999", marginTop: 4 },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 15, fontWeight: "700", color: "#666", marginTop: 12 },
  emptyStateSubtext: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "center", paddingHorizontal: 40 },
});