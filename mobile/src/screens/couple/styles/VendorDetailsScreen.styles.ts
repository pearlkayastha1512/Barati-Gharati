import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F8" },
  scrollContent: { paddingBottom: 100 },

  heroImage: { width: "100%", height: 320, justifyContent: "flex-end" },
  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center", alignItems: "center",
    zIndex: 10,
  },

  badgeRow: { flexDirection: "row", marginBottom: 12 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  ratingBadgeText: { fontSize: 12, fontWeight: "700", color: "#333", marginLeft: 4 },
  categoryBadge: {
    backgroundColor: "#C2185B",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBadgeText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  vendorName: { fontSize: 26, fontWeight: "800", color: "#fff" },
  locationPriceRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  locationText: { fontSize: 13, color: "#fff", marginLeft: 4, marginRight: 14 },
  priceText: { fontSize: 16, fontWeight: "700", color: "#fff" },

  actionRow: { flexDirection: "row", marginTop: 16 },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginRight: 10,
  },
  saveButtonText: { fontSize: 13, fontWeight: "700", color: "#333", marginLeft: 6 },
  saveButtonTextActive: { color: "#C2185B" },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  shareButtonText: { fontSize: 13, fontWeight: "700", color: "#fff", marginLeft: 6 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    elevation: 1,
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#222", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "#999", marginBottom: 14 },

  emptyText: { fontSize: 13, color: "#aaa", textAlign: "center", paddingVertical: 20 },

  aboutText: { fontSize: 13, color: "#555", lineHeight: 21 },

  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  amenityItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDEEF3",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  amenityText: { fontSize: 13, color: "#333", fontWeight: "500", marginLeft: 10 },

  reviewSummaryBox: {
    flexDirection: "row",
    backgroundColor: "#FDEEF3",
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
  },
  reviewScoreBig: { fontSize: 32, fontWeight: "800", color: "#222" },
  starsRow: { flexDirection: "row", marginTop: 4 },
  reviewCountText: { fontSize: 12, color: "#999", marginTop: 6 },

  ratingBarsColumn: { flex: 1, marginLeft: 20, justifyContent: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ratingBarLabel: { fontSize: 11, color: "#999", width: 26 },
  ratingBarTrack: { flex: 1, height: 6, backgroundColor: "#eee", borderRadius: 3, marginHorizontal: 8 },
  ratingBarFill: { height: 6, backgroundColor: "#F5A623", borderRadius: 3 },

  bookNowFixed: {
    backgroundColor: "#C2185B",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  bookNowFixedText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});