import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  appLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#1f87fc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  appName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#1F2937",
    margin: 16,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    backgroundColor: "#1f87fc",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: "#10B981",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 12,
  },
  badge: {
    backgroundColor: "rgba(31, 135, 252, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#1f87fc",
    fontSize: 12,
    fontWeight: "600",
  },
  bio: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  followButton: {
    flex: 1,
    backgroundColor: "#1f87fc",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "#374151",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#fff",
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cryptoStatsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  cryptoStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
  },
  earningsCard: {
    backgroundColor: "#1f87fc",
  },
  rankCard: {
    backgroundColor: "#7C3AED",
  },
  engagementCard: {
    backgroundColor: "#059669",
  },
  cryptoStatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cryptoStatValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cryptoStatLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  cryptoStatChange: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "600",
  },
  achievementsCard: {
    backgroundColor: "#1F2937",
    margin: 16,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  achievementDesc: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#1f87fc",
  },
  tabText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  postsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 32,
  },
  postCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#1f87fc",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timestamp: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rewardText: {
    color: "#1f87fc",
    fontSize: 12,
    fontWeight: "600",
  },
  postContent: {
    color: "#F3F4F6",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  engagementStats: {
    flexDirection: "row",
    gap: 20,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  engagementPoints: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  placeholderCard: {
    backgroundColor: "#1F2937",
    margin: 16,
    borderRadius: 12,
    padding: 48,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  placeholderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default styles;
