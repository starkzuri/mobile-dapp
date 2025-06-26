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
  ImageBackground,
  Pressable,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import CreateReelForm from "@/components/CreateReelForm";

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
    // Animation on press
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

const ReelItem = ({ item, isVisible }) => {
  const videoRef = useRef(null);
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [commentText, setCommentText] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [showControls, setShowControls] = useState(true);

  React.useEffect(() => {
    const playOrPause = async () => {
      if (!videoRef.current) return;

      if (Platform.OS === "web") {
        const domVideo = videoRef.current;
        if (isVisible) {
          domVideo.play?.();
        } else {
          domVideo.pause?.();
        }
      } else {
        if (isVisible) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
      }
    };

    playOrPause();
  }, [isVisible]);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  useFocusEffect(() => {
    return () => {
      if (videoRef.current) {
        if (Platform.OS === "web") {
          videoRef.current.pause?.();
        } else {
          videoRef.current.pauseAsync();
        }
      }
    };
  });

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      // Handle comment submission
      console.log("Sending comment:", commentText);
      setCommentText("");
      setIsCommentFocused(false);
    }
  };

  const video = { uri: item.video };
  const timeAgo = new Date(
    item?.timestamp.toString() * 1000
  ).toLocaleDateString();

  return (
    <SafeAreaView style={styles.reelContainer}>
      <Pressable onPress={toggleControls} style={StyleSheet.absoluteFillObject}>
        <Video
          ref={videoRef}
          source={video}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={isVisible}
          volume={1.0}
          muted={false}
        />

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
          {/* User Info Section */}
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {String(item.caller).charAt(0).toUpperCase()}
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
                <Text style={styles.username}>@user{item.caller}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#1f87fc" />
                </View>
                <Text style={styles.timestamp}>{timeAgo}</Text>
              </View>

              <Text style={styles.caption} numberOfLines={3}>
                {item.description}
              </Text>

              <View style={styles.soundContainer}>
                <Ionicons name="musical-notes" size={14} color="#1f87fc" />
                <Text style={styles.sound}>Original Sound</Text>
              </View>

              {/* Zuri Points Badge */}
              <View style={styles.pointsBadge}>
                <Ionicons name="diamond" size={16} color="#ffd700" />
                <Text style={styles.pointsText}>{item.zuri_points} Points</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <ActionButton
                icon="heart-outline"
                count={item.likes}
                onPress={() => console.log("Like pressed")}
              />
              <ActionButton
                icon="chatbubble-outline"
                count={item.comments}
                onPress={() => setIsCommentFocused(true)}
                style={{ marginTop: 20 }}
              />
              <ActionButton
                icon="arrow-redo-outline"
                count={item.shares}
                onPress={() => console.log("Share pressed")}
                style={{ marginTop: 20 }}
              />
              <ActionButton
                icon="bookmark-outline"
                count={0}
                onPress={() => console.log("Save pressed")}
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

      {/* Enhanced Comment Input */}
      <View
        style={[
          styles.commentInputContainer,
          isCommentFocused && styles.commentInputFocused,
        ]}
      >
        <BlurView intensity={80} style={styles.commentBlur}>
          <View style={styles.commentInputInner}>
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              onFocus={() => setIsCommentFocused(true)}
              onBlur={() => setIsCommentFocused(false)}
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                commentText.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSendComment}
            >
              <Ionicons
                name="send"
                size={20}
                color={commentText.trim() ? "#1f87fc" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
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

  const view_reels = () => {
    const myCall = contract.populate("view_reels", []);
    setLoading(true);
    contract["view_reels"](myCall.calldata, {
      parseResponse: false,
      parseRequest: false,
    })
      .then((res) => {
        let val = contract.callData.parse("view_reels", res?.result ?? res);
        const shuffledArray = val
          .slice()
          .map((obj) => ({ ...obj }))
          .sort(() => Math.random() - 0.5);
        setReels(shuffledArray);
      })
      .catch((err) => {
        console.error("Error: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (contract) {
      view_reels();
    }
  }, [contract]);

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

      <FlatList
        data={reels}
        keyExtractor={(item) => item.reel_id.toString()}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isVisible={index === visibleIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / height);
          setVisibleIndex(index);
        }}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />

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
  commentInputContainer: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 90,
    zIndex: 3,
  },
  commentInputFocused: {
    bottom: 40,
  },
  commentBlur: {
    borderRadius: 25,
    overflow: "hidden",
  },
  commentInputInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    maxHeight: 60,
  },
  sendButton: {
    paddingLeft: 12,
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: "rgba(31, 135, 252, 0.2)",
    borderRadius: 16,
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
