import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  inputAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    maxHeight: 100,
    marginRight: 12,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#1f87fc",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#374151",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#161616",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sortButton: {
    backgroundColor: "#374151",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  commentsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#1F2937",
  },
  commentContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#161616",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 6,
  },
  verifiedBadge: {
    fontSize: 14,
    color: "#1f87fc",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 13,
    color: "#6B7280",
  },
  rewardBadge: {
    backgroundColor: "#1f87fc",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 4,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  likedText: {
    color: "#1f87fc",
  },
  replyInputContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  replyInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyInputWrapper: {
    flex: 1,
  },
  replyInput: {
    backgroundColor: "#374151",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#FFFFFF",
    maxHeight: 80,
    marginBottom: 8,
    textAlignVertical: "top",
  },
  replyButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  replyButton: {
    backgroundColor: "#1f87fc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  replyButtonDisabled: {
    backgroundColor: "#374151",
  },
  replyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#374151",
  },
  replyContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  replyUsername: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 6,
  },
  replyTimestamp: {
    fontSize: 11,
    color: "#6B7280",
  },
  miniRewardBadge: {
    backgroundColor: "#1f87fc",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniRewardText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  replyText: {
    fontSize: 13,
    color: "#FFFFFF",
    lineHeight: 18,
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;
