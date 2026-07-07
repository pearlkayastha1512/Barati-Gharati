import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1, marginRight: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  markAllText: { fontSize: 12, fontWeight: "700", color: "#C2185B" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 4 },

  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },

  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: "#FFF5F8",
  },
  notificationIconCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#FDEEF3",
    justifyContent: "center", alignItems: "center",
  },
  notificationTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  notificationMessage: { fontSize: 12, color: "#666", marginTop: 3, lineHeight: 17 },
  notificationTime: { fontSize: 11, color: "#aaa", marginTop: 5 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#C2185B", marginTop: 4,
  },
});