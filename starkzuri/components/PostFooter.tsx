import { View, Text, TouchableOpacity } from "react-native";
import styles from "@/styles/index";
import React from "react";

const PostFooter = ({ post, handleLike }) => {
  return (
    <View>
      {/* Rewards Section */}
      <View style={styles.rewardsContainer}>
        <View style={styles.rewardsHeader}>
          <View style={styles.rewardsLabel}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.rewardsText}>Creator Rewards</Text>
          </View>
          <View style={styles.rewardsAmount}>
            <Text style={styles.trendingIcon}>📈</Text>
            <Text style={styles.rewardsValue}>ZRP {post?.zuri_points}</Text>
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
      {/* <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.supportButton}>
          <Text style={styles.supportButtonText}>💎 Support Creator</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>+ Follow</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default PostFooter;
