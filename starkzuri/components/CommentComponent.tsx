import { useAppContext } from "@/providers/AppProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { CallData, uint256 } from "starknet";
import Toast from "react-native-toast-message";
import ConfirmPostModal from "./PostConfirmationModal";
import CommentItem from "./CommentItem";
import { multilineToSingleline } from "@/utils/AppUtils";
import styles from "@/styles/comments";
import { CONTRACT_ADDRESS } from "@/providers/abi";

type User = {
  userId: number;
  name: number;
  username: number;
  about: string;
  profile_pic: string;
  cover_photo: string;
  date_registered: number;
  no_of_followers: number;
  number_following: number;
  notifications: number;
  zuri_points: number;
};

const { width } = Dimensions.get("window");
import MiniFunctions from "@/utils/MiniFunctions";
import { weiToEth } from "@/utils/AppUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRK_ADDRESS } from "@/utils/constants";

const CommentComponent = ({ postId, initialComments = [] }) => {
  const { contract, account, address, isReady } = useAppContext();
  const [estimateFee, setEstimateFee] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  // console.log(account);
  // console.log(address);
  const user = MiniFunctions(address);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentList, setCommentList] = useState("");

  const [loading, setLoading] = useState(false);

  const view_comments = () => {
    if (!contract) return;
    // console.log(id);
    const myCall = contract.populate("view_comments", [postId]);
    setLoading(true);
    contract["view_comments"](myCall.calldata, {
      parseResponse: false,
      parseRequest: false,
    })
      .then((res) => {
        let val = res
        console.log(val);
        setCommentList(val.reverse());
        console.log(val);
      })
      .catch((err) => {
        console.error("Error: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const estimateCommentFee = async () => {
    if (!newComment.trim()) return;
    if (!isReady || !account || !contract) return;
    const formattedContent = multilineToSingleline(newComment.trim());
    const FEE = BigInt("142400000000000000");
    const myCall = contract.populate("comment_on_post", [
      postId,
      formattedContent,
    ]);
    const calls = [
      {
        contractAddress: STRK_ADDRESS,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: CONTRACT_ADDRESS,
          amount: uint256.bnToUint256(FEE),
        }),
      },
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "comment_on_post",
        calldata: myCall.calldata,
      },
    ];

    try {
      const { suggestedMaxFee, unit } = await account.estimateInvokeFee(calls);

      const feeToEth = weiToEth(suggestedMaxFee, 8);
      const commentFeeToEth = weiToEth(FEE);

      setEstimateFee(feeToEth);
      setPlatformFee(commentFeeToEth);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "comment failure prediction",
        text2: "error " + error,
      });
      console.error("some error occured ", error);
    }
  };

  const verifyComment = async () => {
    setIsModalVisible(true);
    await estimateCommentFee();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!isReady || !account || !contract) return;
    const formattedContent = multilineToSingleline(newComment.trim());

    Toast.show({
      type: "info",
      text1: "Processing Transaction...",
      position: "top",
      autoHide: false,
    });
    const FEE = BigInt("142400000000000000");
    const myCall = contract.populate("comment_on_post", [
      postId,
      formattedContent,
    ]);
    console.log(myCall.calldata);
    const calls = [
      {
        contractAddress: STRK_ADDRESS,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: CONTRACT_ADDRESS,
          amount: uint256.bnToUint256(FEE),
        }),
      },
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "comment_on_post",
        calldata: myCall.calldata,
      },
    ];
    try {
      const res = await account.execute(calls);
      console.log("comment successful ", res);
      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Comment successful!",
        text2: "Your comment is live 🎉",
      });
      view_comments();
    } catch (error) {
      console.error("comment failed ", error);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "comment Failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setNewComment("");
      setIsModalVisible(false);
    }

    // const comment = {
    //   id: Date.now().toString(),
    //   text: newComment,
    //   user: currentUser,
    //   timestamp: new Date().toISOString(),
    //   likes: 0,
    //   liked: false,
    //   replies: [],
    //   rewards: 0,
    // };

    // setComments((prev) => [comment, ...prev]);
  };

  // const handleAddReply = (commentId) => {
  //   if (!replyText.trim()) return;

  //   const reply = {
  //     id: Date.now().toString(),
  //     text: replyText,
  //     user: currentUser,
  //     timestamp: new Date().toISOString(),
  //     likes: 0,
  //     liked: false,
  //     rewards: 0,
  //   };

  //   setComments((prev) =>
  //     prev.map((comment) =>
  //       comment.id === commentId
  //         ? { ...comment, replies: [...comment.replies, reply] }
  //         : comment
  //     )
  //   );

  //   setReplyText("");
  //   setReplyingTo(null);
  // };

  // const handleLike = (commentId, isReply = false, parentId = null) => {
  //   // setComments((prev) =>
  //   //   prev.map((comment) => {
  //   //     if (isReply && comment.id === parentId) {
  //   //       return {
  //   //         ...comment,
  //   //         replies: comment.replies.map((reply) =>
  //   //           reply.id === commentId
  //   //             ? {
  //   //                 ...reply,
  //   //                 liked: !reply.liked,
  //   //                 likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
  //   //               }
  //   //             : reply
  //   //         ),
  //   //       };
  //   //     } else if (comment.id === commentId) {
  //   //       return {
  //   //         ...comment,
  //   //         liked: !comment.liked,
  //   //         likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
  //   //       };
  //   //     }
  //   //     return comment;
  //   //   })
  //   // );
  //   return;
  // };

  // const handleReward = (commentId, isReply = false, parentId = null) => {
  //   Alert.alert("Send Reward", "Send tokens to reward this comment?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Send 25 tokens",
  //       onPress: () => {
  //         setComments((prev) =>
  //           prev.map((comment) => {
  //             if (isReply && comment.id === parentId) {
  //               return {
  //                 ...comment,
  //                 replies: comment.replies.map((reply) =>
  //                   reply.id === commentId
  //                     ? { ...reply, rewards: reply.rewards + 25 }
  //                     : reply
  //                 ),
  //               };
  //             } else if (comment.id === commentId) {
  //               return { ...comment, rewards: comment.rewards + 25 };
  //             }
  //             return comment;
  //           })
  //         );
  //         Alert.alert("Success", "Reward sent! 🎉");
  //       },
  //     },
  //   ]);
  // };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  useEffect(() => {
    if (contract) {
      view_comments();
    }
  }, [contract, postId]);

  // const ReplyItem = ({ reply, parentId }) => (
  //   <View style={styles.replyContainer}>
  //     <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
  //     <View style={styles.replyContent}>
  //       <View style={styles.replyHeader}>
  //         <View style={styles.userInfo}>
  //           <Text style={styles.replyUsername}>@{reply.user.username}</Text>
  //           {reply.user.verified && <Text style={styles.verifiedBadge}>✓</Text>}
  //           <Text style={styles.replyTimestamp}>
  //             {formatTimeAgo(reply.timestamp)}
  //           </Text>
  //         </View>
  //         {reply.rewards > 0 && (
  //           <View style={styles.miniRewardBadge}>
  //             <Text style={styles.miniRewardText}>🎁 {reply.rewards}</Text>
  //           </View>
  //         )}
  //       </View>
  //       <Text style={styles.replyText}>{reply.text}</Text>
  //       <View style={styles.replyActions}>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() => handleLike(reply.id, true, parentId)}
  //           activeOpacity={0.7}
  //         >
  //           <Text style={[styles.actionIcon, reply.liked && styles.likedIcon]}>
  //             {reply.liked ? "❤️" : "🤍"}
  //           </Text>
  //           <Text style={[styles.actionText, reply.liked && styles.likedText]}>
  //             {reply.likes}
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() => handleReward(reply.id, true, parentId)}
  //           activeOpacity={0.7}
  //         >
  //           <Text style={styles.actionIcon}>🎁</Text>
  //           <Text style={styles.actionText}>Reward</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // );

  // const CommentItem = ({ item }) => (
  //   <View style={styles.commentContainer}>
  //     <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
  //     <View style={styles.commentContent}>
  //       <View style={styles.commentHeader}>
  //         <View style={styles.userInfo}>
  //           <Text style={styles.username}>@{item.user.username}</Text>
  //           {item.user.verified && <Text style={styles.verifiedBadge}>✓</Text>}
  //           <Text style={styles.timestamp}>
  //             {formatTimeAgo(item.timestamp)}
  //           </Text>
  //         </View>
  //         {item.rewards > 0 && (
  //           <View style={styles.rewardBadge}>
  //             <Text style={styles.rewardText}>🎁 {item.rewards}</Text>
  //           </View>
  //         )}
  //       </View>
  //       <Text style={styles.commentText}>{item.text}</Text>
  //       <View style={styles.commentActions}>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() => handleLike(item.id)}
  //           activeOpacity={0.7}
  //         >
  //           <Text style={[styles.actionIcon, item.liked && styles.likedIcon]}>
  //             {item.liked ? "❤️" : "🤍"}
  //           </Text>
  //           <Text style={[styles.actionText, item.liked && styles.likedText]}>
  //             {item.likes}
  //           </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() =>
  //             setReplyingTo(replyingTo === item.id ? null : item.id)
  //           }
  //           activeOpacity={0.7}
  //         >
  //           <Text style={styles.actionIcon}>💬</Text>
  //           <Text style={styles.actionText}>Reply</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.actionButton}
  //           onPress={() => handleReward(item.id)}
  //           activeOpacity={0.7}
  //         >
  //           <Text style={styles.actionIcon}>🎁</Text>
  //           <Text style={styles.actionText}>Reward</Text>
  //         </TouchableOpacity>
  //       </View>

  //       {/* Reply Input */}
  //       {replyingTo === item.id && (
  //         <View style={styles.replyInputContainer}>
  //           <Image
  //             source={{ uri: currentUser.avatar }}
  //             style={styles.replyInputAvatar}
  //           />
  //           <View style={styles.replyInputWrapper}>
  //             <TextInput
  //               style={styles.replyInput}
  //               value={replyText}
  //               onChangeText={setReplyText}
  //               placeholder={`Reply to @${item.user.username}...`}
  //               placeholderTextColor="#6B7280"
  //               multiline
  //               autoFocus
  //             />
  //             <View style={styles.replyButtons}>
  //               <TouchableOpacity
  //                 style={styles.cancelButton}
  //                 onPress={() => {
  //                   setReplyingTo(null);
  //                   setReplyText("");
  //                 }}
  //               >
  //                 <Text style={styles.cancelButtonText}>Cancel</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={[
  //                   styles.replyButton,
  //                   !replyText.trim() && styles.replyButtonDisabled,
  //                 ]}
  //                 onPress={() => handleAddReply(item.id)}
  //                 disabled={!replyText.trim()}
  //               >
  //                 <Text style={styles.replyButtonText}>Reply</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       )}

  //       {/* Replies */}
  //       {item.replies.length > 0 && (
  //         <View style={styles.repliesContainer}>
  //           {item.replies.map((reply) => (
  //             <ReplyItem key={reply.id} reply={reply} parentId={item.id} />
  //           ))}
  //         </View>
  //       )}
  //     </View>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.container}>
  
      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <Image
          source={{
            uri:
              user.profile_pic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
          style={styles.inputAvatar}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Share your thoughts..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              !newComment.trim() && styles.postButtonDisabled,
            ]}
            onPress={verifyComment}
            disabled={!newComment.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddComment}
        visible={isModalVisible}
      />

      {/* <Toast /> */}

      {/* Comments Header */}
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>
          Comments ({commentList.length})
        </Text>
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7}>
          <Text style={styles.sortText}>🔥 Top</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={commentList}
        renderItem={({ item }) => (
          <CommentItem
            item={item}
            handleAddReply={() => {}}
            handleLike={() => {}}
            handleReward={() => {}}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        nestedScrollEnabled={true}
        scrollEnabled={false} // Disable FlatList scrolling if parent handles it
      />
 
    </SafeAreaView>
  );
};

export default CommentComponent;
