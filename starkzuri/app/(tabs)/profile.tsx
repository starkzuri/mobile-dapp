import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  ToastAndroid,
  Platform,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import {
  Bell,
  Users,
  UserPlus,
  Settings,
  Award,
  Calendar,
  Star,
  Zap,
  FileText,
  Video,
  Gift,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Play,
  Clock,
} from "lucide-react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import Markdown from "react-native-markdown-display";
import { useAppContext } from "@/providers/AppProvider";
import {
  bigintToLongAddress,
  bigintToShortStr,
  htmlToMarkdown,
} from "@/utils/AppUtils";

import MiniFunctions from "@/utils/MiniFunctions";
import ProfileUpdateComponent from "@/components/UpdateUser";
import * as Clipboard from "expo-clipboard";
// import { Video } from "expo-av";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";

const { width } = Dimensions.get("window");

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

type Post = {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  rewardAmount: number;
  rewardClaimed: boolean;
};

type VideoPost = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadDate: string;
  rewardAmount: number;
  rewardClaimed: boolean;
};

type ItemReel = {
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

const UserProfile = () => {
  const { account, isReady, contract, address } = useAppContext();
  const user = MiniFunctions(account?.address?.toString());
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [accountPosts, setAccountPosts] = useState([]);
  const [accountReels, setAccountReels] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});

  // Sample posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content:
        "Just deployed my first smart contract on StarkNet! The zero-knowledge proofs are incredible. #StarkNet #Web3",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2h ago",
      rewardAmount: 150,
      rewardClaimed: false,
    },
    {
      id: "2",
      content:
        "Building the future of decentralized social media with Zuri. Every interaction matters! 🚀",
      likes: 42,
      comments: 12,
      shares: 7,
      timestamp: "1d ago",
      rewardAmount: 200,
      rewardClaimed: true,
    },
    {
      id: "3",
      content:
        "Love how the community is growing! Thanks everyone for the amazing support.",
      likes: 18,
      comments: 5,
      shares: 2,
      timestamp: "3d ago",
      rewardAmount: 100,
      rewardClaimed: false,
    },
  ]);

  // Sample videos data
  const [videos, setVideos] = useState<VideoPost[]>([
    {
      id: "1",
      title: "Introduction to StarkNet Development",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
      duration: "12:45",
      views: 1240,
      likes: 89,
      uploadDate: "2 days ago",
      rewardAmount: 500,
      rewardClaimed: false,
    },
    {
      id: "2",
      title: "Building Your First DApp Tutorial",
      thumbnail:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500",
      duration: "18:30",
      views: 2100,
      likes: 156,
      uploadDate: "1 week ago",
      rewardAmount: 750,
      rewardClaimed: true,
    },
    {
      id: "3",
      title: "Zuri Platform Demo & Features",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",
      duration: "8:22",
      views: 890,
      likes: 67,
      uploadDate: "2 weeks ago",
      rewardAmount: 300,
      rewardClaimed: false,
    },
  ]);

  const generateThumbnails = async (videoList: ItemReel[]) => {
    const thumbnailPromises = videoList.map(async (video) => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(video.video, {
          time: 1000,
          quality: 0.7,
        });
        return { id: video.reel_id, uri };
      } catch (error) {
        console.warn(
          "Error generating thumbnail for video:",
          video.reel_id,
          error
        );
        return { id: video.reel_id, uri: null };
      }
    });

    const results = await Promise.all(thumbnailPromises);
    const thumbnailMap = results.reduce((acc, { id, uri }) => {
      if (uri) acc[id] = uri;
      return acc;
    }, {} as { [key: number]: string });

    setThumbnails(thumbnailMap);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const fetchAccountPosts = async () => {
    setActiveTab("posts");
    if (!contract || !address) return;
    try {
      const userAddress = address;
      const myCall = await contract.populate("filter_post", [userAddress]);

      const res = await contract["filter_post"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const val = res;
      console.log(val);
      setAccountPosts(val);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchAccountReels = async () => {
    setActiveTab("videos");
    if (!contract || !address) return;
    try {
      const userAddress = address;
      console.log(userAddress);
      console.log(
        bigintToLongAddress(
          "3391788539791032941773455875793408118539667857541541869595421923442553932255"
        )
      );

      const myCall = await contract.populate("view_reels", []);

      const res = await contract["view_reels"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const val = res;
      // console.log(val);
      const _accountReels = [];
      val.map((item) => {
        if (bigintToLongAddress(item?.caller) === userAddress) {
          _accountReels.push(item);
        }
      });
      // console.log(accountReels);
      setAccountReels(_accountReels);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const estimateClaimFees = (type: "post" | "video", id: string) => {};

  const claimReward = (type: "post" | "video", id: string) => {
    // claim functionality to be added here

    if (Platform.OS === "android") {
      ToastAndroid.show("Reward claimed successfully!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", "Reward claimed successfully!");
    }
  };

  useEffect(() => {
    if (accountReels.length > 0) {
      generateThumbnails(accountReels);
    }
  }, [accountReels]);

  const StatCard = ({ icon: Icon, label, value, color = "#ffffff" }) => (
    <View style={styles.statCard}>
      <Icon size={20} color={color} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const PostCard = ({ post }: { post: Post }) => (
    <View style={styles.postCard}>
      {/* <Text style={styles.postContent}>{post.content}</Text> */}
      <Markdown
        style={{
          body: { color: "white" },
          heading1: { color: "white" },
          bullet_list_icon: { color: "white" },
          link: { color: "#1f87fc" },
        }}
      >
        {htmlToMarkdown(post?.content)}
      </Markdown>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      <View style={styles.postStats}>
        <View style={styles.postStatsLeft}>
          <View style={styles.statItem}>
            <Heart size={16} color="#ff6b6b" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={16} color="#1f87fc" />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
          <View style={styles.statItem}>
            <Share size={16} color="#00ff88" />
            <Text style={styles.statText}>{post.shares}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>
      <View style={styles.rewardSection}>
        <View style={styles.rewardInfo}>
          <Zap size={16} color="#ffd700" />
          <Text style={styles.rewardText}>{post.rewardAmount} Zuri Points</Text>
        </View>
        {!post.rewardClaimed ? (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => claimReward("post", post.id)}
          >
            <Gift size={16} color="#ffffff" />
            <Text style={styles.claimButtonText}>Claim</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.claimedBadge}>
            <Text style={styles.claimedText}>Claimed</Text>
          </View>
        )}
      </View>
    </View>
  );

  // const VideoCard = ({ video }: { video: ItemReel }) => (
  //   <View style={styles.videoCard}>
  //     <View style={styles.videoThumbnailContainer}>
  //       <Image
  //         source={{ uri: video.thumbnail }}
  //         style={styles.videoThumbnail}
  //       />
  //       <View style={styles.playButton}>
  //         <Play size={20} color="#ffffff" fill="#ffffff" />
  //       </View>
  //       <View style={styles.videoDuration}>
  //         <Text style={styles.durationText}>{video.duration}</Text>
  //       </View>
  //     </View>
  //     <View style={styles.videoInfo}>
  //       <Text style={styles.videoTitle}>{video.title}</Text>
  //       <View style={styles.videoStats}>
  //         <View style={styles.videoStatsLeft}>
  //           <View style={styles.statItem}>
  //             <Eye size={14} color="#666666" />
  //             <Text style={styles.videoStatText}>{video.views} views</Text>
  //           </View>
  //           <View style={styles.statItem}>
  //             <Heart size={14} color="#ff6b6b" />
  //             <Text style={styles.videoStatText}>{video.likes}</Text>
  //           </View>
  //         </View>
  //         <Text style={styles.videoDate}>{video.uploadDate}</Text>
  //       </View>
  //       <View style={styles.rewardSection}>
  //         <View style={styles.rewardInfo}>
  //           <Zap size={16} color="#ffd700" />
  //           <Text style={styles.rewardText}>
  //             {video.rewardAmount} Zuri Points
  //           </Text>
  //         </View>
  //         {!video.rewardClaimed ? (
  //           <TouchableOpacity
  //             style={styles.claimButton}
  //             onPress={() => claimReward("video", video.id)}
  //           >
  //             <Gift size={16} color="#ffffff" />
  //             <Text style={styles.claimButtonText}>Claim</Text>
  //           </TouchableOpacity>
  //         ) : (
  //           <View style={styles.claimedBadge}>
  //             <Text style={styles.claimedText}>Claimed</Text>
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   </View>
  // );

  const VideoCard = ({
    video,
    thumbnailUri,
  }: {
    video: ItemReel;
    thumbnailUri?: string;
  }) => {
    // Helper function to format timestamp to readable date
    const formatDate = (ts: number | bigint | string): string => {
      // Normalize to a safe integer number of seconds
      let seconds: number;
      if (typeof ts === "bigint") {
        seconds = Number(ts);
      } else if (typeof ts === "string") {
        // ensure it’s all digits
        if (!/^\d+$/.test(ts))
          throw new Error(`Invalid timestamp string: ${ts}`);
        seconds = Number(ts);
      } else {
        seconds = ts;
      }

      // Now create the Date (milliseconds)
      const date = new Date(seconds * 1000);
      // Format however you like:
      return date.toLocaleDateString(); // e.g. "7/31/2025"
      // return date.toLocaleString();             // with time
      // return date.toISOString().slice(0, 10);   // YYYY‑MM‑DD
    };
    // Helper function to format view count (you might want to get actual view count from elsewhere)
    const formatViews = (likes: number) => {
      // Since there's no views field, using likes as a proxy or you can remove this
      return likes > 1000 ? `${(likes / 1000).toFixed(1)}k` : likes.toString();
    };

    return (
      <View style={styles.videoCard}>
        <View style={styles.videoThumbnailContainer}>
          {thumbnailUri ? (
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.videoThumbnail}
            />
          ) : (
            <View
              style={[
                styles.videoThumbnail,
                {
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Play size={40} color="#ffffff" fill="#ffffff" />
            </View>
          )}
          <View style={styles.playButton}>
            <Play size={20} color="#ffffff" fill="#ffffff" />
          </View>
        </View>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.description}</Text>
          <View style={styles.videoStats}>
            <View style={styles.videoStatsLeft}>
              <View style={styles.statItem}>
                <Eye size={14} color="#666666" />
                <Text style={styles.videoStatText}>
                  {formatViews(video.likes)} views
                </Text>
              </View>
              <View style={styles.statItem}>
                <Heart size={14} color="#ff6b6b" />
                <Text style={styles.videoStatText}>{video.likes}</Text>
              </View>
            </View>
            <Text style={styles.videoDate}>{formatDate(video.timestamp)}</Text>
          </View>
          <View style={styles.rewardSection}>
            <View style={styles.rewardInfo}>
              <Zap size={16} color="#ffd700" />
              <Text style={styles.rewardText}>
                {video.zuri_points} Zuri Points
              </Text>
            </View>
            {/* You'll need to add a claimed status to your ItemReel type or manage it separately */}
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => claimReward("video", video.reel_id.toString())}
            >
              <Gift size={16} color="#ffffff" />
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const TabButton = ({ title, icon: Icon, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Icon size={20} color={isActive ? "#1f87fc" : "#666666"} />
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileContent = () => (
    <>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatCard
          icon={Users}
          label="Followers"
          value={user?.no_of_followers.toString()}
          color="#1f87fc"
        />
        <StatCard
          icon={UserPlus}
          label="Following"
          value={user?.number_following.toString()}
          color="#1f87fc"
        />
        <StatCard
          icon={Zap}
          label="Zuri Points"
          value={user?.zuri_points.toString()}
          color="#ffd700"
        />
      </View>

      {/* Zuri Points Section */}
      <View style={styles.pointsSection}>
        <View style={styles.pointsHeader}>
          <Zap size={24} color="#ffd700" />
          <Text style={styles.pointsTitle}>Zuri Points</Text>
        </View>
        <Text style={styles.pointsSubtitle}>
          Earn points by creating engaging content and interacting with the
          community
        </Text>
        <View style={styles.pointsProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "25%" }]} />
          </View>
          <Text style={styles.progressText}>Next reward at 100 points</Text>
        </View>
      </View>

      {/* StarkNet Integration Info */}
      <View style={styles.blockchainSection}>
        <Text style={styles.blockchainTitle}>Built on StarkNet</Text>
        <Text style={styles.blockchainSubtitle}>
          Your rewards and interactions are secured by StarkNet's zero-knowledge
          technology
        </Text>
        <View style={styles.userIdContainer}>
          <Text style={styles.userIdLabel}>User ID:</Text>
          <Pressable
            onPress={() => {
              Clipboard.setStringAsync(address);
              if (Platform.OS === "android") {
                ToastAndroid.show("Address copied!", ToastAndroid.SHORT);
              } else {
                Alert.alert("Copied", "Address has been copied to clipboard.");
              }
            }}
          >
            <Text
              style={[styles.userId, { textDecorationLine: "underline" }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {address}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );

  const renderPostsContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>My Posts</Text>
      <FlatList
        data={accountPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.postId}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  const renderVideosContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>My Videos</Text>
      <FlatList
        data={accountReels}
        renderItem={({ item }) => (
          <VideoCard video={item} thumbnailUri={thumbnails[item.reel_id]} />
        )}
        keyExtractor={(item) => item?.reel_id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri:
                user?.cover_photo ||
                "https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png",
            }}
            style={styles.coverPhoto}
            defaultSource={{
              uri: user?.cover_photo,
            }}
          />
          <View style={styles.coverOverlay} />

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Bell size={20} color="#ffffff" />
              {user?.notifications.toString() !== "0" && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {user?.notifications.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Settings size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <Image
              source={{
                uri:
                  user?.profile_pic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
              style={styles.profilePic}
              defaultSource={{
                uri: user?.cover_photo,
              }}
            />
            <View style={styles.onlineIndicator} />
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.displayName}>
                {bigintToShortStr(user?.name) || "Zuri Guest"}
              </Text>
              <View style={styles.verifiedBadge}>
                <Star size={16} color="#1f87fc" fill="#1f87fc" />
              </View>
            </View>
            <Text style={styles.username}>
              @{bigintToShortStr(user.username) || "zuriguest"}
            </Text>
            <Text style={styles.about}>{user?.about}</Text>

            {/* Join Date */}
            <View style={styles.joinDate}>
              <Calendar size={14} color="#666666" />
              <Text style={styles.joinDateText}>
                Joined{" "}
                {formatDate(
                  new Date(Number(user?.date_registered?.toString()) * 1000)
                )}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => setModalVisible(true)}
            >
              <UserPlus size={18} color={"#ffffff"} />
              <Text style={styles.followButtonText}>Update Account</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
              <ProfileUpdateComponent onClose={() => setModalVisible(false)} />
            </Modal>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton
            title="Profile"
            icon={Settings}
            isActive={activeTab === "profile"}
            onPress={() => setActiveTab("profile")}
          />
          <TabButton
            title="Posts"
            icon={FileText}
            isActive={activeTab === "posts"}
            onPress={fetchAccountPosts}
          />
          <TabButton
            title="Videos"
            icon={Video}
            isActive={activeTab === "videos"}
            onPress={fetchAccountReels}
          />
        </View>

        {/* Tab Content */}
        {activeTab === "profile" && renderProfileContent()}
        {activeTab === "posts" && renderPostsContent()}
        {activeTab === "videos" && renderVideosContent()}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  coverContainer: {
    position: "relative",
    height: 200,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerActions: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 25,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileSection: {
    padding: 20,
    paddingTop: 0,
  },
  profilePicContainer: {
    alignSelf: "center",
    marginTop: -50,
    position: "relative",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#0a0a0a",
    backgroundColor: "#1a1a1a",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00ff88",
    borderWidth: 3,
    borderColor: "#0a0a0a",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  verifiedBadge: {
    backgroundColor: "rgba(31, 135, 252, 0.1)",
    padding: 4,
    borderRadius: 12,
  },
  username: {
    fontSize: 16,
    color: "#1f87fc",
    marginTop: 4,
  },
  about: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  joinDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  joinDateText: {
    fontSize: 12,
    color: "#666666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    justifyContent: "center",
  },
  followButton: {
    backgroundColor: "#1f87fc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#1f87fc",
  },
  followButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  followingButtonText: {
    color: "#1f87fc",
  },
  messageButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  messageButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: "#0a0a0a",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  activeTabButtonText: {
    color: "#1f87fc",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  pointsSection: {
    margin: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  pointsSubtitle: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 16,
    lineHeight: 20,
  },
  pointsProgress: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#333333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffd700",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  blockchainSection: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1f87fc",
  },
  blockchainTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f87fc",
    marginBottom: 8,
  },
  blockchainSubtitle: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 16,
    lineHeight: 20,
  },
  userIdContainer: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
  },
  userIdLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: "#1f87fc",
    fontFamily: "monospace",
  },
  postCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  postContent: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#333333",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postStatsLeft: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: "#cccccc",
  },
  timestamp: {
    fontSize: 12,
    color: "#666666",
  },
  rewardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
  },
  rewardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rewardText: {
    fontSize: 14,
    color: "#ffd700",
    fontWeight: "bold",
  },
  claimButton: {
    backgroundColor: "#1f87fc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  claimButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  claimedBadge: {
    backgroundColor: "#00ff88",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  claimedText: {
    color: "#0a0a0a",
    fontSize: 12,
    fontWeight: "bold",
  },
  videoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  videoThumbnailContainer: {
    position: "relative",
    marginBottom: 12,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#333333",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 12,
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  videoInfo: {
    gap: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 22,
  },
  videoStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoStatsLeft: {
    flexDirection: "row",
    gap: 16,
  },
  videoStatText: {
    fontSize: 12,
    color: "#cccccc",
  },
  videoDate: {
    fontSize: 12,
    color: "#666666",
  },
});

export default UserProfile;
