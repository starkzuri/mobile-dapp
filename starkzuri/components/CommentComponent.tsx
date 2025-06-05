import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Reply,
} from "lucide-react-native";
import { bigintToShortStr } from "@/utils/AppUtils";
import MiniFunctions from "@/utils/MiniFunctions";
import { timeAgo } from "@/utils/AppUtils";

type User = {
  userId: number;
  name: number;
  username: number;
  about: string;
  profile_pic: string;
  cover_photo: string;
  date_registered: number;
  no_of_followers: number;
  number_following: number;
  notifications: number;
  zuri_points: number;
};

// let comment = {
//     id: "1",
//     user: {
//       name: "Sarah Johnson",
//       username: "@sarah_j",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     },
//     content:
//       "This is such an insightful post! I completely agree with your perspective on modern design trends. The way you explained the balance between functionality and aesthetics really resonates with me.",
//     timestamp: "2h",
//     likes: 24,
//     replies: 3,
//     isLiked: false,
//   };

const CommentComponent = ({ comment }) => {
  //   console.log(comment.commentId.toString());
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const user = MiniFunctions(comment.caller.toString());

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <View style={styles.container}>
      {/* Main Comment */}
      <View style={styles.commentContainer}>
        {/* Avatar */}
        <Image
          source={{
            uri: user?.profile_pic,
          }}
          style={styles.avatar}
        />

        {/* Comment Content */}
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {bigintToShortStr(user?.name)}
              </Text>
              <Text style={styles.username}>
                {bigintToShortStr(user?.username)}
              </Text>
              <Text style={styles.timestamp}>
                • {timeAgo(comment?.time_commented.toString() * 1000)}
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Comment Text */}
          <Text style={styles.commentText}>{comment?.content}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={handleLike}
            >
              <Heart
                size={16}
                color={isLiked ? "#1f87fc" : "#6b7280"}
                fill={isLiked ? "#1f87fc" : "none"}
              />
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {comment.likes.toString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={16} color="#6b7280" />
              <Text style={styles.actionText}>
                {comment.replies.toString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.replyButton}>
              <Reply size={16} color="#6b7280" />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sample Replies */}
      {/* <View style={styles.repliesContainer}>
        <View style={styles.replyItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            }}
            style={styles.replyAvatar}
          />
          <View style={styles.replyContent}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyUserName}>Mike Chen</Text>
              <Text style={styles.replyUsername}>@mike_c</Text>
              <Text style={styles.timestamp}>• 1h</Text>
            </View>
            <Text style={styles.replyText}>
              Absolutely! Great points here 👏
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewMoreReplies}>
          <Text style={styles.viewMoreText}>View 2 more replies</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 16,
    marginVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  username: {
    color: "#6b7280",
    fontSize: 14,
    marginRight: 6,
  },
  timestamp: {
    color: "#6b7280",
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  commentText: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  likeButton: {
    backgroundColor: "rgba(31, 135, 252, 0.1)",
  },
  actionText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },
  likedText: {
    color: "#1f87fc",
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: "auto",
  },
  repliesContainer: {
    marginTop: 12,
    marginLeft: 52,
  },
  replyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  replyUserName: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 6,
  },
  replyUsername: {
    color: "#6b7280",
    fontSize: 13,
    marginRight: 6,
  },
  replyText: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 18,
  },
  viewMoreReplies: {
    paddingVertical: 8,
    paddingLeft: 36,
  },
  viewMoreText: {
    color: "#1f87fc",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default CommentComponent;
