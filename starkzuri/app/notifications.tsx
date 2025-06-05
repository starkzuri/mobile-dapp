import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import styles from "../styles/notifications";

const StarkZuriNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reward",
      user: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      },
      message: "Your post earned $12.50 in rewards!",
      time: "5m",
      amount: 12.5,
      unread: true,
      icon: "💰",
    },
    {
      id: 2,
      type: "like",
      user: {
        name: "Marcus Rodriguez",
        username: "@marcusr",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      message: "liked your post about photography",
      time: "12m",
      unread: true,
      icon: "❤️",
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Elena Vasquez",
        username: "@elenadesigns",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      message: "started following you",
      time: "1h",
      unread: true,
      icon: "👤",
    },
    {
      id: 4,
      type: "reward_milestone",
      message: "Congratulations! You've earned $100 total rewards this month!",
      time: "2h",
      amount: 100,
      unread: false,
      icon: "🎉",
    },
    {
      id: 5,
      type: "comment",
      user: {
        name: "Alex Thompson",
        username: "@alextech",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      message: 'commented: "This is amazing work! Keep it up 🔥"',
      time: "3h",
      unread: false,
      icon: "💬",
    },
    {
      id: 6,
      type: "support",
      user: {
        name: "Jamie Wilson",
        username: "@jamiew",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      message: "supported you with $5.00",
      time: "4h",
      amount: 5.0,
      unread: false,
      icon: "💎",
    },
    {
      id: 7,
      type: "share",
      user: {
        name: "David Kim",
        username: "@davidk",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      message: "shared your post",
      time: "6h",
      unread: false,
      icon: "🔄",
    },
    {
      id: 8,
      type: "trending",
      message: "Your post is trending! It's in the top 10 today.",
      time: "8h",
      unread: false,
      icon: "📈",
    },
    {
      id: 9,
      type: "reward",
      user: {
        name: "Lisa Park",
        username: "@lisapark",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      },
      message: "Your comment earned $2.25 in rewards",
      time: "1d",
      amount: 2.25,
      unread: false,
      icon: "💰",
    },
    {
      id: 10,
      type: "feature",
      message: "New feature: Enhanced creator analytics now available!",
      time: "2d",
      unread: false,
      icon: "✨",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false }))
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return notif.unread;
    if (filter === "rewards")
      return (
        notif.type === "reward" ||
        notif.type === "support" ||
        notif.type === "reward_milestone"
      );
    return true;
  });

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationContainer,
        notification.unread && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationLeft}>
          {notification.user ? (
            <Image
              source={{ uri: notification.user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.systemIconContainer}>
              <Text style={styles.systemIcon}>{notification.icon}</Text>
            </View>
          )}
          <View style={styles.iconBadge}>
            <Text style={styles.iconBadgeText}>{notification.icon}</Text>
          </View>
        </View>

        <View style={styles.notificationBody}>
          <View style={styles.notificationText}>
            {notification.user && (
              <Text style={styles.userName}>{notification.user.name} </Text>
            )}
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
          </View>

          {notification.amount && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>+${notification.amount}</Text>
            </View>
          )}

          <Text style={styles.timeText}>{notification.time}</Text>
        </View>

        {notification.unread && <View style={styles.unreadDot} />}
      </View>

      {(notification.type === "follow" || notification.type === "support") && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.followBackButton}>
            <Text style={styles.followBackText}>
              {notification.type === "follow" ? "Follow Back" : "Thank"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewProfileButton}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unread" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "unread" && styles.activeFilterText,
            ]}
          >
            Unread
          </Text>
          {notifications.filter((n) => n.unread).length > 0 && (
            <View style={styles.unreadCount}>
              <Text style={styles.unreadCountText}>
                {notifications.filter((n) => n.unread).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "rewards" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("rewards")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "rewards" && styles.activeFilterText,
            ]}
          >
            Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              {filter === "unread"
                ? "You're all caught up!"
                : filter === "rewards"
                ? "No reward notifications yet"
                : "No notifications to show"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📊</Text>
          <Text style={styles.quickActionText}>View Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>💰</Text>
          <Text style={styles.quickActionText}>Withdraw Rewards</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StarkZuriNotifications;
