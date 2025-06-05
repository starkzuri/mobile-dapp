import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import styles from "../styles/index";
import {
  bigintToLongAddress,
  truncateAddress,
  bigintToShortStr,
  formatDate,
  getUint256CalldataFromBN,
  parseInputAmountToUint256,
  timeAgo,
} from "../utils/AppUtils";
import { router } from "expo-router";

const PostItem = ({ post, handleLike }) => (
  <Pressable
    onPress={() => router.push("/_hidden/single_post")}
    style={styles.postContainer}
  >
    {/* Post Header */}
    <View style={styles.postHeader}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: post?.images.split(",")[0] }}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {truncateAddress(bigintToLongAddress(post?.caller))}
            </Text>
            {/* {post.user.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )} */}
          </View>
          <Text style={styles.userHandle}>
            {`missing_val`} • {timeAgo(post?.date_posted * 1000n)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreText}>⋯</Text>
      </TouchableOpacity>
    </View>

    {/* Post Content */}
    <Text style={styles.postContent}>{post.content}</Text>
    {post.images && (
      <Image
        source={{ uri: post?.images.split(",")[0] }}
        style={styles.postImage}
      />
    )}

    {/* Rewards Section */}
    <View style={styles.rewardsContainer}>
      <View style={styles.rewardsHeader}>
        <View style={styles.rewardsLabel}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.rewardsText}>Creator Rewards</Text>
        </View>
        <View style={styles.rewardsAmount}>
          <Text style={styles.trendingIcon}>📈</Text>
          <Text style={styles.rewardsValue}>ZRP {post?.zuri_points}</Text>
        </View>
      </View>
    </View>

    {/* Action Buttons */}
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleLike(post.id)}
      >
        <Text
          style={[
            styles.actionIcon,
            { color: post.liked ? "#ff4757" : "#8e8e93" },
          ]}
        >
          {post.liked ? "❤️" : "🤍"}
        </Text>
        <Text style={styles.actionText}>{post.likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>{post.comments}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>🔄</Text>
        <Text style={styles.actionText}>{post.shares}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionIcon}>📤</Text>
      </TouchableOpacity>
    </View>

    {/* Call to Action Buttons */}
    <View style={styles.ctaContainer}>
      <TouchableOpacity style={styles.supportButton}>
        <Text style={styles.supportButtonText}>💎 Support Creator</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>+ Follow</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
);

export default PostItem;
