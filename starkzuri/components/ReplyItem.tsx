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

import styles from "@/styles/comments";

const ReplyItem = ({
  reply,
  parentId,
  formatTimeAgo,
  handleLike,
  handleReward,
}) => (
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
