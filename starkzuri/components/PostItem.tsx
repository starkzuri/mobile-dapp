import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import styles from "../styles/index";
import {
  bigintToLongAddress,
  truncateAddress,
  bigintToShortStr,
  formatDate,
  getUint256CalldataFromBN,
  parseInputAmountToUint256,
  timeAgo,
} from "../utils/AppUtils";
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

export default PostItem;
