import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  reelContainer: {
    width: screenWidth,
    height: screenHeight,
  },
  videoBackground: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  reelsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cameraButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 20,
  },
  cameraIcon: {
    fontSize: 20,
  },
  rightActions: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -150 }],
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "white",
  },
  followButton: {
    backgroundColor: "#1f87fc",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10,
    borderWidth: 2,
    borderColor: "white",
  },
  followButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  musicNote: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  musicIcon: {
    fontSize: 16,
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  rewardsContainer: {
    backgroundColor: "rgba(31, 135, 252, 0.9)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  rewardsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  rewardsText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  trendingBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 4,
    borderRadius: 8,
  },
  trendingIcon: {
    fontSize: 12,
  },
  userInfo: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: "#1f87fc",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  verifiedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  duration: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  caption: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  musicInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  musicText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    marginLeft: 4,
    fontStyle: "italic",
  },
  ctaContainer: {
    flexDirection: "row",
    gap: 12,
  },
  supportButton: {
    backgroundColor: "#1f87fc",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  supportButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  shareReelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  shareReelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 2,
  },
  activeIndicator: {
    backgroundColor: "#1f87fc",
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  createReelButton: {
    backgroundColor: "#1f87fc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createReelIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  createReelText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  floatingActions: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -40 }],
  },
  floatingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  floatingIcon: {
    fontSize: 20,
  },
});
