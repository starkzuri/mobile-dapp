import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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
import usePaginationStore from "@/stores/usePaginationStore";
import CreatePostComponent from "@/components/PostComponent";
import Toast from "react-native-toast-message";
import PostContent from "@/components/PostContent";
import MiniFunctions from "@/utils/MiniFunctions";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import ConfirmPostModal from "@/components/PostConfirmationModal";

type Post = {
  postId: number;
  caller: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  images: string;
  zuri_points: string;
  date_posted: any;
};

const StarkZuriHomepage = () => {
  const { contract, account, isReady } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [likeModalVisible, setLikeModalVisible] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [estimateFee, setEstimateFee] = useState("0.00");
  const [platformFee, setPlatformFee] = useState("0.00");
  const [postId, setPostId] = useState("0");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const user = MiniFunctions(account?.address?.toString());

  const {
    page,
    totalPages,
    hasError,
    loading,
    setLoading,
    setHasError,
    initializePagination,
    decrementPage,
  } = usePaginationStore();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    // console.log("fetching", page, loading);
    // if (page < 1) return;
    if (!contract) return;
    const { page, loading, decrementPage, setLoading, setHasError } =
      usePaginationStore.getState(); // get fresh state snapshot

    console.log("fetching", page, loading);

    if (page === null || page < 1 || loading) return;

    try {
      setLoading(true);
      console.log("fetching");
      const myCall = contract.populate("view_posts", [page]);

      const response = await contract["view_posts"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const newPosts = contract.callData.parse(
        "view_posts",
        response?.result ?? response
      );

      // Sort posts by date (newest first)
      const sortedPosts = newPosts.sort((a, b) => {
        const dateA = BigInt(a.date_posted);
        const dateB = BigInt(b.date_posted);
        return dateB > dateA ? 1 : -1;
      });

      setPosts((currentPosts) => {
        // Remove any duplicates when combining old and new posts
        const uniquePosts = [...currentPosts, ...sortedPosts].reduce(
          (acc, current) => {
            const x = acc.find((item) => item.postId === current.postId);
            if (!x) {
              return acc.concat([current]);
            }
            return acc;
          },
          []
        );
        return uniquePosts;
      });

      decrementPage();
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestPosts = async () => {
    const latestPage = usePaginationStore.getState().totalPages;
    if (!contract || !latestPage) return;

    try {
      const myCall = contract.populate("view_posts", [latestPage]);

      const response = await contract["view_posts"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const newPosts = contract.callData.parse(
        "view_posts",
        response?.result ?? response
      );

      setPosts((current) => {
        const existingIds = new Set(current.map((p) => p.postId));
        const onlyNew = newPosts.filter((p) => !existingIds.has(p.postId));
        return [...onlyNew, ...current];
      });
    } catch (err) {
      console.error("Error fetching latest posts", err);
    }
  };

  useEffect(() => {
    if (contract) {
      initializePagination(contract);
    }
    // if (contract && address) {
    //   view_user();
    // }
  }, [contract]);

  const handleEndReached = () => {
    // if (!loading && page > 1) {
    //   fetchPosts();
    // }

    const { loading, page } = usePaginationStore.getState();
    if (!loading && page > 1) {
      fetchPosts();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (page !== null && totalPages !== null && contract) {
        fetchPosts();
      }
    }, [page, totalPages, contract])
  );

  const reloadPosts = async () => {
    // fetchPosts();

    // setRefreshing(true);
    // const { initializePagination } = usePaginationStore.getState();
    // await initializePagination(contract);
    // await fetchPosts();
    // setRefreshing(false);

    if (!contract) return;

    setRefreshing(true);

    await initializePagination(contract); // resets to totalPages
    await fetchLatestPosts(); // fetch fresh from top
    setRefreshing(false);
  };

  const verifyLike = async (postId) => {
    setLikeModalVisible(true);
    await estimateLikeFees(postId);
  };

  const estimateLikeFees = async (postId) => {
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
      const { suggestedMaxFee, unit } = await account.estimateInvokeFee(calls);

      const likeFee = BigInt("31000000000000");
      const feeToEth = weiToEth(suggestedMaxFee, 8);
      const likeFeeToEth = weiToEth(likeFee);
      setEstimateFee(feeToEth);
      setPlatformFee(likeFeeToEth);
      setPostId(postId);
    } catch (error) {
      console.log("estimation error ", error);
    }
  };

  const handleLike = async (postId) => {
    // setPosts(
    //   posts.map((post) =>
    //     post.postId === postId
    //       ? {
    //           ...post,
    //           // liked: !post.liked,
    //           likes: post.likes ? post.likes - 1 : post.likes + 1,
    //         }
    //       : post
    //   )
    // );

    console.log(postId);

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
      setLikeModalVisible(false);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId.toString() === postId
            ? { ...post, likes: Number(post.likes.toString()) + 1 }
            : post
        )
      );
    }
  };

  const verifyHandleClaimPoints = async (postId) => {
    await estimateClaimFees(postId);
    setClaimModalOpen(true);
  };

  const estimateClaimFees = async (postId) => {
    console.log("estimating");
    // console.log(post);

    if (!account || !isReady || !contract) return;

    try {
      const myCall = contract.populate("claim_post_points", [postId]);

      const { suggestedMaxFee, unit } = await account.estimateInvokeFee({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "claim_post_points",
        calldata: myCall.calldata,
      });

      const feeToEth = weiToEth(suggestedMaxFee, 8);

      console.log("estimation done");
      console.log("estimatedFee", suggestedMaxFee.toString());
      console.log("unit ", unit.toString());
      setEstimateFee(feeToEth);
      setPlatformFee("0.00");
      setPostId(postId);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId.toString() === postId
            ? { ...post, zuri_points: "0" }
            : post
        )
      );
    } catch (err) {
      console.error("🔥 Estimation failed:", err);
    }
  };

  const handleClaimPoints = async () => {
    if (!isReady || !account || !contract) return;
    Toast.show({
      type: "info",
      text1: "Processing Transaction...",
      position: "top",
      autoHide: false,
    });

    try {
      const myCall = contract.populate("claim_post_points", [postId]);

      const res = await account.execute(myCall);
      console.log("points claimed", res.transaction_hash);

      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Zuri Claimed",
        text2: "You can now withdraw your points to wallet 🎉",
      });

      // Alert.alert("Success", "Your post has been created!");
    } catch (error) {
      console.error("TX failed ", error);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "claim Failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setIsLoading(false);
      setClaimModalOpen(false);
    }
  };

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
        <View style={styles.headerRight}>
          {/*<TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>👤</Text>
          </TouchableOpacity>*/}
        </View>
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
        {/* <CreatePostComponent userAddress={null} onCreatePost={null} /> */}

        <Modal visible={modalVisible} animationType="slide">
          <CreatePostComponent
            onCreatePost={null}
            userAddress={null}
            onClose={() => setModalVisible(false)}
          />
        </Modal>
      </View>

      <ConfirmPostModal
        gasFee={estimateFee}
        platformFee={platformFee}
        message=""
        onCancel={() => setLikeModalVisible(false)}
        onConfirm={() => handleLike(postId)}
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
        refreshing={refreshing}
        onRefresh={reloadPosts}
        onEndReached={handleEndReached} // called when scroll nears the bottom
        onEndReachedThreshold={0.5} // 50% from the bottom
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#2196F3" /> : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default StarkZuriHomepage;

// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/(auth)/login" />;
// }
