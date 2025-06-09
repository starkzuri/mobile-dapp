import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "@/styles/index";
import React from "react";
import PostFooter from "./PostFooter";
import TurndownService from "turndown";
import Markdown from "react-native-markdown-display";
import { htmlToMarkdown } from "@/utils/AppUtils";

const PostContent = ({ post, handleLike }) => {
  return (
    <View>
      {/* Post Content */}
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
