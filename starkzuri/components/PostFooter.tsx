import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "@/styles/index";
import React from "react";
import { CallData, uint256, cairo } from "starknet";
import { useAppContext } from "@/providers/AppProvider";
import Toast from "react-native-toast-message";
import ConfirmPostModal from "./PostConfirmationModal";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import { weiToEth } from "@/utils/AppUtils";

const PostFooter = ({ post }) => {
  const { account, isReady, contract } = useAppContext();
  const [estimateFee, setEstimateFee] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const estimateLikeFees = async () => {
    if (!account || !isReady || !contract) return;
    try {
      const myCall = contract.populate("like_post", [post.postId]);

      const ETH_ADDRESS =
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      const POST_CONTRACT =
        "0x7c2109cfa8c36fa10c6baac19b234679606cba00eb6697a052b73b869850673";
      const FEE = BigInt("31000000000000");

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
      const { suggestedMaxFee, unit } = await account.estimateInvokeFee(calls);

      const likeFee = BigInt("31000000000000");
      const feeToEth = weiToEth(suggestedMaxFee, 8);
      const likeFeeToEth = weiToEth(likeFee);
      setEstimateFee(feeToEth);
      setPlatformFee(likeFeeToEth);
    } catch (error) {
      console.log("estimation error ", error);
    }
  };

  const verifyLike = async () => {
    setIsModalVisible(true);
    await estimateLikeFees();
  };
  // console.log(account);

  const handleLike = async () => {
    if (!isReady || !account || !contract) return;

    Toast.show({
      type: "info",
      text1: "Processing Transaction...",
      position: "top",
      autoHide: false,
    });

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

      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Like successful!",
        text2: "Your like now counts 🎉",
      });
    } catch (err) {
      console.error("TX failed:", err);
      Toast.show({
        type: "error",
        text1: "like Failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setIsModalVisible(false);
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
        <TouchableOpacity style={styles.actionButton} onPress={verifyLike}>
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

      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleLike}
        visible={isModalVisible}
      />

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
