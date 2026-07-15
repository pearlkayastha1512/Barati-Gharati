import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFEF7",
    borderWidth: 1,
    borderColor: "#FFB3BF",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3F1D2F",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Hero
  heroCard: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FF9AAA",
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#FFFEF7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },

  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C2D45",
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#3F1D2F",
    lineHeight: 32,
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 13.5,
    color: "#6C2D45",
    lineHeight: 20,
  },

  // Form card
  formCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFB3BF",
    backgroundColor: "#FFFEF7",
    marginBottom: 18,
  },

  fieldRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8D6171",
    marginBottom: 6,
  },

  fieldInput: {
    borderWidth: 1,
    borderColor: "#FFCAD3",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#3F1D2F",
    backgroundColor: "#FFFFFF",
  },

  messageInput: {
    borderWidth: 1,
    borderColor: "#FFCAD3",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#3F1D2F",
    backgroundColor: "#FFFFFF",
    minHeight: 110,
    textAlignVertical: "top",
    marginTop: 6,
  },

  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: 20,
    backgroundColor: "#FF4D6D",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Contact info card
  infoCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FFB3BF",
    backgroundColor: "#FFFEF7",
  },

  infoCardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3F1D2F",
    marginBottom: 6,
  },

  infoCardSubtitle: {
    fontSize: 13,
    color: "#8D6171",
    lineHeight: 19,
    marginBottom: 16,
  },
});