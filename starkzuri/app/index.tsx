import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import styles from "../styles/index";
import PostItem from "@/components/PostItem";
import { useAppContext } from "@/providers/AppProvider";
import usePaginationStore from "@/stores/usePaginationStore";

type Post = {
  postId: number;
  caller: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  images: string;
  zuri_points: string;
  date_posted: number;
};

const StarkZuriHomepage = () => {
  const { contract } = useAppContext();

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
    console.log("fetching", page, loading);
    if (page < 1) return;

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

  useEffect(() => {
    if (contract) {
      initializePagination(contract);
    }
    // if (contract && address) {
    //   view_user();
    // }
  }, [contract]);
  // console.log(posts);

  // Fetch initial posts when pagination is initialized
  useEffect(() => {
    if (page !== null && totalPages !== null) {
      fetchPosts();
    }
  }, [totalPages, contract]);

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
              placeholder="Search creators..."
              placeholderTextColor="#8e8e93"
              style={styles.searchInput}
            />
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          }}
          style={styles.userAvatar}
        />
        <TouchableOpacity style={styles.createPostInput}>
          <Text style={styles.createPostText}>What's happening?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createPostButton}>
          <Text style={styles.createPostButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {/* <PostItem handleLike={handleLike} /> */}
        {posts.map((post) => (
          <PostItem key={post.postId} handleLike={handleLike} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StarkZuriHomepage;
