import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Pressable,
  Modal,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { CallData, uint256 } from "starknet";
import { useRouter } from "expo-router";
import styles from "../../styles/index";
import PostItem from "@/components/PostItem";
import { weiToEth } from "@/utils/AppUtils";
import { useAppContext } from "@/providers/AppProvider";

import CreatePostComponent from "@/components/PostComponent";
import Toast from "react-native-toast-message";
import MiniFunctions from "@/utils/MiniFunctions";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import ConfirmPostModal from "@/components/PostConfirmationModal";
import usePostStore from "@/stores/usePaginationStore"; // adjust the path accordingly

import usePostActions from "../hooks/usePostActions";
import usePostSelectors from "../hooks/usePostSelectors";
const StarkZuriHomepage = () => {
  const { contract, account, isReady } = useAppContext();
  const router = useRouter();

  // UI State
  const [modalVisible, setModalVisible] = useState(false);
  const [likeModalVisible, setLikeModalVisible] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [estimateFee, setEstimateFee] = useState("0.00");
  const [platformFee, setPlatformFee] = useState("0.00");
  const [selectedPostId, setSelectedPostId] = useState<string>("0");
  const [isInitialized, setIsInitialized] = useState(false);
  const totalPages = usePostStore((state) => state.totalPages);
  const flatListRef = useRef<FlatList>(null);

  // new psots

  // User data
  const user = MiniFunctions(account?.address?.toString() ?? "");

  // Enhanced Post Store
  const {
    posts,
    isLoading,
    isRefreshing,
    isInitializing,
    canLoadMore,
    hasError,
    errorMessage,
  } = usePostSelectors();

  const {
    initializePosts,
    loadMore,
    refresh,
    likePost,
    claimPoints,
    clearError,
  } = usePostActions();

  const [lastSeenPostId, setLastSeenPostId] = useState<number | null>(null);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  // useEffect(() => {
  //   if (contract && !isInitialized) {
  //     initializePosts(contract);
  //     setIsInitialized(true);
  //   }
  // }, [contract, initializePosts, isInitialized]);

  // Auto-load posts when pagination is ready

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!contract || !totalPages || posts.length === 0) return;

      try {
        const myCall = contract.populate("view_posts", [totalPages.toString()]);
        const response = await contract.view_posts(myCall.calldata, {
          parseResponse: false,
          parseRequest: false,
        });

        const newPosts = contract.callData.parse(
          "view_posts",
          response?.result ?? response
        );

        if (newPosts?.length === 0) return;

        const latestFetched = newPosts[newPosts?.length - 1];
        const topVisiblePost = posts[0];

        const fetchedDate = BigInt(latestFetched.date_posted);
        const currentDate = BigInt(topVisiblePost.date_posted);

        if (fetchedDate > currentDate) {
          setNewPostsAvailable(true);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [contract, totalPages, posts]);

  useFocusEffect(
    useCallback(() => {
      if (contract) {
        initializePosts(contract);
      }
    }, [contract])
  );

  // Error handling
  useEffect(() => {
    if (hasError && errorMessage) {
      Toast.show({
        type: "error",
        text1: "Error Loading Posts",
        text2: errorMessage,
      });
      // Auto-clear error after showing toast
      setTimeout(clearError, 3000);
    }
  }, [hasError, errorMessage, clearError]);

  // Fee estimation for likes
  const estimateLikeFees = useCallback(
    async (postId: string) => {
      if (!account || !isReady || !contract) return;

      try {
        const myCall = contract.populate("like_post", [postId]);

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

        const { suggestedMaxFee } = await account.estimateInvokeFee(calls);
        const likeFee = BigInt("31000000000000");

        setEstimateFee(weiToEth(suggestedMaxFee, 8));
        setPlatformFee(weiToEth(likeFee));
        setSelectedPostId(postId);
      } catch (error) {
        console.error("Fee estimation error:", error);
        Toast.show({
          type: "error",
          text1: "Fee Estimation Failed",
          text2: "Please try again",
        });
      }
    },
    [account, isReady, contract]
  );

  // Fee estimation for claims
  const estimateClaimFees = useCallback(
    async (postId: string) => {
      if (!account || !isReady || !contract) return;

      try {
        const myCall = contract.populate("claim_post_points", [postId]);
        const { suggestedMaxFee } = await account.estimateInvokeFee({
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "claim_post_points",
          calldata: myCall.calldata,
        });

        setEstimateFee(weiToEth(suggestedMaxFee, 8));
        setPlatformFee("0.00");
        setSelectedPostId(postId);
      } catch (err) {
        console.error("Claim fee estimation failed:", err);
        Toast.show({
          type: "error",
          text1: "Fee Estimation Failed",
          text2: "Please try again",
        });
      }
    },
    [account, isReady, contract]
  );

  // Handle like verification and modal
  const verifyLike = useCallback(
    async (postId: string) => {
      await estimateLikeFees(postId);
      setLikeModalVisible(true);
    },
    [estimateLikeFees]
  );

  // Handle claim verification and modal
  const verifyHandleClaimPoints = useCallback(
    async (postId: string) => {
      await estimateClaimFees(postId);
      setClaimModalOpen(true);
    },
    [estimateClaimFees]
  );

  // Execute like transaction
  const handleLike = useCallback(async () => {
    if (!isReady || !account || !contract) return;

    setLikeModalVisible(false);

    try {
      await likePost(Number(selectedPostId), async (postId: number) => {
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

        const myCall = contract.populate("like_post", [postId]);
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

        const res = await account.execute(calls);
        console.log("Transaction sent!", res.transaction_hash);
      });

      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Like successful!",
        text2: "Your like now counts 🎉",
      });
    } catch (err) {
      console.error("Like transaction failed:", err);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Like Failed",
        text2: "Please try again later 😢",
      });
    }
  }, [isReady, account, contract, selectedPostId, likePost]);

  {
    hasError && (
      <TouchableOpacity onPress={() => initializePosts(contract)}>
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Failed to load posts. Tap to retry.
        </Text>
      </TouchableOpacity>
    );
  }

  // Execute claim transaction
  const handleClaimPoints = useCallback(async () => {
    if (!isReady || !account || !contract) return;

    setClaimModalOpen(false);

    try {
      await claimPoints(Number(selectedPostId), async (postId: number) => {
        Toast.show({
          type: "info",
          text1: "Processing Transaction...",
          position: "top",
          autoHide: false,
        });

        const myCall = contract.populate("claim_post_points", [postId]);
        const res = await account.execute(myCall);
        console.log("Points claimed", res.transaction_hash);
      });

      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Zuri Claimed",
        text2: "You can now withdraw your points to wallet 🎉",
      });
    } catch (error) {
      console.error("Claim transaction failed:", error);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Claim Failed",
        text2: "Please try again later 😢",
      });
    }
  }, [isReady, account, contract, selectedPostId, claimPoints]);

  // Handle infinite scroll
  const handleEndReached = useCallback(() => {
    if (canLoadMore) {
      loadMore();
    }
  }, [canLoadMore, loadMore]);

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Render loading state
  if (isInitializing) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading posts...</Text>
      </SafeAreaView>
    );
  }

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
              placeholder="Search coming soon..."
              placeholderTextColor="#8e8e93"
              style={styles.searchInput}
            />
          </View>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <Pressable onPress={() => router.push("/profile")}>
          <Image
            source={{
              uri:
                user.profile_pic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.userAvatar}
          />
        </Pressable>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.createPostInput}
        >
          <Text style={styles.createPostText}>What's happening?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createPostButton}>
          <Text style={styles.createPostButtonText}>+</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <CreatePostComponent
            onCreatePost={null}
            userAddress={null}
            onClose={() => setModalVisible(false)}
          />
        </Modal>
      </View>

      {/* Confirmation Modals */}
      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setLikeModalVisible(false)}
        onConfirm={handleLike}
        visible={likeModalVisible}
      />

      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setClaimModalOpen(false)}
        onConfirm={handleClaimPoints}
        visible={claimModalOpen}
      />

      {newPostsAvailable && (
        <TouchableOpacity
          onPress={async () => {
            await refresh(); // Your refreshPosts() call
            setNewPostsAvailable(false);
            setLastSeenPostId(posts[0]?.postId ?? null);
            flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={{
            position: "absolute",
            top: 100,
            alignSelf: "center",
            backgroundColor: "#1f87fc",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            zIndex: 999,
            elevation: 8, // Android shadow
            shadowColor: "#1f87fc", // iOS shadow
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
            minWidth: 180,
            alignItems: "center",
            justifyContent: "center",
            // Add a subtle gradient effect with overlays
            overflow: "hidden",
          }}
          activeOpacity={0.8}
        >
          {/* Gradient overlay effect */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 25,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                transform: [{ rotate: "0deg" }],
              }}
            >
              ↻
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 15,
                letterSpacing: 0.3,
              }}
            >
              New posts available
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId.toString()}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            handleClaimPoints={() =>
              verifyHandleClaimPoints(item.postId.toString())
            }
            handleLike={() => verifyLike(item.postId.toString())}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && !isInitializing ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ color: "#8e8e93", fontSize: 16 }}>
                No posts yet. Be the first to share something!
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default StarkZuriHomepage;
