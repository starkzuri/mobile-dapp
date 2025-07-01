import React, { memo } from "react";
import { Pressable } from "react-native";
import styles from "../styles/index";
import { router } from "expo-router";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";

const PostItem = ({ post, handleLike }) => (
  <Pressable
    onPress={() =>
      router.push({
        pathname: "/modals/single_post",
        params: { single_post: post?.postId.toString() },
      })
    }
    style={styles.postContainer}
  >
    {/* Post Header */}

    {/*
    onPress={() => router.push(`/single_post/${post.postId}`)}
    style={styles.postContainer}
    */}

    <PostHeader post={post} />
    <PostContent post={post} handleLike={handleLike} />
    <PostFooter post={post} handleLike={handleLike} />
  </Pressable>
);

export default memo(PostItem, (prevProps, nextProps) => {
  return (
    prevProps.post === nextProps.post &&
    prevProps.handleLike === nextProps.handleLike
  );
});

// export default PostItem;
