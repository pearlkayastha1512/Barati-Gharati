import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingBottom: 30 },

  heroCard: { marginHorizontal: 20, marginTop: 10, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16,
  },
  heroBadgeText: { fontSize: 12, color: "#fff", fontWeight: "600", marginLeft: 6 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff", lineHeight: 32, marginBottom: 12 },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 19, marginBottom: 18 },
  bookMoreButton: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12,
  },
  bookMoreButtonText: { fontSize: 14, fontWeight: "700", color: "#6366F1", marginRight: 8 },

  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
    marginHorizontal: 20, marginBottom: 8,
  },
  statCard: {
    width: "48%", backgroundColor: "#fff", borderRadius: 16,
    padding: 14, marginBottom: 12, elevation: 1,
  },
  statCardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statIconCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center" },
  liveBadge: { backgroundColor: "#f0f0f0", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  liveBadgeText: { fontSize: 10, color: "#666", fontWeight: "600" },
  statLabel: { fontSize: 12, color: "#999", marginTop: 10 },
  statValue: { fontSize: 24, fontWeight: "800", color: "#333", marginTop: 2 },
  statSublabel: { fontSize: 11, color: "#bbb", marginTop: 2 },

  filterTabsRow: { marginHorizontal: 20, marginBottom: 16, flexGrow: 0 },
  filterTab: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginRight: 10, elevation: 1,
  },
  filterTabActive: { backgroundColor: "#6366F1" },
  filterTabText: { fontSize: 13, fontWeight: "600", color: "#555" },
  filterTabTextActive: { color: "#fff" },
  filterTabCount: {
    backgroundColor: "#f0f0f0", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 8,
  },
  filterTabCountActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  filterTabCountText: { fontSize: 11, fontWeight: "700", color: "#666" },
  filterTabCountTextActive: { color: "#fff" },

  sectionCard: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  sectionSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },
  sortPill: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f7f7f7",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },
  sortPillText: { fontSize: 12, color: "#666", marginHorizontal: 4 },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 15, fontWeight: "700", color: "#666", marginTop: 12 },
  emptyStateSubtext: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "center" },

  errorCard: { marginHorizontal: 20, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "#FFB3BF", backgroundColor: "#FFF8D8", alignItems: "center" },
  errorText: { color: "#6C2D45", fontSize: 13, textAlign: "center", marginTop: 8 },
  retryButton: { marginTop: 14, borderRadius: 12, backgroundColor: "#FF4D6D", paddingHorizontal: 18, paddingVertical: 10 },
  retryText: { color: "#FFFFFF", fontWeight: "700" },
  loadingCard: { marginHorizontal: 20, paddingVertical: 42, alignItems: "center" },
  loadingText: { marginTop: 12, color: "#8D6171" },

  bookingCard: { backgroundColor: "#FFFDF0", borderRadius: 24, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: "#FFB3BF", elevation: 2 },
  bookingHeroImage: { width: "100%", height: 150, borderRadius: 18, marginBottom: 14 },
  bookingHeaderRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  bookingHeaderCopy: { flex: 1 },
  bookingMetaGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 16 },
  bookingMetaRow: { width: "50%", flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 12 },
  bookingMetaText: { flex: 1, color: "#6C2D45", fontSize: 12 },
  paymentBox: { flexDirection: "row", gap: 6, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#FFB3BF", backgroundColor: "#FFF8D8" },
  paymentColumn: { flex: 1 },
  paymentLabel: { color: "#8D6171", fontSize: 9, marginBottom: 4 },
  paymentValue: { color: "#3F1D2F", fontWeight: "700", fontSize: 12 },
  remainingValue: { color: "#E63B5F", fontWeight: "700", fontSize: 12 },
  payButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: "#FF4D6D" },
  payButtonDisabled: { backgroundColor: "#FFE6EB" },
  payButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  payButtonTextDisabled: { color: "#8D6171" },
  viewDetailsButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, alignSelf: "flex-start", marginTop: 14, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: "#FF4D6D" },
  viewDetailsText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },

  bookingItem: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 16, padding: 12, marginBottom: 12, elevation: 1,
  },
  bookingItemImage: { width: 56, height: 56, borderRadius: 12 },
  bookingItemVendor: { fontSize: 14, fontWeight: "700", color: "#333" },
  bookingItemCategory: { fontSize: 11, color: "#999", marginTop: 2 },
  bookingItemDateRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  bookingItemDate: { fontSize: 11, color: "#999", marginLeft: 4 },
  statusPill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusPillText: { fontSize: 11, fontWeight: "700" },
});
