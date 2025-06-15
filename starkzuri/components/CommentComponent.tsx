// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
// import {
//   Heart,
//   MessageCircle,
//   MoreHorizontal,
//   Reply,
// } from "lucide-react-native";
// import { bigintToShortStr } from "@/utils/AppUtils";
// import MiniFunctions from "@/utils/MiniFunctions";
// import { timeAgo } from "@/utils/AppUtils";

// type User = {
//   userId: number;
//   name: number;
//   username: number;
//   about: string;
//   profile_pic: string;
//   cover_photo: string;
//   date_registered: number;
//   no_of_followers: number;
//   number_following: number;
//   notifications: number;
//   zuri_points: number;
// };

// // let comment = {
// //     id: "1",
// //     user: {
// //       name: "Sarah Johnson",
// //       username: "@sarah_j",
// //       avatar:
// //         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
// //     },
// //     content:
// //       "This is such an insightful post! I completely agree with your perspective on modern design trends. The way you explained the balance between functionality and aesthetics really resonates with me.",
// //     timestamp: "2h",
// //     likes: 24,
// //     replies: 3,
// //     isLiked: false,
// //   };

// const CommentComponent = ({ comment }) => {
//   //   console.log(comment.commentId.toString());
//   const [isLiked, setIsLiked] = useState(comment.isLiked);
//   const [likeCount, setLikeCount] = useState(comment.likes);
//   const user = MiniFunctions(comment.caller.toString());

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//     setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Main Comment */}
//       <View style={styles.commentContainer}>
//         {/* Avatar */}
//         <Image
//           source={{
//             uri: user?.profile_pic,
//           }}
//           style={styles.avatar}
//         />

//         {/* Comment Content */}
//         <View style={styles.contentContainer}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.userInfo}>
//               <Text style={styles.userName}>
//                 {bigintToShortStr(user?.name)}
//               </Text>
//               <Text style={styles.username}>
//                 {bigintToShortStr(user?.username)}
//               </Text>
//               <Text style={styles.timestamp}>
//                 • {timeAgo(comment?.time_commented.toString() * 1000)}
//               </Text>
//             </View>
//             <TouchableOpacity style={styles.moreButton}>
//               <MoreHorizontal size={16} color="#6b7280" />
//             </TouchableOpacity>
//           </View>

//           {/* Comment Text */}
//           <Text style={styles.commentText}>{comment?.content}</Text>

//           {/* Actions */}
//           <View style={styles.actions}>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.likeButton]}
//               onPress={handleLike}
//             >
//               <Heart
//                 size={16}
//                 color={isLiked ? "#1f87fc" : "#6b7280"}
//                 fill={isLiked ? "#1f87fc" : "none"}
//               />
//               <Text style={[styles.actionText, isLiked && styles.likedText]}>
//                 {comment.likes.toString()}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionButton}>
//               <MessageCircle size={16} color="#6b7280" />
//               <Text style={styles.actionText}>
//                 {comment.replies.toString()}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.replyButton}>
//               <Reply size={16} color="#6b7280" />
//               <Text style={styles.actionText}>Reply</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Sample Replies */}
//       {/* <View style={styles.repliesContainer}>
//         <View style={styles.replyItem}>
//           <Image
//             source={{
//               uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//             }}
//             style={styles.replyAvatar}
//           />
//           <View style={styles.replyContent}>
//             <View style={styles.replyHeader}>
//               <Text style={styles.replyUserName}>Mike Chen</Text>
//               <Text style={styles.replyUsername}>@mike_c</Text>
//               <Text style={styles.timestamp}>• 1h</Text>
//             </View>
//             <Text style={styles.replyText}>
//               Absolutely! Great points here 👏
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.viewMoreReplies}>
//           <Text style={styles.viewMoreText}>View 2 more replies</Text>
//         </TouchableOpacity>
//       </View> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#2a2a2a",
//     paddingVertical: 16,
//     marginVertical: 5,
//     borderRadius: 5,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#1f2937",
//   },
//   commentContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   contentContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   userInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//   },
//   userName: {
//     color: "#f9fafb",
//     fontSize: 14,
//     fontWeight: "600",
//     marginRight: 6,
//   },
//   username: {
//     color: "#6b7280",
//     fontSize: 14,
//     marginRight: 6,
//   },
//   timestamp: {
//     color: "#6b7280",
//     fontSize: 14,
//   },
//   moreButton: {
//     padding: 4,
//   },
//   commentText: {
//     color: "#e5e7eb",
//     fontSize: 15,
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 6,
//   },
//   likeButton: {
//     backgroundColor: "rgba(31, 135, 252, 0.1)",
//   },
//   actionText: {
//     color: "#6b7280",
//     fontSize: 13,
//     fontWeight: "500",
//   },
//   likedText: {
//     color: "#1f87fc",
//   },
//   replyButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 6,
//     marginLeft: "auto",
//   },
//   repliesContainer: {
//     marginTop: 12,
//     marginLeft: 52,
//   },
//   replyItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   replyAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     marginRight: 8,
//   },
//   replyContent: {
//     flex: 1,
//   },
//   replyHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   replyUserName: {
//     color: "#f9fafb",
//     fontSize: 13,
//     fontWeight: "600",
//     marginRight: 6,
//   },
//   replyUsername: {
//     color: "#6b7280",
//     fontSize: 13,
//     marginRight: 6,
//   },
//   replyText: {
//     color: "#e5e7eb",
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   viewMoreReplies: {
//     paddingVertical: 8,
//     paddingLeft: 36,
//   },
//   viewMoreText: {
//     color: "#1f87fc",
//     fontSize: 13,
//     fontWeight: "500",
//   },
// });

// export default CommentComponent;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const CommentComponent = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(
    initialComments.length > 0
      ? initialComments
      : [
          {
            id: "1",
            text: "This is amazing content! Really love the creativity here 🔥",
            user: {
              id: "user1",
              username: "creator_jane",
              avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
              verified: true,
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            likes: 12,
            liked: false,
            replies: [
              {
                id: "r1",
                text: "Thanks! Glad you enjoyed it 😊",
                user: {
                  id: "user2",
                  username: "artist_mike",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  verified: false,
                },
                timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
                likes: 3,
                liked: true,
                rewards: 25,
              },
            ],
            rewards: 150,
          },
          {
            id: "2",
            text: "Keep up the great work! Your content always inspires me 💪",
            user: {
              id: "user3",
              username: "fan_sarah",
              avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
              verified: false,
            },
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            likes: 8,
            liked: true,
            replies: [],
            rewards: 50,
          },
        ]
  );

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Mock current user
  const currentUser = {
    id: "current_user",
    username: "you",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: false,
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      user: currentUser,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: [],
      rewards: 0,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now().toString(),
      text: replyText,
      user: currentUser,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      rewards: 0,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const handleLike = (commentId, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    liked: !reply.liked,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                  }
                : reply
            ),
          };
        } else if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleReward = (commentId, isReply = false, parentId = null) => {
    Alert.alert("Send Reward", "Send tokens to reward this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send 25 tokens",
        onPress: () => {
          setComments((prev) =>
            prev.map((comment) => {
              if (isReply && comment.id === parentId) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === commentId
                      ? { ...reply, rewards: reply.rewards + 25 }
                      : reply
                  ),
                };
              } else if (comment.id === commentId) {
                return { ...comment, rewards: comment.rewards + 25 };
              }
              return comment;
            })
          );
          Alert.alert("Success", "Reward sent! 🎉");
        },
      },
    ]);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const ReplyItem = ({ reply, parentId }) => (
    <View style={styles.replyContainer}>
      <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
      <View style={styles.replyContent}>
        <View style={styles.replyHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.replyUsername}>@{reply.user.username}</Text>
            {reply.user.verified && <Text style={styles.verifiedBadge}>✓</Text>}
            <Text style={styles.replyTimestamp}>
              {formatTimeAgo(reply.timestamp)}
            </Text>
          </View>
          {reply.rewards > 0 && (
            <View style={styles.miniRewardBadge}>
              <Text style={styles.miniRewardText}>🎁 {reply.rewards}</Text>
            </View>
          )}
        </View>
        <Text style={styles.replyText}>{reply.text}</Text>
        <View style={styles.replyActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(reply.id, true, parentId)}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionIcon, reply.liked && styles.likedIcon]}>
              {reply.liked ? "❤️" : "🤍"}
            </Text>
            <Text style={[styles.actionText, reply.liked && styles.likedText]}>
              {reply.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReward(reply.id, true, parentId)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionText}>Reward</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const CommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{item.user.username}</Text>
            {item.user.verified && <Text style={styles.verifiedBadge}>✓</Text>}
            <Text style={styles.timestamp}>
              {formatTimeAgo(item.timestamp)}
            </Text>
          </View>
          {item.rewards > 0 && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>🎁 {item.rewards}</Text>
            </View>
          )}
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionIcon, item.liked && styles.likedIcon]}>
              {item.liked ? "❤️" : "🤍"}
            </Text>
            <Text style={[styles.actionText, item.liked && styles.likedText]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setReplyingTo(replyingTo === item.id ? null : item.id)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReward(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionText}>Reward</Text>
          </TouchableOpacity>
        </View>

        {/* Reply Input */}
        {replyingTo === item.id && (
          <View style={styles.replyInputContainer}>
            <Image
              source={{ uri: currentUser.avatar }}
              style={styles.replyInputAvatar}
            />
            <View style={styles.replyInputWrapper}>
              <TextInput
                style={styles.replyInput}
                value={replyText}
                onChangeText={setReplyText}
                placeholder={`Reply to @${item.user.username}...`}
                placeholderTextColor="#6B7280"
                multiline
                autoFocus
              />
              <View style={styles.replyButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    !replyText.trim() && styles.replyButtonDisabled,
                  ]}
                  onPress={() => handleAddReply(item.id)}
                  disabled={!replyText.trim()}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Replies */}
        {item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} parentId={item.id} />
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <Image
          source={{ uri: currentUser.avatar }}
          style={styles.inputAvatar}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Share your thoughts..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              !newComment.trim() && styles.postButtonDisabled,
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Header */}
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7}>
          <Text style={styles.sortText}>🔥 Top</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={CommentItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

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

export default CommentComponent;
