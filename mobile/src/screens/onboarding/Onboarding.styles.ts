import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F5",
  },

  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },

  image: {
    width: width * 0.75,
    height: 300,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#C2185B",
    textAlign: "center",
    marginTop: 30,
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 25,
    right: 25,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D8D8D8",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 25,
    backgroundColor: "#C2185B",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skipText: {
    color: "#888",
    fontSize: 17,
    fontWeight: "500",
  },

  nextButton: {
    backgroundColor: "#C2185B",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },

  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});