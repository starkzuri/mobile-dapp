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
import { bigintToLongAddress, bigintToShortStr } from "@/utils/AppUtils";
import styles from "@/styles/notifications";
import MiniFunctions from "@/utils/MiniFunctions";

const RenderNotification = ({
  notification,
  extractZuriPoints,
  getNotificationIcon,
  getNotificationColor,
  markAsRead,
  formatTimestamp,
}) => {
  const caller = bigintToLongAddress(notification?.caller);
  // console.log(caller);

  const user = MiniFunctions(caller.toString());

  const isUnread =
    notification.notification_status.toString() === "129117226099044";
  const zuriPoints = extractZuriPoints(notification.notification_message);
  const iconName = getNotificationIcon(
    notification.notification_type.toString()
  );
  const iconColor = getNotificationColor(
    notification.notification_type.toString()
  );

  let word = notification?.notification_message.split(" ");
  let shiftedWord = word.shift();
  let newSentence = word.join(" ");

  return (
    <TouchableOpacity
      key={notification.notification_id}
      style={[styles.notificationCard, isUnread && styles.unreadCard]}
      onPress={() => markAsRead(notification.notification_id)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationContent}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: iconColor }]}>
            <Ionicons name={iconName} size={12} color="white" />
          </View>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.messageHeader}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>
                {bigintToShortStr(user.username)}
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
              {bigintToShortStr(shiftedWord)} {newSentence}
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

export default RenderNotification;
