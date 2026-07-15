import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    overflow: "hidden",
  },

  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -60,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#FFE6EB",
    opacity: 0.6,
  },

  blobBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#FFF3D6",
    opacity: 0.5,
  },

  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: height * 0.1,
  },

  imageCard: {
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#FFE6EB",
    shadowColor: "#E01267",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },

  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3F1D2F",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  description: {
    fontSize: 15,
    color: "#8D6171",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  footer: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 12,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFCAD3",
  },

  activeDot: {
    width: 22,
    backgroundColor: "#E01267",
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },

  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8D6171",
  },

  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  nextButtonFull: {
    width: "100%",
  },

  nextText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});