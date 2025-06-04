import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f87fc",
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 12,
    flex: 1,
    maxWidth: 250,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    paddingVertical: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  createPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  createPostText: {
    color: "#8e8e93",
    fontSize: 16,
  },
  createPostButton: {
    backgroundColor: "#1f87fc",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  createPostButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  feed: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: "#1f87fc",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  userHandle: {
    color: "#8e8e93",
    fontSize: 14,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  moreText: {
    color: "#8e8e93",
    fontSize: 20,
  },
  postContent: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  rewardsContainer: {
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rewardsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardsLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  rewardsText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  rewardsAmount: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rewardsValue: {
    color: "#1f87fc",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    color: "#8e8e93",
    fontSize: 14,
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  followButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1f87fc",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  followButtonText: {
    color: "#1f87fc",
    fontSize: 14,
    fontWeight: "600",
  },
});
