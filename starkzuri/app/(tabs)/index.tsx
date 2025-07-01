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
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/index";
import PostItem from "@/components/PostItem";
import { useAppContext } from "@/providers/AppProvider";
import usePaginationStore from "@/stores/usePaginationStore";
import CreatePostComponent from "@/components/PostComponent";
import PostContent from "@/components/PostContent";
import MiniFunctions from "@/utils/MiniFunctions";

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
  const { contract, account } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
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
    fetchPosts();

    setRefreshing(true);
    const { initializePagination } = usePaginationStore.getState();
    await initializePagination(contract);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              // liked: !post.liked,
              likes: post.likes ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
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
              uri: user.profile_pic,
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

      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId.toString()}
        renderItem={({ item }) => (
          <PostItem post={item} handleLike={handleLike} />
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
