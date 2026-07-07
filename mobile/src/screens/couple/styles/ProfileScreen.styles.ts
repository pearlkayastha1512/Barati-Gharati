import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 50 },

  heroCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { backgroundColor: "#fff" },
  heroName: { fontSize: 20, fontWeight: "700", color: "#fff" },
  heroRole: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  heroInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  heroInfoText: { fontSize: 13, color: "#fff", marginLeft: 8 },
  editButton: { marginTop: 12, backgroundColor: "#fff", borderRadius: 10, alignSelf: "flex-start" },
  editButtonLabel: { color: "#3A6FE8", fontWeight: "700" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statTile: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 18, fontWeight: "700", color: "#333" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },
  statSublabel: { fontSize: 11, color: "#999" },

  sectionRow: { marginHorizontal: 20, marginBottom: 16 },
  sectionCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#C2185B", marginBottom: 12 },

  infoRow: { paddingVertical: 6 },
  infoLabel: { fontSize: 12, color: "#999" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 2 },
  infoValueEmpty: { color: "#bbb", fontWeight: "500" },
  rowDivider: { marginVertical: 4 },

  quickActionsCard: { backgroundColor: "#fff", borderRadius: 16, elevation: 1 },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  quickActionLabel: { fontSize: 14, color: "#333", marginLeft: 12, fontWeight: "500" },

  becomeVendorButton: { marginHorizontal: 20, borderRadius: 10, marginBottom: 12 },
  logoutButton: { marginHorizontal: 20, borderRadius: 10, borderColor: "#E53935" },
});