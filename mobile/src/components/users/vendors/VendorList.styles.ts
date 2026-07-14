import { StyleSheet } from "react-native";

const shadow = {
  shadowColor: "#FF4D6D",
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7", paddingTop: 50 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, marginBottom: 4,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: "#FFFef7",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FFB3BF",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#3F1D2F" },
  headerSubtitle: { fontSize: 12, color: "#8D6171", marginHorizontal: 20, marginBottom: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 10 },
  searchInputWrapper: {
    flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 16, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: "#FFB3BF",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#3F1D2F" },
  cityPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#FFFEF7", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
    marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: "#FFB3BF",
  },
  cityPillText: { fontSize: 12, color: "#6C2D45", fontWeight: "600", marginHorizontal: 4 },
  chipsRow: { flexGrow: 0, marginBottom: 12 },
  chipsRowContent: { paddingHorizontal: 20, paddingVertical: 8, alignItems: "center" },
  chip: {
    backgroundColor: "#FFFEF7", paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, marginRight: 10, justifyContent: "center", minHeight: 38,
    borderWidth: 1, borderColor: "#FFB3BF",
  },
  chipActive: { backgroundColor: "#FF4D6D", borderColor: "#FF4D6D" },
  chipText: { fontSize: 13, color: "#6C2D45", fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF" },
  resultRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginHorizontal: 20, marginBottom: 12,
  },
  resultCount: { fontSize: 13, fontWeight: "700", color: "#3F1D2F" },
  sortPill: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFE6EB",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7,
    borderWidth: 1, borderColor: "#FFB3BF", maxWidth: "58%",
  },
  sortPillText: { fontSize: 11, color: "#6C2D45", fontWeight: "600", marginHorizontal: 3 },
  card: {
    backgroundColor: "rgba(255,255,255,0.96)", borderRadius: 24, marginBottom: 18,
    overflow: "hidden", borderWidth: 1, borderColor: "#FFB3BF", ...shadow,
  },
  cardImage: { width: "100%", height: 170 },
  heartButton: {
    position: "absolute", top: 10, right: 10, backgroundColor: "#FFFEF7",
    width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center",
  },
  featuredBadge: {
    position: "absolute", top: 10, left: 10, backgroundColor: "#FF4D6D",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  featuredBadgeText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
  ratingBadge: {
    position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFEF7", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "600", color: "#3F1D2F", marginLeft: 3 },
  cardBody: { padding: 16 },
  cardCategory: { fontSize: 11, fontWeight: "800", color: "#FF4D6D", letterSpacing: 0.5 },
  cardName: { fontSize: 18, fontWeight: "800", color: "#3F1D2F", marginTop: 4 },
  cardLocationRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  cardLocation: { fontSize: 12, color: "#8D6171", marginLeft: 3 },
  cardPriceLabel: { fontSize: 11, color: "#8D6171", marginTop: 10 },
  cardPrice: { fontSize: 18, fontWeight: "800", color: "#FF4D6D", marginTop: 2 },
  cardButtonRow: { flexDirection: "row", marginTop: 14 },
  viewProfileButton: {
    flex: 1, borderWidth: 1, borderColor: "#FFB3BF", borderRadius: 14,
    paddingVertical: 11, alignItems: "center", marginRight: 10, backgroundColor: "#FFFEF7",
  },
  viewProfileText: { fontSize: 13, fontWeight: "700", color: "#6C2D45" },
  bookNowButton: {
    flex: 1, backgroundColor: "#FF4D6D", borderRadius: 14,
    paddingVertical: 11, alignItems: "center",
  },
  bookNowText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 15, fontWeight: "700", color: "#3F1D2F", marginTop: 12 },
  emptyStateSubtext: { fontSize: 12, color: "#8D6171", marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(63,29,47,0.45)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#FFFEF7", borderTopLeftRadius: 26, borderTopRightRadius: 26,
    padding: 20, maxHeight: "60%", borderWidth: 1, borderColor: "#FFB3BF",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#3F1D2F", marginBottom: 12 },
  modalItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFCAD3",
  },
  modalItemText: { fontSize: 14, color: "#6C2D45" },
  modalItemTextActive: { color: "#FF4D6D", fontWeight: "700" },
});
