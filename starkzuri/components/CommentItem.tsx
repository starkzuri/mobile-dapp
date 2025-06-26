import { useAppContext } from "@/providers/AppProvider";
import React, { useState, useEffect } from "react";
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
import MiniFunctions from "@/utils/MiniFunctions";
import styles from "@/styles/comments";
import {
  bigintToLongAddress,
  bigintToShortStr,
  timeAgo,
} from "@/utils/AppUtils";

const CommentItem = ({ item, handleLike, handleReward, handleAddReply }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const user = MiniFunctions(bigintToLongAddress(item?.caller?.toString()));
  console.log(user);
  const currentUser = {
    id: "current_user",
    username: "you",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: false,
  };

  return (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri:
            user?.profile_pic ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              @
              {bigintToShortStr(user?.username) ||
                `${bigintToLongAddress(item.caller).slice(
                  0,
                  4
                )}...${bigintToLongAddress(item.caller).slice(-4)}`}
            </Text>
            {/* {item.user.verified && <Text style={styles.verifiedBadge}>✓</Text>} */}
            <Text style={styles.timestamp}>
              {timeAgo(item.time_commented.toString() * 1000)}
            </Text>
          </View>
          {item.rewards > 0 && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>
                🎁 {item?.zuri_points?.toString()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.commentText}>{item?.content}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item?.commentId?.toString)}
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
              setReplyingTo(
                replyingTo === item?.commentId?.toString() ? null : item.id
              )
            }
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReward(item?.commentId?.toString())}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionText}>Reward</Text>
          </TouchableOpacity>
        </View>

        {/* Reply Input */}
        {replyingTo === item?.commentId?.toString() && (
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
                placeholder={`Reply to @${item.caller.toString()}...`}
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
                  onPress={() => handleAddReply(item?.commentId?.toString())}
                  disabled={!replyText.trim()}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Replies
        {item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} parentId={item.id} />
            ))}
          </View>
        )} */}
      </View>
    </View>
  );
};

export default CommentItem;
