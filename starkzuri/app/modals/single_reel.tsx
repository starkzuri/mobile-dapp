import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CallData, uint256 } from "starknet";
import Toast from "react-native-toast-message";
import ConfirmPostModal from "@/components/PostConfirmationModal";
import { useAppContext } from "@/providers/AppProvider";
import MiniFunctions from "@/utils/MiniFunctions";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import {
  bigintToLongAddress,
  bigintToShortStr,
  weiToEth,
} from "@/utils/AppUtils";

const { width } = Dimensions.get("window");

// Header Component
const Header = ({ commentsCount, totalLikes, onSortPress, onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
      <Ionicons name="chevron-back" size={28} color="#ffffff" />
    </TouchableOpacity>

    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Comments</Text>
      <View style={styles.headerStats}>
        <Text style={styles.statsText}>{commentsCount} comments</Text>
        <View style={styles.statsDot} />
        <Text style={styles.statsText}>{totalLikes} likes</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
      <Ionicons name="options-outline" size={24} color="#ffffff" />
    </TouchableOpacity>
  </View>
);

// Sort Modal Component
const SortModal = ({ visible, sortBy, onClose, onSortChange }) => {
  const sortOptions = [
    { key: "trending", label: "Trending", icon: "trending-up" },
    { key: "newest", label: "Newest First", icon: "time" },
    { key: "oldest", label: "Oldest First", icon: "hourglass" },
    { key: "most_liked", label: "Most Liked", icon: "heart" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.selectedSort,
              ]}
              onPress={() => {
                onSortChange(option.key);
                onClose();
              }}
            >
              <View style={styles.sortOptionContent}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={sortBy === option.key ? "#1f87fc" : "#888"}
                />
                <Text
                  style={[
                    styles.sortText,
                    sortBy === option.key && styles.selectedSortText,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
              {sortBy === option.key && (
                <Ionicons name="checkmark-circle" size={20} color="#1f87fc" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

// Reactions Component
const Reactions = ({ reactions }) => (
  <View style={styles.reactionsContainer}>
    {reactions.map((reaction, index) => (
      <View key={index} style={styles.reactionBubble}>
        <Text style={styles.reactionEmoji}>
          {reaction.type === "fire"
            ? "🔥"
            : reaction.type === "heart"
            ? "❤️"
            : reaction.type === "clap"
            ? "👏"
            : reaction.type === "star"
            ? "⭐"
            : "😍"}
        </Text>
        <Text style={styles.reactionCount}>{reaction.count}</Text>
      </View>
    ))}
  </View>
);

// Author Info Component
const AuthorInfo = ({ author, timestamp, zuri_points, getTierInfo }) => (
  <View style={styles.commentHeader}>
    <View style={styles.authorSection}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: author.profile_pic }} style={styles.avatar} />
        <View
          style={[styles.tierBadge, { backgroundColor: author.badge_color }]}
        >
          <Ionicons
            name={getTierInfo(author.tier).icon}
            size={8}
            color="#ffffff"
          />
        </View>
      </View>

      <View style={styles.authorInfo}>
        <View style={styles.authorLine}>
          <Text style={styles.authorName}>{bigintToShortStr(author.name)}</Text>
          {/* {author.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#1f87fc" />
          )} */}
          {/* <View style={styles.tierLabel}>
            <Text style={[styles.tierText, { color: author.badge_color }]}>
              {author.tier}
            </Text>
          </View> */}
        </View>
        <Text style={styles.username}>
          @{bigintToShortStr(author.username)} • {author.no_of_followers}{" "}
          followers
        </Text>
      </View>
    </View>

    <View style={styles.metaInfo}>
      <Text style={styles.timestamp}>{timestamp}</Text>
      <View style={styles.pointsBadge}>
        <Ionicons name="diamond-outline" size={12} color="#1f87fc" />
        <Text style={styles.pointsText}>{Number(zuri_points)}</Text>
      </View>
    </View>
  </View>
);

// Action Bar Component
const ActionBar = ({ comment, onLike, onReply }) => (
  <View style={styles.actionBar}>
    <TouchableOpacity
      style={[styles.actionButton, comment.isLiked && styles.likedButton]}
      onPress={() => onLike(comment.commentId)}
    >
      <Ionicons
        name={comment.isLiked ? "heart" : "heart-outline"}
        size={18}
        color={comment.isLiked ? "#ff3742" : "#888"}
      />
      <Text style={[styles.actionText, comment.isLiked && styles.likedText]}>
        {Number(comment.likes)}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => onReply(comment.commentId)}
    >
      <Ionicons name="chatbubble-outline" size={18} color="#888" />
      <Text style={styles.actionText}>{Number(comment.replies)}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton}>
      <Ionicons name="share-social-outline" size={18} color="#888" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.moreAction}>
      <Ionicons name="ellipsis-horizontal" size={18} color="#888" />
    </TouchableOpacity>
  </View>
);

// Comment Content Component
const CommentContent = ({
  content,
  isExpanded,
  shouldTruncate,
  onToggleExpanded,
}) => {
  const displayContent =
    shouldTruncate && !isExpanded ? content.substring(0, 150) + "..." : content;

  return (
    <>
      <Text style={styles.commentContent}>{displayContent}</Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={onToggleExpanded}>
          <Text style={styles.readMore}>
            {isExpanded ? "Show less" : "Read more"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

// Pinned Header Component
const PinnedHeader = ({ engagement_score }) => (
  <View style={styles.pinnedHeader}>
    <Ionicons name="pin" size={14} color="#1f87fc" />
    <Text style={styles.pinnedText}>Pinned Comment</Text>
    <View style={styles.engagementBadge}>
      <Ionicons name="trending-up" size={12} color="#ff6b35" />
      <Text style={styles.engagementText}>{engagement_score}/10</Text>
    </View>
  </View>
);

// Comment Card Component
const CommentCard = ({
  comment,
  isExpanded,
  scaleAnimation,
  getTierInfo,
  formatTimestamp,
  onLike,
  onReply,
  onToggleExpanded,
}) => {
  const { address } = useAppContext();
  const shouldTruncate = comment.content.length > 150;
  const user = MiniFunctions(bigintToLongAddress(comment?.caller?.toString()));
  //   console.log(user);

  return (
    <Animated.View
      style={[
        styles.commentCard,
        comment.isPinned && styles.pinnedCard,
        { transform: [{ scale: scaleAnimation }] },
      ]}
    >
      {comment.isPinned && (
        <PinnedHeader engagement_score={comment.engagement_score} />
      )}

      <AuthorInfo
        author={user}
        timestamp={formatTimestamp(comment.time_commented.toString())}
        zuri_points={comment.zuri_points.toString()}
        getTierInfo={getTierInfo}
      />

      <CommentContent
        content={comment.content}
        isExpanded={isExpanded}
        shouldTruncate={shouldTruncate}
        onToggleExpanded={() => onToggleExpanded(comment.commentId.toString())}
      />

      {comment.reactions && comment.reactions.length > 0 && (
        <Reactions reactions={comment.reactions} />
      )}

      <ActionBar comment={comment} onLike={onLike} onReply={onReply} />
    </Animated.View>
  );
};

// Reply Banner Component
const ReplyBanner = ({ replyingTo, comments, onClose }) => {
  const replyingComment = comments.find((c) => c.commentId === replyingTo);

  return (
    <View style={styles.replyBanner}>
      <Text style={styles.replyText}>
        Replying to @{replyingComment?.author.username}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close-circle" size={20} color="#1f87fc" />
      </TouchableOpacity>
    </View>
  );
};

// Comment Input Component
const CommentInput = ({
  currentUser,
  newComment,
  onCommentChange,
  onSubmit,
  replyingTo,
  comments,
  onCancelReply,
}) => (
  <View style={styles.inputSection}>
    {replyingTo && (
      <ReplyBanner
        replyingTo={replyingTo}
        comments={comments}
        onClose={onCancelReply}
      />
    )}

    <View style={styles.inputContainer}>
      <Image
        source={{ uri: currentUser.profile_pic }}
        style={styles.inputAvatar}
      />
      <View style={styles.inputBox}>
        <TextInput
          style={styles.textInput}
          placeholder="Share your thoughts..."
          placeholderTextColor="#666"
          value={newComment}
          onChangeText={onCommentChange}
          multiline
          maxLength={500}
        />
        <View style={styles.inputFooter}>
          <Text style={styles.charCount}>{newComment.length}/500</Text>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: newComment.trim() ? 1 : 0.5 },
            ]}
            onPress={onSubmit}
            disabled={!newComment.trim()}
          >
            <Ionicons name="send" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

// Main Component
const ReelCommentsPage = () => {
  const { account, contract, isReady, address } = useAppContext();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState("trending");
  const [expandedComments, setExpandedComments] = useState({});
  const { single_reel_id, reel_likes } = useLocalSearchParams();
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const [reelComments, setReelComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [estimateFee, setEstimateFee] = useState("0");
  const [platformFee, setPlatformFee] = useState("0");
  const router = useRouter();
  const user = MiniFunctions(address);

  const [comments, setComments] = useState([
    {
      postId: 1n,
      commentId: 1n,
      content:
        "This is absolutely incredible! 🔥 The creativity and execution are on another level. Keep pushing boundaries!",
      likes: 234n,
      replies: 18n,
      time_commented: 1721226350n,
      zuri_points: 450n,
      isLiked: false,
      isPinned: true,
      engagement_score: 9.2,
      author: {
        username: "sarah_creates",
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
        verified: true,
        tier: "Creator",
        follower_count: "125K",
        badge_color: "#ff6b35",
      },
      reactions: [
        { type: "fire", count: 45 },
        { type: "heart", count: 89 },
        { type: "clap", count: 23 },
      ],
    },
    {
      postId: 1n,
      commentId: 2n,
      content:
        "The attention to detail here is mind-blowing! This is exactly the kind of innovation we need to see more of. Absolutely brilliant work! 💯✨",
      likes: 156n,
      replies: 12n,
      time_commented: 1721228950n,
      zuri_points: 320n,
      isLiked: true,
      isPinned: false,
      engagement_score: 8.7,
      author: {
        username: "alex_vision",
        name: "Alex Thompson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        tier: "Pro",
        follower_count: "89K",
        badge_color: "#4ecdc4",
      },
      reactions: [
        { type: "fire", count: 28 },
        { type: "heart", count: 67 },
        { type: "star", count: 15 },
      ],
    },
    {
      postId: 1n,
      commentId: 3n,
      content:
        "Love the aesthetic choices! The way you've balanced the composition is chef's kiss 👌",
      likes: 89n,
      replies: 7n,
      time_commented: 1721230471n,
      zuri_points: 180n,
      isLiked: false,
      isPinned: false,
      engagement_score: 7.4,
      author: {
        username: "jenny_aesthetic",
        name: "Jennifer Park",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        verified: false,
        tier: "Rising",
        follower_count: "12K",
        badge_color: "#45b7d1",
      },
      reactions: [
        { type: "heart", count: 34 },
        { type: "clap", count: 19 },
      ],
    },
  ]);

  const currentUser = {
    userId: 0n,
    name: "John Doe",
    username: "johndoe_creative",
    profile_pic:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    zuri_points: 2840n,
    tier: "Pro",
    verified: true,
    badge_color: "#4ecdc4",
  };

  const view_comments = () => {
    if (!contract) return;
    // console.log(id);
    const myCall = contract.populate("view_reel_comments", [single_reel_id]);
    setLoading(true);
    contract["view_reel_comments"](myCall.calldata, {
      parseResponse: false,
      parseRequest: false,
    })
      .then((res) => {
        let val = contract.callData.parse(
          "view_reel_comments",
          res?.result ?? res
        );
        // console.log(val);
        setReelComments(val.reverse());
        // console.log(val);
      })
      .catch((err) => {
        console.error("Error: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTierInfo = (tier) => {
    const tiers = {
      Rising: { color: "#45b7d1", icon: "trending-up" },
      Pro: { color: "#4ecdc4", icon: "star" },
      Creator: { color: "#ff6b35", icon: "flame" },
      Elite: { color: "#a855f7", icon: "diamond" },
    };
    return tiers[tier] || tiers.Rising;
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = (commentId) => {
    animatePress();
    setComments(
      comments.map((comment) =>
        comment.commentId === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1n : comment.likes + 1n,
              isLiked: !comment.isLiked,
              zuri_points: comment.isLiked
                ? comment.zuri_points - 5n
                : comment.zuri_points + 5n,
            }
          : comment
      )
    );
  };

  const estimateCommentFees = async () => {
    console.log("estimating");
    setIsModalVisible(true);
    if (!newComment.trim()) return;
    if (!isReady || !account || !contract) return;
    const ETH_ADDRESS =
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    const FEE = BigInt("5900000000000");
    const myCall = contract.populate("comment_on_reel", [
      single_reel_id,
      newComment,
    ]);
    const calls = [
      {
        contractAddress: ETH_ADDRESS,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: CONTRACT_ADDRESS,
          amount: uint256.bnToUint256(FEE),
        }),
      },
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "comment_on_reel",
        calldata: myCall.calldata,
      },
    ];

    try {
      const { suggestedMaxFee, unit } = await account.estimateInvokeFee(calls);

      const feeToEth = weiToEth(suggestedMaxFee, 8);
      const commentFeeToEth = weiToEth(FEE);

      setEstimateFee(feeToEth);
      setPlatformFee(commentFeeToEth);
    } catch (error) {
      console.error("some error occured ", error);
      Toast.show({
        type: "error",
        text1: "comment Failure Predicted",
        text2: "Please try again later 😢",
      });
    }
  };

  const handleAddComment = async () => {
    if (!contract || !account || !isReady) return;
    if (!newComment.trim()) return;

    Toast.show({
      type: "info",
      text1: "Processing Transaction...",
      position: "top",
      autoHide: false,
    });
    const ETH_ADDRESS =
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    const FEE = BigInt("5900000000000");
    const myCall = contract.populate("comment_on_reel", [
      single_reel_id,
      newComment,
    ]);
    console.log(myCall.calldata);
    const calls = [
      {
        contractAddress: ETH_ADDRESS,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: CONTRACT_ADDRESS,
          amount: uint256.bnToUint256(FEE),
        }),
      },
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "comment_on_reel",
        calldata: myCall.calldata,
      },
    ];
    try {
      const res = await account.execute(calls);
      console.log("comment successful ", res);
      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Comment successful!",
        text2: "Your comment is live 🎉",
      });
      view_comments();
    } catch (error) {
      console.error("comment failed ", error);
      Toast.show({
        type: "error",
        text1: "comment Failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setNewComment("");
      setIsModalVisible(false);
    }
  };

  const toggleExpanded = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return Number(a.time_commented) - Number(b.time_commented);
      case "most_liked":
        return Number(b.likes) - Number(a.likes);
      case "trending":
        return b.engagement_score - a.engagement_score;
      default: // newest
        return Number(b.time_commented) - Number(a.time_commented);
    }
  });

  const pinnedComments = sortedComments.filter((c) => c.isPinned);
  const regularComments = sortedComments.filter((c) => !c.isPinned);
  const finalComments = [...pinnedComments, ...regularComments];

  const totalLikes = comments.reduce((acc, c) => acc + Number(c.likes), 0);

  useEffect(() => {
    if (contract) {
      view_comments();
    }
  }, [contract, single_reel_id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      <Header
        commentsCount={reelComments.length}
        totalLikes={reel_likes}
        onSortPress={() => setShowSortModal(true)}
        onBackPress={() => {
          /* Handle back navigation */
          router.back();
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.commentsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {reelComments.map((comment, index) => (
            <CommentCard
              key={Number(index)}
              comment={comment}
              isExpanded={expandedComments[comment.commentId]}
              scaleAnimation={scaleAnimation}
              getTierInfo={getTierInfo}
              formatTimestamp={formatTimestamp}
              onLike={handleLike}
              onReply={() => {}}
              onToggleExpanded={toggleExpanded}
            />
          ))}
        </ScrollView>

        <CommentInput
          currentUser={user}
          newComment={newComment}
          onCommentChange={setNewComment}
          onSubmit={estimateCommentFees}
          replyingTo={replyingTo}
          comments={reelComments}
          onCancelReply={() => setReplyingTo(null)}
        />
      </KeyboardAvoidingView>

      <SortModal
        visible={showSortModal}
        sortBy={sortBy}
        onClose={() => setShowSortModal(false)}
        onSortChange={setSortBy}
      />

      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddComment}
        visible={isModalVisible}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statsText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  statsDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#888",
    marginHorizontal: 8,
  },
  sortButton: {
    padding: 8,
  },
  keyboardContainer: {
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  pinnedCard: {
    borderColor: "#1f87fc",
    backgroundColor: "#1a1a2a",
  },
  pinnedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  pinnedText: {
    fontSize: 12,
    color: "#1f87fc",
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  engagementBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b3520",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  engagementText: {
    fontSize: 10,
    color: "#ff6b35",
    fontWeight: "600",
    marginLeft: 4,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorSection: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  tierBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  authorInfo: {
    flex: 1,
  },
  authorLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 8,
  },
  tierLabel: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  username: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  metaInfo: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f87fc20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 10,
    color: "#1f87fc",
    fontWeight: "600",
    marginLeft: 4,
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#ffffff",
    marginBottom: 12,
  },
  readMore: {
    fontSize: 14,
    color: "#1f87fc",
    fontWeight: "600",
    marginBottom: 12,
  },
  reactionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  reactionBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 16,
  },
  likedButton: {
    backgroundColor: "#ff374220",
  },
  actionText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginLeft: 6,
  },
  likedText: {
    color: "#ff3742",
  },
  moreAction: {
    marginLeft: "auto",
    padding: 8,
  },
  inputSection: {
    backgroundColor: "#0f0f0f",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  replyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1f87fc10",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  replyText: {
    fontSize: 14,
    color: "#1f87fc",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "flex-start",
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginTop: 4,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  textInput: {
    color: "#ffffff",
    fontSize: 15,
    minHeight: 20,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
  },
  sendButton: {
    backgroundColor: "#1f87fc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  selectedSort: {
    backgroundColor: "#1f87fc10",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    marginBottom: 4,
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 12,
    fontWeight: "500",
  },
  selectedSortText: {
    color: "#1f87fc",
    fontWeight: "600",
  },
});

export default ReelCommentsPage;
