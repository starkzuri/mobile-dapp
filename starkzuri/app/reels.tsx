import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { styles } from "./styles/reels";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const StarkZuriReels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const [reels, setReels] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        verified: true,
        following: false,
      },
      video:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=800&fit=crop",
      caption:
        "Behind the scenes of my latest photoshoot! 📸✨ #photography #behindthescenes",
      music: "Original Audio - Sarah Chen",
      likes: 1234,
      comments: 89,
      shares: 45,
      rewards: 67.5,
      liked: false,
      bookmarked: false,
      duration: "0:15",
    },
    {
      id: 2,
      user: {
        name: "Marcus Rodriguez",
        username: "@marcusr",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        verified: false,
        following: true,
      },
      video:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=800&fit=crop",
      caption:
        "Quick UI design tips that changed my workflow forever! 🎨 Save this for later",
      music: "Trending - Lo-fi Beats",
      likes: 2156,
      comments: 156,
      shares: 89,
      rewards: 124.8,
      liked: true,
      bookmarked: true,
      duration: "0:30",
    },
    {
      id: 3,
      user: {
        name: "Elena Vasquez",
        username: "@elenadesigns",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        verified: true,
        following: false,
      },
      video:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=800&fit=crop",
      caption:
        "Day in the life of a freelance designer 💻 What would you like to see next?",
      music: "Aesthetic Vibes - Chill Mix",
      likes: 987,
      comments: 67,
      shares: 34,
      rewards: 45.2,
      liked: false,
      bookmarked: false,
      duration: "0:45",
    },
    {
      id: 4,
      user: {
        name: "Alex Thompson",
        username: "@alextech",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        verified: false,
        following: true,
      },
      video:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=800&fit=crop",
      caption:
        "Building my startup from scratch! Here's the MVP reveal 🚀 #startup #tech",
      music: "Motivational Beats - Inspire",
      likes: 3421,
      comments: 234,
      shares: 156,
      rewards: 198.7,
      liked: true,
      bookmarked: false,
      duration: "1:00",
    },
  ]);

  const handleLike = (reelId) => {
    setReels(
      reels.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              liked: !reel.liked,
              likes: reel.liked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const handleBookmark = (reelId) => {
    setReels(
      reels.map((reel) =>
        reel.id === reelId ? { ...reel, bookmarked: !reel.bookmarked } : reel
      )
    );
  };

  const handleFollow = (reelId) => {
    setReels(
      reels.map((reel) =>
        reel.id === reelId
          ? { ...reel, user: { ...reel.user, following: !reel.user.following } }
          : reel
      )
    );
  };

  const ReelItem = ({ reel, index }) => (
    <View style={styles.reelContainer}>
      {/* Video Background */}
      <ImageBackground
        source={{ uri: reel.video }}
        style={styles.videoBackground}
      >
        <View style={styles.overlay} />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.reelsTitle}>Reels</Text>
          <TouchableOpacity style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Right Side Actions */}
        <View style={styles.rightActions}>
          {/* User Profile */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: reel.user.avatar }}
              style={styles.profileAvatar}
            />
            {!reel.user.following && (
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => handleFollow(reel.id)}
              >
                <Text style={styles.followButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Like Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(reel.id)}
          >
            <Text
              style={[
                styles.actionIcon,
                { color: reel.liked ? "#ff4757" : "white" },
              ]}
            >
              {reel.liked ? "❤️" : "🤍"}
            </Text>
            <Text style={styles.actionCount}>{reel.likes}</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{reel.comments}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionCount}>{reel.shares}</Text>
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleBookmark(reel.id)}
          >
            <Text
              style={[
                styles.actionIcon,
                { color: reel.bookmarked ? "#1f87fc" : "white" },
              ]}
            >
              {reel.bookmarked ? "🔖" : "📋"}
            </Text>
          </TouchableOpacity>

          {/* More Options */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⋯</Text>
          </TouchableOpacity>

          {/* Music Note */}
          <View style={styles.musicNote}>
            <Text style={styles.musicIcon}>🎵</Text>
          </View>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Creator Rewards */}
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardsContent}>
              <Text style={styles.rewardsIcon}>💰</Text>
              <Text style={styles.rewardsText}>
                Creator earned ${reel.rewards}
              </Text>
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingIcon}>📈</Text>
              </View>
            </View>
          </View>

          {/* User Info and Caption */}
          <View style={styles.userInfo}>
            <View style={styles.userHeader}>
              <Text style={styles.username}>@{reel.user.username}</Text>
              {reel.user.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
              <Text style={styles.duration}>• {reel.duration}</Text>
            </View>
            <Text style={styles.caption}>{reel.caption}</Text>

            {/* Music Info */}
            <View style={styles.musicInfo}>
              <Text style={styles.musicIcon}>🎵</Text>
              <Text style={styles.musicText}>{reel.music}</Text>
            </View>
          </View>

          {/* Call to Action Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>💎 Support Creator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareReelButton}>
              <Text style={styles.shareReelButtonText}>Share Reel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / screenHeight
          );
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {reels.map((reel, index) => (
          <ReelItem key={reel.id} reel={reel} index={index} />
        ))}
      </ScrollView>

      {/* Bottom Navigation Indicator */}
      <View style={styles.bottomIndicator}>
        <View style={styles.indicatorContainer}>
          {reels.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Create Reel Button */}
        <TouchableOpacity style={styles.createReelButton}>
          <Text style={styles.createReelIcon}>+</Text>
          <Text style={styles.createReelText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.floatingActions}>
        <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.floatingIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.floatingIcon}>🎬</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StarkZuriReels;
