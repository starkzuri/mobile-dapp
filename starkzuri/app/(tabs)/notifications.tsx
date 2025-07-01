//

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "@/providers/AppProvider";
import MiniFunctions from "@/utils/MiniFunctions";
import { bigintToLongAddress, bigintToShortStr } from "@/utils/AppUtils";
import RenderNotification from "@/components/RenderNotification";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const StarkZuriNotifications = () => {
  const { contract, account, isReady, viewUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(0));
  // const user = MiniFunctions("");
  const user = MiniFunctions(account?.address?.toString());

  // Mock user data - in real app this would come from your user service
  const mockUsers = {
    "85103766236013673763402341": {
      username: "alex_creator",
      profilePic:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    "135878797943861642785159013": {
      username: "sarah_dev",
      profilePic:
        "https://images.unsplash.com/photo-1494790108755-2616b332c265?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    "0": {
      username: "zuri_system",
      profilePic:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
  };

  const fetchNotifications = async () => {
    if (!contract || !account) return;
    const userAddress = account?.address?.toString();
    const myCall = contract.populate("view_notifications", [userAddress]);
    setIsLoading(true);
    contract["view_notifications"](myCall.calldata, {
      parseResponse: false,
      parseRequest: false,
    })
      .then((res) => {
        let val = contract.callData.parse(
          "view_notifications",
          res?.result ?? res
        );

        // setUsers(val);
        console.log("Notifications", val);
        setNotifications(val.reverse());
        // console.log(val)
        // setNotifications(val.reverse());
      })
      .catch((err) => {
        console.error("Error: ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
    // setNotifications(sampleNotifications);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [contract, account]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "1818848101": // like
        return "heart";
      case "27988538471837300": // comment
        return "chatbubble";
      case "28832959090882337": // follow
        return "person-add";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "1818848101": // like
        return "#ff3040";
      case "27988538471837300": // comment
        return "#1f87fc";
      case "28832959090882337": // follow
        return "#00d4aa";
      default:
        return "#1f87fc";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const extractZuriPoints = (message) => {
    const match = message.match(/(\d+)\s+[Zz]uri\s+points?/);
    return match ? parseInt(match[1]) : null;
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.notification_id === notificationId
          ? { ...notif, notification_status: "0" }
          : notif
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderNotification = (notification) => {
    // const user = mockUsers[notification.caller] || {
    //   username: "unknown_user",
    //   profilePic:
    //     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    //   verified: false,
    // };

    const caller = bigintToLongAddress(notification?.caller);
    const user = viewUser(caller.toString()) || {
      username: "unknown_user",
      profilePic:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      verified: false,
    };
    // console.log(user);

    // console.log(caller);

    // const user2 = <MiniFunctions accountAddress={caller.toString()} />;

    const isUnread = notification.notification_status === "129117226099044";
    const zuriPoints = extractZuriPoints(notification.notification_message);
    const iconName = getNotificationIcon(notification.notification_type);
    const iconColor = getNotificationColor(notification.notification_type);

    return (
      <TouchableOpacity
        key={notification.notification_id}
        style={[styles.notificationCard, isUnread && styles.unreadCard]}
        onPress={() => markAsRead(notification.notification_id)}
        activeOpacity={0.8}
      >
        <View style={styles.notificationContent}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user?.profile_pic }} style={styles.avatar} />
            <View style={[styles.iconBadge, { backgroundColor: iconColor }]}>
              <Ionicons name={iconName} size={12} color="white" />
            </View>
          </View>

          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <View style={styles.usernameContainer}>
                <Text style={styles.username}>
                  {bigintToShortStr(user?.username)}
                </Text>
                {/* {user.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#1f87fc" />
                )} */}
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(notification.timestamp)}
              </Text>
            </View>

            <Text style={styles.message}>
              <Text style={styles.action}>
                {notification.notification_message}
              </Text>
            </Text>

            {zuriPoints && (
              <View style={styles.pointsContainer}>
                <Ionicons name="diamond" size={16} color="#ffd700" />
                <Text style={styles.pointsText}>+{zuriPoints} Zuri Points</Text>
              </View>
            )}
          </View>

          {isUnread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1f87fc"
              colors={["#1f87fc"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notification, index) => (
            <RenderNotification
              key={index}
              markAsRead={markAsRead}
              formatTimestamp={formatTimestamp}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
              notification={notification}
              extractZuriPoints={extractZuriPoints}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#1f87fc20",
  },
  markAllText: {
    color: "#1f87fc",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: "#111111",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  unreadCard: {
    backgroundColor: "#151515",
    borderColor: "#1f87fc30",
  },
  notificationContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333",
  },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#111111",
  },
  messageContainer: {
    flex: 1,
    paddingRight: 8,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 4,
  },
  timestamp: {
    color: "#888",
    fontSize: 14,
  },
  message: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  action: {
    color: "#ddd",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffd70020",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  pointsText: {
    color: "#ffd700",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1f87fc",
    marginTop: 4,
  },
});

export default StarkZuriNotifications;
