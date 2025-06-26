import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
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
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import RewardCards from "@/components/RewardCard";
import { useAppContext } from "@/providers/AppProvider";
import { bigintToShortStr } from "@/utils/AppUtils";
import MiniFunctions from "@/utils/MiniFunctions";
import ProfileUpdateComponent from "@/components/UpdateUser";
import ConfirmPostModal from "@/components/PostConfirmationModal";

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

const UserProfile = () => {
  const { account, isReady, contract } = useAppContext();
  const user = MiniFunctions(account?.address?.toString());
  // console.log(account);
  const [modalVisible, setModalVisible] = useState(false);

  // console.log(user);
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample user data with BigInt conversion handled
  const userData = {
    userId:
      "3576822344088438784960174474173613065167062044832123606782432014284400833814",
    name: "Felix Awere", // Decoded from BigInt
    username: "felabs", // Decoded from BigInt
    about: "Founder, Stark Zuri",
    profile_pic:
      "https://hambre.infura-ipfs.io/ipfs/QmdZ3v9VC3wWcVxAdqADvPGnaKYyYjXDDbL5G7BEVWwv8u",
    cover_photo:
      "https://hambre.infura-ipfs.io/ipfs/QmWN4W1bpmxPVnKXgrRwTCU4WtwcFksPw3wgeudN6EqGWR",
    date_registered: new Date(Number("1720735255") * 1000),
    no_of_followers: "14",
    number_following: "7",
    notifications: "95",
    zuri_points: "23,999",
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const StatCard = ({ icon: Icon, label, value, color = "#ffffff" }) => (
    <View style={styles.statCard}>
      <Icon size={20} color={color} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: user?.cover_photo }}
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
              {userData.notifications !== "0" && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{userData.notifications}</Text>
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
              source={{ uri: user?.profile_pic }}
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
                {bigintToShortStr(user?.name)}
              </Text>
              <View style={styles.verifiedBadge}>
                <Star size={16} color="#1f87fc" fill="#1f87fc" />
              </View>
            </View>
            <Text style={styles.username}>
              @{bigintToShortStr(user.username)}
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
            {/* <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <UserPlus size={18} color={isFollowing ? "#1f87fc" : "#ffffff"} />
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.followButton}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <UserPlus size={18} color={"#ffffff"} />
              <Text
                style={[styles.followButtonText]}
                onPress={() => setModalVisible(true)}
              >
                Update Account
              </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
              <ProfileUpdateComponent onClose={() => setModalVisible(false)} />
            </Modal>

            {/* <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Sell Zuri Points</Text>
            </TouchableOpacity> */}
          </View>
        </View>

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
          {/* <StatCard icon={Award} label="Rewards" value="12" color="#ff6b6b" /> */}
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
            Your rewards and interactions are secured by StarkNet's
            zero-knowledge technology
          </Text>
          <View style={styles.userIdContainer}>
            <Text style={styles.userIdLabel}>User ID:</Text>
            <Text
              style={styles.userId}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {userData.userId}
            </Text>
          </View>
        </View>
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
});

export default UserProfile;
