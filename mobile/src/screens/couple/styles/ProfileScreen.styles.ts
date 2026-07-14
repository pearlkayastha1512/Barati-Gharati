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
  heroCard: {
    marginHorizontal: 20, borderRadius: 28, padding: 22, marginBottom: 18,
    borderWidth: 1, borderColor: "#FF9AAA", shadowColor: "#FF4D6D",
    shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { backgroundColor: "#FFFEF7", borderWidth: 2, borderColor: "rgba(255,255,255,0.9)" },
  heroName: { fontSize: 22, fontWeight: "800", color: "#3F1D2F" },
  heroRole: { fontSize: 13, color: "#7A4A5C", marginTop: 2 },
  heroInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  heroInfoText: { fontSize: 13, color: "#6C2D45", marginLeft: 8 },
  editButton: { marginTop: 12, backgroundColor: "#FF4D6D", borderRadius: 14, alignSelf: "flex-start" },
  editButtonLabel: { color: "#FFFFFF", fontWeight: "700" },
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
    marginHorizontal: 20, marginBottom: 16,
  },
  statTile: {
    width: "48%", backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 22,
    padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#FFB3BF", ...shadow,
  },
  statIconCircle: {
    width: 38, height: 38, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#3F1D2F" },
  statLabel: { fontSize: 12, color: "#6C2D45", marginTop: 2, fontWeight: "600" },
  statSublabel: { fontSize: 11, color: "#8D6171" },
  sectionRow: { marginHorizontal: 20, marginBottom: 16 },
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: "#FFB3BF", ...shadow,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#3F1D2F", marginBottom: 12 },
  infoRow: { paddingVertical: 7 },
  infoLabel: { fontSize: 12, color: "#8D6171" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#3F1D2F", marginTop: 2 },
  infoValueEmpty: { color: "#B8919F", fontWeight: "500" },
  rowDivider: { marginVertical: 4, backgroundColor: "#FFCAD3" },
  quickActionsCard: {
    backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 22,
    borderWidth: 1, borderColor: "#FFB3BF", overflow: "hidden", ...shadow,
  },
  quickActionRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 15, paddingHorizontal: 16,
  },
  quickActionLabel: { fontSize: 14, color: "#3F1D2F", marginLeft: 12, fontWeight: "600" },
  becomeVendorButton: {
    marginHorizontal: 20, borderRadius: 14, marginBottom: 12, backgroundColor: "#FF4D6D",
  },
  logoutButton: {
    marginHorizontal: 20, borderRadius: 14, borderColor: "#E63B5F", backgroundColor: "#FFFEF7",
  },
});
