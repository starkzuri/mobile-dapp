import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import BigNumber from "bignumber.js";

// Types
interface Post {
  postId: number;
  caller: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  images: string;
  zuri_points: string;
  date_posted: any;
  isLiked?: boolean;
  isClaimable?: boolean;
  isOptimistic?: boolean; 
}

interface PaginationContract {
  get_total_posts: () => Promise<string | number | BigNumber>;
  view_posts: (calldata: any, options?: any) => Promise<any>;
  populate: (method: string, params: any[]) => any;
  callData: { parse: (method: string, response: any) => Post[] };
}

interface PostStore {
  // Post Data
  posts: Post[];
  postsById: Map<number, Post>;
  
  // Pagination State
  currentPage: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
  
  // Loading States
  isInitializing: boolean;
  isLoadingPosts: boolean;
  isRefreshing: boolean;
  
  // Error States
  hasError: boolean;
  errorMessage: string | null;
  
  // Contract
  contract: PaginationContract | null;
  
  // New flag to track if initial load is done
  hasInitialLoad: boolean;
  
  // Actions - Initialization
  setContract: (contract: PaginationContract | null) => void;
  initializePagination: () => Promise<void>;
  
  // Actions - Post Loading
  loadPosts: (page?: number) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  
  // Actions - Post Management
  addPost: (post: Post) => void;
  updatePost: (postId: number, updates: Partial<Post>) => void;
  removePost: (postId: number) => void;
  
  // Actions - Optimistic Updates
  optimisticLike: (postId: number) => void;
  optimisticUnlike: (postId: number) => void;
  revertOptimisticLike: (postId: number) => void;
  
  // Actions - State Management
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
  // Selectors
  getPostById: (postId: number) => Post | undefined;
  getSortedPosts: () => Post[];
  getPostsByUser: (userId: number) => Post[];
  canLoadMore: () => boolean;
}

const usePostStore = create<PostStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    posts: [],
    postsById: new Map(),
    currentPage: null,
    totalPages: null,
    hasNextPage: false,
    isInitializing: false,
    isLoadingPosts: false,
    isRefreshing: false,
    hasError: false,
    errorMessage: null,
    contract: null,
    hasInitialLoad: false, 

    // Actions - Initialization
    setContract: (contract) => set({ contract }),
    
    initializePagination: async () => {
      const { contract, hasInitialLoad } = get();
      
     
      if (hasInitialLoad) {
        return;
      }
      
      if (!contract) {
        set({ 
          totalPages: 0, 
          currentPage: 0, 
          hasNextPage: false,
          hasError: true,
          errorMessage: "Contract not available"
        });
        return;
      }

      set({ isInitializing: true, hasError: false, errorMessage: null });

      try {
        const totalPosts = await contract.get_total_posts();
        if (!totalPosts) {
          set({ 
            totalPages: 0, 
            currentPage: 0, 
            hasNextPage: false,
            isInitializing: false,
            hasInitialLoad: true
          });
          return;
        }

        const readablePosts = new BigNumber(totalPosts).toNumber();
        const calculatedTotalPages = Math.max(1, Math.ceil(readablePosts / 10));
        
        set({
          totalPages: calculatedTotalPages,
          currentPage: calculatedTotalPages, // Start from latest
          hasNextPage: calculatedTotalPages > 1,
          isInitializing: false,
          hasError: false,
          errorMessage: null,
          hasInitialLoad: true // Mark as initialized
        });

     
        setTimeout(async () => {
          await get().loadPosts(calculatedTotalPages);
        }, 0);
        
      } catch (error) {
        console.error("Error initializing pagination:", error);
        set({
          hasError: true,
          errorMessage: (error as any).message || "Failed to initialize pagination",
          isInitializing: false,
          totalPages: 0,
          currentPage: 0,
          hasNextPage: false,
          hasInitialLoad: true
        });
      }
    },

    // Actions - Post Loading
    loadPosts: async (page) => {
      const { contract, currentPage, isLoadingPosts } = get();
      
      if (!contract || isLoadingPosts) return;
      
      const targetPage = page || currentPage;
      if (targetPage === null || targetPage < 1) return;

      set({ isLoadingPosts: true, hasError: false, errorMessage: null });

      try {
        const myCall = contract.populate("view_posts", [targetPage]);
        const response = await contract.view_posts(myCall.calldata, {
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

        set((state) => {
          const updatedPostsById = new Map(state.postsById);
          const newPostsList = [...state.posts];

          // Add new posts and update map
          sortedPosts.forEach(post => {
            if (!updatedPostsById.has(post.postId)) {
              updatedPostsById.set(post.postId, post);
              newPostsList.push(post);
            }
          });

          // Sort the complete list
          newPostsList.sort((a, b) => {
            const dateA = BigInt(a.date_posted);
            const dateB = BigInt(b.date_posted);
            return dateB > dateA ? 1 : -1;
          });

          return {
            posts: newPostsList,
            postsById: updatedPostsById,
            currentPage: targetPage,
            hasNextPage: targetPage > 1,
            isLoadingPosts: false
          };
        });

      } catch (error) {
        console.error("Error loading posts:", error);
        set({
          hasError: true,
          errorMessage: (error as any).message || "Failed to load posts",
          isLoadingPosts: false
        });
      }
    },

    loadMorePosts: async () => {
      const { currentPage, hasNextPage, isLoadingPosts } = get();
      
      if (!hasNextPage || isLoadingPosts || currentPage === null) return;
      
      const nextPage = currentPage - 1;
      if (nextPage < 1) {
        set({ hasNextPage: false });
        return;
      }

      await get().loadPosts(nextPage);
    },

    refreshPosts: async () => {
      const { contract, totalPages } = get();
      if (!contract) return;

      set({ isRefreshing: true, hasError: false, errorMessage: null });

      try {
        // Reset the initial load flag to allow re-initialization
        set({ hasInitialLoad: false });
        
        // Re-initialize to get latest total pages
        await get().initializePagination();
        
        // Load latest posts
        const latestPage = get().totalPages;
        if (latestPage) {
          await get().loadPosts(latestPage);
        }
      } catch (error) {
        console.error("Error refreshing posts:", error);
        set({
          hasError: true,
          errorMessage: (error as any).message || "Failed to refresh posts"
        });
      } finally {
        set({ isRefreshing: false });
      }
    },

    // Actions - Post Management
    addPost: (post) => {
      set((state) => {
        const updatedPostsById = new Map(state.postsById);
        updatedPostsById.set(post.postId, post);
        
        const newPosts = [post, ...state.posts];
        
        return {
          posts: newPosts,
          postsById: updatedPostsById
        };
      });
    },

    updatePost: (postId, updates) => {
      set((state) => {
        const updatedPostsById = new Map(state.postsById);
        const existingPost = updatedPostsById.get(postId);
        
        if (existingPost) {
          const updatedPost = { ...existingPost, ...updates };
          updatedPostsById.set(postId, updatedPost);
          
          const updatedPosts = state.posts.map(post => 
            post.postId === postId ? updatedPost : post
          );
          
          return {
            posts: updatedPosts,
            postsById: updatedPostsById
          };
        }
        
        return state;
      });
    },

    removePost: (postId) => {
      set((state) => {
        const updatedPostsById = new Map(state.postsById);
        updatedPostsById.delete(postId);
        
        const filteredPosts = state.posts.filter(post => post.postId !== postId);
        
        return {
          posts: filteredPosts,
          postsById: updatedPostsById
        };
      });
    },

    // Actions - Optimistic Updates
    optimisticLike: (postId) => {
        const post = get().postsById.get(postId);
        const likes = typeof post?.likes === 'number' ? post.likes : 0;

        get().updatePost(postId, {
          likes: likes + 1,
          isLiked: true,
          isOptimistic: true
        });
      },

    optimisticUnlike: (postId) => {
      const post = get().postsById.get(postId);
      if (post && post.likes > 0) {
        get().updatePost(postId, { 
          likes: post.likes - 1,
          isLiked: false,
          isOptimistic: true
        });
      }
    },

    revertOptimisticLike: (postId) => {
      const post = get().postsById.get(postId);
      if (post && post.isOptimistic) {
        get().updatePost(postId, { 
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
          isOptimistic: false
        });
      }
    },

    // Actions - State Management
    setError: (error) => set({ hasError: true, errorMessage: error }),
    clearError: () => set({ hasError: false, errorMessage: null }),
    
    reset: () => set({
      posts: [],
      postsById: new Map(),
      currentPage: null,
      totalPages: null,
      hasNextPage: false,
      isInitializing: false,
      isLoadingPosts: false,
      isRefreshing: false,
      hasError: false,
      errorMessage: null,
      hasInitialLoad: false
    }),

    // Selectors
    getPostById: (postId) => get().postsById.get(postId),
    
    getSortedPosts: () => {
      return [...get().posts].sort((a, b) => {
        const dateA = BigInt(a.date_posted);
        const dateB = BigInt(b.date_posted);
        return dateB > dateA ? 1 : -1;
      });
    },
    
    getPostsByUser: (userId) => {
      return get().posts.filter(post => post.caller === userId);
    },
    
    canLoadMore: () => {
      const { hasNextPage, isLoadingPosts, isRefreshing } = get();
      return hasNextPage && !isLoadingPosts && !isRefreshing;
    }
  }))
);

export default usePostStore;