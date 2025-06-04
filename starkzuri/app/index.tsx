import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { styles } from "./styles/index";

const StarkZuriHomepage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        verified: true,
      },
      content:
        "Just launched my new photography series! The response has been incredible 📸✨",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      timestamp: "2h",
      likes: 234,
      comments: 18,
      shares: 12,
      rewards: 45.6,
      liked: false,
    },
    {
      id: 2,
      user: {
        name: "Marcus Rodriguez",
        username: "@marcusr",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        verified: false,
      },
      content:
        "Building in public has been such a game changer for my startup journey. Here's what I learned this week about user feedback and iteration cycles.",
      timestamp: "4h",
      likes: 89,
      comments: 7,
      shares: 23,
      rewards: 12.3,
      liked: true,
    },
    {
      id: 3,
      user: {
        name: "Elena Vasquez",
        username: "@elenadesigns",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        verified: true,
      },
      content:
        "New UI design for a fintech app! Clean, modern, and user-friendly. What do you think? 💙",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      timestamp: "6h",
      likes: 156,
      comments: 24,
      shares: 8,
      rewards: 28.9,
      liked: false,
    },
  ]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const PostItem = ({ post }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.userHandle}>
              {post.user.username} • {post.timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {/* Rewards Section */}
      <View style={styles.rewardsContainer}>
        <View style={styles.rewardsHeader}>
          <View style={styles.rewardsLabel}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.rewardsText}>Creator Rewards</Text>
          </View>
          <View style={styles.rewardsAmount}>
            <Text style={styles.trendingIcon}>📈</Text>
            <Text style={styles.rewardsValue}>${post.rewards}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Text
            style={[
              styles.actionIcon,
              { color: post.liked ? "#ff4757" : "#8e8e93" },
            ]}
          >
            {post.liked ? "❤️" : "🤍"}
          </Text>
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Call to Action Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.supportButton}>
          <Text style={styles.supportButtonText}>💎 Support Creator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>+ Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>Stark Zuri</Text>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search creators..."
              placeholderTextColor="#8e8e93"
              style={styles.searchInput}
            />
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          }}
          style={styles.userAvatar}
        />
        <TouchableOpacity style={styles.createPostInput}>
          <Text style={styles.createPostText}>What's happening?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createPostButton}>
          <Text style={styles.createPostButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StarkZuriHomepage;
