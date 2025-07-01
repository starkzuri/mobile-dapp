import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Platform,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { CallData, uint256 } from "starknet";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import CreateReelForm from "@/components/CreateReelForm";
import Toast from "react-native-toast-message";
import ConfirmPostModal from "@/components/PostConfirmationModal";

const { height, width } = Dimensions.get("window");

type Reel = {
  reel_id: number;
  caller: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  video: string;
  timestamp: number;
  description: string;
  zuri_points: number;
};

import { useAppContext } from "@/providers/AppProvider";
import { useFocusEffect } from "expo-router";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import {
  bigintToLongAddress,
  bigintToShortStr,
  weiToEth,
} from "@/utils/AppUtils";
import CommentComponent from "@/components/CommentComponent";
import MiniFunctions from "@/utils/MiniFunctions";

const ActionButton = ({
  icon,
  count,
  onPress,
  isLiked = false,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [localLiked, setLocalLiked] = useState(isLiked);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (icon === "heart" || icon === "heart-outline") {
      setLocalLiked(!localLiked);
    }
    onPress?.();
  };

  const displayIcon =
    icon === "heart" || icon === "heart-outline"
      ? localLiked
        ? "heart"
        : "heart-outline"
      : icon;

  return (
    <Animated.View
      style={[
        styles.actionButton,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Pressable onPress={handlePress} style={styles.actionButtonInner}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={displayIcon}
            size={28}
            color={
              localLiked && (icon === "heart" || icon === "heart-outline")
                ? "#ff3040"
                : "#fff"
            }
          />
        </View>
        {count > 0 && (
          <Text style={styles.actionCount}>
            {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const ReelItem = ({ item, isVisible, shouldLoad }) => {
  const videoRef = useRef(null);
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [showControls, setShowControls] = useState(true);
  const { contract, account, address, isReady } = useAppContext();
  const [estimateFee, setEstimateFee] = useState("0");
  const [platformFee, setPlatformFee] = useState("0");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const user = MiniFunctions(bigintToLongAddress(item?.caller?.toString()));
  console.log(user);
  const router = useRouter();
  const handleVerifyLike = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setConfirmModalOpen(true);

      const reelId = item?.reel_id?.toString();
      if (!reelId) {
        throw new Error("Invalid reel ID");
      }

      if (!contract || !account || !isReady) {
        throw new Error("Contract or account not ready");
      }

      const ETH_ADDRESS =
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      const FEE = BigInt("31000000000000");
      const myCall = contract.populate("like_reel", [item.reel_id]);

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
          entrypoint: "like_reel",
          calldata: myCall.calldata,
        },
      ];

      const { suggestedMaxFee, unit } = await account.estimateInvokeFee(calls);
      const feeToEth = weiToEth(suggestedMaxFee, 8);
      const likeFeeToEth = weiToEth(FEE);

      setEstimateFee(feeToEth);
      setPlatformFee(likeFeeToEth);
    } catch (error) {
      console.error("Failed to estimate fee:", error);
      Toast.show({
        type: "error",
        text1: "Failure Predicted",
        text2: "Please try again later 😢",
      });
      setConfirmModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeReel = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      Toast.show({
        type: "info",
        text1: "Processing Transaction...",
        position: "top",
        autoHide: false,
      });

      const reelId = item?.reel_id?.toString();
      if (!reelId) {
        throw new Error("Invalid reel ID");
      }

      if (!contract || !account || !isReady) {
        throw new Error("Contract or account not ready");
      }

      const ETH_ADDRESS =
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      const FEE = BigInt("31000000000000");
      const myCall = contract.populate("like_reel", [item.reel_id]);

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
          entrypoint: "like_reel",
          calldata: myCall.calldata,
        },
      ];

      const res = await account.execute(calls);
      console.log("Like successful:", res);

      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Like successful!",
        text2: "The post has your like 🎉",
      });
    } catch (error) {
      console.error("Like failed:", error);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Like failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setIsLoading(false);
      setConfirmModalOpen(false);
    }
  };

  const playOrPause = async () => {
    if (!videoRef.current || !videoLoaded) return;

    try {
      if (Platform.OS === "web") {
        const domVideo = videoRef.current;
        if (isVisible) {
          await domVideo.play?.();
        } else {
          await domVideo.pause?.();
        }
      } else {
        if (isVisible) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
      }
    } catch (error) {
      console.error("Video play/pause error:", error);
    }
  };

  // Only play/pause when video is loaded and visibility changes
  useEffect(() => {
    if (videoLoaded) {
      playOrPause();
    }
  }, [isVisible, videoLoaded]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current && videoLoaded) {
          try {
            if (Platform.OS === "web") {
              videoRef.current.pause?.();
            } else {
              videoRef.current.pauseAsync();
            }
          } catch (error) {
            console.error("Video pause error:", error);
          }
        }
      };
    }, [videoLoaded])
  );

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log("Sending comment:", commentText);
      setCommentText("");
      setIsCommentFocused(false);
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
    setVideoError(true);
    setVideoLoaded(false);
  };

  // Safely handle video source
  const videoSource = item?.video ? { uri: item.video } : null;

  // Safely handle timestamp
  const timeAgo = item?.timestamp
    ? new Date(item.timestamp.toString() * 1000).toLocaleDateString()
    : "Unknown";

  // Don't render if essential data is missing
  if (!item) {
    return null;
  }

  return (
    <SafeAreaView style={styles.reelContainer}>
      <Pressable onPress={toggleControls} style={StyleSheet.absoluteFillObject}>
        {/* Only load video when shouldLoad is true */}
        {shouldLoad && videoSource ? (
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay={false} // Control play manually
            volume={1.0}
            muted={false}
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            onLoadStart={() => setVideoLoaded(false)}
          />
        ) : (
          // Placeholder while video loads or if no video
          <View style={styles.videoPlaceholder}>
            {shouldLoad && !videoError ? (
              <ActivityIndicator size="large" color="#1f87fc" />
            ) : videoError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="warning-outline" size={40} color="#ff3040" />
                <Text style={styles.errorText}>Failed to load video</Text>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Ionicons name="play-circle-outline" size={60} color="#fff" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
          </View>
        )}

        {/* Gradient Overlays */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={styles.topGradient}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.bottomGradient}
        />
      </Pressable>

      {/* Main Content Overlay */}
      {showControls && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: slideAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ConfirmPostModal
            gasFee={estimateFee}
            platformFee={platformFee}
            message=""
            onCancel={() => setConfirmModalOpen(false)}
            onConfirm={handleLikeReel}
            visible={confirmModalOpen}
          />

          {/* User Info Section */}
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item?.caller
                    ? String(bigintToShortStr(user.username))
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </Text>
              </View>
              <View style={styles.followButton}>
                <Ionicons name="add" size={12} color="#fff" />
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.captionContainer}>
              <View style={styles.userRow}>
                <Text style={styles.username}>
                  @{bigintToShortStr(user?.username) || "Zuri Guest"}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#1f87fc" />
                </View>
                <Text style={styles.timestamp}>{timeAgo}</Text>
              </View>

              <Text style={styles.caption} numberOfLines={3}>
                {item?.description || "No description available"}
              </Text>

              <View style={styles.soundContainer}>
                <Ionicons name="musical-notes" size={14} color="#1f87fc" />
                <Text style={styles.sound}>Original Sound</Text>
              </View>

              {/* Zuri Points Badge */}
              <View style={styles.pointsBadge}>
                <Ionicons name="diamond" size={16} color="#ffd700" />
                <Text style={styles.pointsText}>
                  {item?.zuri_points || 0} Points
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <ActionButton
                icon="heart-outline"
                count={item?.likes || 0}
                onPress={handleVerifyLike}
              />
              <ActionButton
                icon="chatbubble-outline"
                count={item?.comments || 0}
                onPress={() =>
                  router.push({
                    pathname: "/modals/single_reel",
                    params: {
                      single_reel_id: item?.reel_id?.toString(),
                      reel_likes: item?.likes?.toString(),
                    },
                  })
                }
                style={{ marginTop: 20 }}
              />
              <ActionButton
                icon="arrow-redo-outline"
                count={item?.shares || 0}
                onPress={() => console.log("Share pressed")}
                style={{ marginTop: 20 }}
              />
              <ActionButton
                icon="ellipsis-horizontal"
                count={0}
                onPress={() => console.log("More pressed")}
                style={{ marginTop: 20 }}
              />
            </View>
          </View>
        </Animated.View>
      )}

      {/* <Modal>
        <CommentComponent postId={1} />
      </Modal> */}
    </SafeAreaView>
  );
};

export default function App() {
  const { contract, isReady, account } = useAppContext();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const view_reels = async () => {
    if (!contract || loading) return;

    try {
      setLoading(true);
      const myCall = contract.populate("view_reels", []);

      const res = await contract["view_reels"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const val = contract.callData.parse("view_reels", res?.result ?? res);

      if (Array.isArray(val)) {
        const shuffledArray = val
          .slice()
          .map((obj) => ({ ...obj }))
          .sort(() => Math.random() - 0.5);
        setReels(shuffledArray);
      } else {
        console.warn("Invalid reels data received:", val);
        setReels([]);
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && isReady) {
      view_reels();
    }
  }, [contract, isReady]);

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / height);
    setVisibleIndex(index);
  };

  // Determine which videos should be loaded (current + adjacent ones)
  const shouldLoadVideo = (index) => {
    const loadRange = 1; // Load current + 1 above and below
    return Math.abs(index - visibleIndex) <= loadRange;
  };

  const renderReelItem = ({ item, index }) => (
    <ReelItem
      item={item}
      isVisible={index === visibleIndex}
      shouldLoad={shouldLoadVideo(index)}
    />
  );

  const keyExtractor = (item) => {
    return item?.reel_id?.toString() || Math.random().toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reels</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1f87fc" />
          <Text style={styles.loadingText}>Loading reels...</Text>
        </View>
      ) : (
        <FlatList
          data={reels}
          keyExtractor={keyExtractor}
          renderItem={renderReelItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast"
          snapToAlignment="start"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          windowSize={3}
          initialNumToRender={1}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <CreateReelForm onClose={() => setModalVisible(false)} />
      </Modal>

      {/* Enhanced Create Button */}
      <Animated.View style={[styles.createReelButton, { opacity: fadeAnim }]}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.createButtonInner}
        >
          <LinearGradient
            colors={["#1f87fc", "#4c9eff"]}
            style={styles.createButtonGradient}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  reelContainer: {
    width,
    height,
    position: "relative",
  },
  video: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  videoPlaceholder: {
    width,
    height,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
  },
  errorText: {
    color: "#ff3040",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    zIndex: 2,
  },
  userInfoContainer: {
    position: "absolute",
    right: 16,
    top: height * 0.15,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1f87fc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  followButton: {
    position: "absolute",
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ff3040",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  captionContainer: {
    width: "75%",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  verifiedBadge: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  timestamp: {
    color: "#ccc",
    fontSize: 12,
    marginLeft: 8,
  },
  caption: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  soundContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sound: {
    color: "#1f87fc",
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "500",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  pointsText: {
    color: "#ffd700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonInner: {
    alignItems: "center",
    padding: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  actionCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  createReelButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 4,
  },
  createButtonInner: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
