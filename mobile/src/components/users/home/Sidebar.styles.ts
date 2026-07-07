import { StyleSheet, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    width: SCREEN_WIDTH * 0.75,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  userHeader: {
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  userEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  navList: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  navItemText: {
    marginLeft: 16,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  infoItemText: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: "400",
    color: "#777",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginBottom: 30,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#C2185B",
  },
});