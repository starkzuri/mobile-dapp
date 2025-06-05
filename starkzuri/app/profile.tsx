import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/profile";

const { width } = Dimensions.get("window");

const StarkZuriProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [following, setFollowing] = useState(false);

  const userStats = {
    followers: "12.4K",
    following: "892",
    posts: "156",
    totalRewards: "2,847.5",
    weeklyEarnings: "+124.8",
    rank: "#247",
  };

  const recentPosts = [
    {
      id: 1,
      content:
        "Just discovered this amazing DeFi protocol! The yields are insane 🚀 #DeFi #Crypto",
      likes: 342,
      comments: 89,
      rewards: "45.2",
      timestamp: "2h ago",
      engagement: 98,
    },
    {
      id: 2,
      content:
        "Market analysis: Bitcoin looking bullish after breaking the resistance. What do you think? 📈",
      likes: 567,
      comments: 134,
      rewards: "78.9",
      timestamp: "6h ago",
      engagement: 156,
    },
    {
      id: 3,
      content:
        "Attending the biggest crypto conference of the year! So many alpha opportunities 💎",
      likes: 234,
      comments: 45,
      rewards: "32.1",
      timestamp: "1d ago",
      engagement: 67,
    },
  ];

  const achievements = [
    { icon: "🏆", title: "Top Performer", desc: "Top 5% earner this month" },
    { icon: "💎", title: "Diamond Hands", desc: "100+ high-engagement posts" },
    { icon: "🚀", title: "Viral Creator", desc: "Post reached 10K+ views" },
    { icon: "⭐", title: "Rising Star", desc: "1000% growth in 30 days" },
  ];

  const renderPost = (post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.userName}>Alex Chen</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <View style={styles.rewardBadge}>
          <Ionicons name="diamond" size={14} color="#1f87fc" />
          <Text style={styles.rewardText}>+{post.rewards} SZ</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postFooter}>
        <View style={styles.engagementStats}>
          <TouchableOpacity style={styles.statButton}>
            <Ionicons name="heart-outline" size={20} color="#9CA3AF" />
            <Text style={styles.statText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#9CA3AF" />
            <Text style={styles.statText}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Ionicons name="share-outline" size={20} color="#9CA3AF" />
            <Text style={styles.statText}>Share</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.engagementPoints}>{post.engagement} points</Text>
      </View>
    </View>
  );

  const renderAchievement = (achievement, index) => (
    <View key={index} style={styles.achievementCard}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDesc}>{achievement.desc}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.appLogo}>
            <Text style={styles.logoText}>SZ</Text>
          </View>
          <Text style={styles.appName}>Stark Zuri</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={32} color="#fff" />
              </View>
              <View style={styles.onlineIndicator}>
                <Ionicons name="flash" size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>Alex Chen</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Crypto Influencer</Text>
                </View>
              </View>

              <Text style={styles.bio}>
                🚀 DeFi Enthusiast | 💎 Diamond Hand Trader | 📈 Market Analyst
                {"\n"}
                Sharing alpha and insights to help you navigate the crypto space
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{userStats.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{userStats.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{userStats.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.followButton, following && styles.followingButton]}
              onPress={() => setFollowing(!following)}
            >
              <Text
                style={[
                  styles.followButtonText,
                  following && styles.followingButtonText,
                ]}
              >
                {following ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crypto Stats */}
        <View style={styles.cryptoStatsContainer}>
          <View style={[styles.cryptoStatCard, styles.earningsCard]}>
            <View style={styles.cryptoStatHeader}>
              <Ionicons name="diamond" size={24} color="#fff" />
              <Text style={styles.cryptoStatChange}>
                {userStats.weeklyEarnings} SZ
              </Text>
            </View>
            <Text style={styles.cryptoStatValue}>{userStats.totalRewards}</Text>
            <Text style={styles.cryptoStatLabel}>Total SZ Earned</Text>
          </View>

          <View style={[styles.cryptoStatCard, styles.rankCard]}>
            <View style={styles.cryptoStatHeader}>
              <Ionicons name="trending-up" size={24} color="#fff" />
              <Ionicons name="trophy" size={20} color="#FFD700" />
            </View>
            <Text style={styles.cryptoStatValue}>{userStats.rank}</Text>
            <Text style={styles.cryptoStatLabel}>Global Rank</Text>
          </View>

          <View style={[styles.cryptoStatCard, styles.engagementCard]}>
            <View style={styles.cryptoStatHeader}>
              <Ionicons name="eye" size={24} color="#fff" />
              <Ionicons name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.cryptoStatValue}>89.2%</Text>
            <Text style={styles.cryptoStatLabel}>Engagement Rate</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#1f87fc" />
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) =>
              renderAchievement(achievement, index)
            )}
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {["posts", "rewards", "analytics"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === "posts" && (
          <View style={styles.postsContainer}>
            {recentPosts.map(renderPost)}
          </View>
        )}

        {activeTab === "rewards" && (
          <View style={styles.placeholderCard}>
            <Ionicons name="diamond" size={64} color="#1f87fc" />
            <Text style={styles.placeholderTitle}>Reward Analytics</Text>
            <Text style={styles.placeholderText}>
              Detailed reward breakdown and earning history coming soon!
            </Text>
          </View>
        )}

        {activeTab === "analytics" && (
          <View style={styles.placeholderCard}>
            <Ionicons name="trending-up" size={64} color="#1f87fc" />
            <Text style={styles.placeholderTitle}>Performance Analytics</Text>
            <Text style={styles.placeholderText}>
              Advanced analytics and insights dashboard coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StarkZuriProfile;
