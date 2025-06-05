import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "@/styles/index";
import {
  truncateAddress,
  bigintToLongAddress,
  timeAgo,
} from "@/utils/AppUtils";
import MiniFunctions from "@/utils/MiniFunctions";
import { bigintToShortStr } from "@/utils/AppUtils";

const PostHeader = ({ post }) => {
  const user = MiniFunctions(post?.caller.toString());
  return (
    <View style={styles.postHeader}>
      <View style={styles.userInfo}>
        {post.images && (
          <Image source={{ uri: user?.profile_pic }} style={styles.avatar} />
        )}
        <View style={styles.userDetails}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {/* {truncateAddress(bigintToLongAddress(post?.caller))} */}
              {bigintToShortStr(user?.name)}
            </Text>
            {/* {post.user.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )} */}
          </View>
          <Text style={styles.userHandle}>
            {bigintToShortStr(user?.username)} •{" "}
            {timeAgo(post?.date_posted.toString() * 1000)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;
