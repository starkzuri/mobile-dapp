import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "@/styles/index";
import React from "react";
import PostFooter from "./PostFooter";

const PostContent = ({ post, handleLike }) => {
  return (
    <View>
      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>
      {post.images && (
        <Image
          source={{ uri: post?.images.split(",")[0] }}
          style={styles.postImage}
        />
      )}
    </View>
  );
};

export default PostContent;
