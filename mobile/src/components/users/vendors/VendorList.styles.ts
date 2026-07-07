import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 50 },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, marginBottom: 4,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center", elevation: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  headerSubtitle: { fontSize: 12, color: "#999", marginHorizontal: 20, marginBottom: 14 },

  searchRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 10 },
  searchInputWrapper: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 14, paddingHorizontal: 14, height: 46, elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },

  cityPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    marginHorizontal: 20, marginBottom: 14, elevation: 1,
  },
  cityPillText: { fontSize: 12, color: "#333", fontWeight: "500", marginHorizontal: 4 },

  chipsRow: {
    flexGrow: 0,
    marginBottom: 14,
  },
  chipsRowContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    justifyContent: "center",
    minHeight: 38,
  },
  chipActive: { backgroundColor: "#C2185B" },
  chipText: { fontSize: 13, color: "#555", fontWeight: "500" },
  chipTextActive: { color: "#fff" },

  resultRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginHorizontal: 20, marginBottom: 12,
  },
  resultCount: { fontSize: 13, fontWeight: "600", color: "#333" },
  sortPill: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, elevation: 1,
  },
  sortPillText: { fontSize: 12, color: "#333", fontWeight: "500", marginHorizontal: 4 },

  card: {
    backgroundColor: "#fff", borderRadius: 18, marginBottom: 18,
    overflow: "hidden", elevation: 1,
  },
  cardImage: { width: "100%", height: 170 },
  heartButton: {
    position: "absolute", top: 10, right: 10, backgroundColor: "#fff",
    width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center",
  },
  featuredBadge: {
    position: "absolute", top: 10, left: 10, backgroundColor: "#22B07D",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  featuredBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  ratingBadge: {
    position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "600", color: "#333", marginLeft: 3 },

  cardBody: { padding: 14 },
  cardCategory: { fontSize: 11, fontWeight: "700", color: "#C2185B", letterSpacing: 0.5 },
  cardName: { fontSize: 17, fontWeight: "700", color: "#333", marginTop: 4 },
  cardLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cardLocation: { fontSize: 12, color: "#999", marginLeft: 3 },
  cardPriceLabel: { fontSize: 11, color: "#999", marginTop: 10 },
  cardPrice: { fontSize: 18, fontWeight: "700", color: "#C2185B", marginTop: 2 },

  cardButtonRow: { flexDirection: "row", marginTop: 14 },
  viewProfileButton: {
    flex: 1, borderWidth: 1, borderColor: "#333", borderRadius: 12,
    paddingVertical: 11, alignItems: "center", marginRight: 10,
  },
  viewProfileText: { fontSize: 13, fontWeight: "600", color: "#333" },
  bookNowButton: {
    flex: 1, backgroundColor: "#C2185B", borderRadius: 12,
    paddingVertical: 11, alignItems: "center",
  },
  bookNowText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 15, fontWeight: "600", color: "#666", marginTop: 12 },
  emptyStateSubtext: { fontSize: 12, color: "#999", marginTop: 4 },

  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: "60%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 12 },
  modalItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  modalItemText: { fontSize: 14, color: "#333" },
  modalItemTextActive: { color: "#C2185B", fontWeight: "700" },
});