import { View, Text, TouchableOpacity } from "react-native";
import styles from "@/styles/index";
import React from "react";
import { CallData, uint256, cairo } from "starknet";
import { useAppContext } from "@/providers/AppProvider";

const PostFooter = ({ post }) => {
  const { account, isReady, contract } = useAppContext();
  // console.log(account);

  const handleLike = async () => {
    if (!isReady || !account) return;

    const ETH_ADDRESS =
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    const POST_CONTRACT =
      "0x7c2109cfa8c36fa10c6baac19b234679606cba00eb6697a052b73b869850673";
    const FEE = BigInt("31000000000000");

    const myCall = contract.populate("like_post", [post.postId]);

    const calls = [
      {
        contractAddress: ETH_ADDRESS,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: POST_CONTRACT,
          amount: uint256.bnToUint256(FEE),
        }),
      },
      {
        contractAddress: POST_CONTRACT,
        entrypoint: "like_post",
        calldata: myCall.calldata,
      },
    ];

    try {
      const res = await account.execute(calls);
      console.log("Transaction sent!", res.transaction_hash);
    } catch (err) {
      console.error("TX failed:", err);
    }
  };
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
