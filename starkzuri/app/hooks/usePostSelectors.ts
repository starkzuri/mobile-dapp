import { useMemo } from 'react';
import usePostStore from '@/stores/usePaginationStore';

// Safe BigInt conversion function
const safeBigInt = (value: any): bigint => {
  if (value === null || value === undefined || value === "" || value === "0x") {
    return BigInt(0);
  }
  
  try {
    return BigInt(value);
  } catch (error) {
    console.warn('Failed to convert to BigInt:', value, 'defaulting to 0');
    return BigInt(0);
  }
};

// Define the exact shape based on your actual store interface
type SelectorResult = {
  posts: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  isInitializing: boolean;
  hasError: boolean;
  errorMessage: string | null;
  currentPage: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
};

const usePostSelectors = () => {
  // Individual selectors to prevent re-renders
  const posts = usePostStore(state => state.posts || []);
  const isLoading = usePostStore(state => state.isLoadingPosts || false);
  const isRefreshing = usePostStore(state => state.isRefreshing || false);
  const isInitializing = usePostStore(state => state.isInitializing || false);
  const hasError = usePostStore(state => state.hasError || false);
  const errorMessage = usePostStore(state => state.errorMessage || null);
  const currentPage = usePostStore(state => state.currentPage || null);
  const totalPages = usePostStore(state => state.totalPages || null);
  const hasNextPage = usePostStore(state => state.hasNextPage || false);

  // Memoize computed values with safe BigInt conversion AND flattening
  const sortedPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return [];
    }
    
    // console.log('Raw posts before processing:', posts);
    // console.log('Posts structure check:', posts.map(p => ({ isArray: Array.isArray(p), type: typeof p })));
    
    // FLATTEN THE POSTS ARRAY - this is the key fix!
    let flattenedPosts = [];
    try {
      flattenedPosts = posts.flat();
     // console.log('Flattened posts:', flattenedPosts);
    } catch (error) {
      //console.error('Error flattening posts:', error);
      // Fallback: manual flattening
      flattenedPosts = [];
      for (const item of posts) {
        if (Array.isArray(item)) {
          flattenedPosts.push(...item);
        } else {
          flattenedPosts.push(item);
        }
      }
    }
    
    // Filter out any invalid posts
    const validPosts = flattenedPosts.filter(post => 
      post && 
      typeof post === 'object' && 
      post.postId !== undefined
    );
    
    // console.log('Valid posts after filtering:', validPosts.length);
    
    return validPosts.sort((a, b) => {
      try {
        const dateA = safeBigInt(a.date_posted);
        const dateB = safeBigInt(b.date_posted);
        return dateB > dateA ? 1 : -1;
      } catch (error) {
        console.error('Error sorting posts by date:', error, { a: a.date_posted, b: b.date_posted });
        return 0;
      }
    });
  }, [posts]);

  const canLoadMore = useMemo(() => {
    return hasNextPage && !isLoading && !isRefreshing;
  }, [hasNextPage, isLoading, isRefreshing]);

  return {
    posts: sortedPosts, // Return flattened and sorted posts
    isLoading,
    isRefreshing,
    isInitializing,
    hasError,
    errorMessage,
    currentPage,
    totalPages,
    hasNextPage,
    canLoadMore,
  };
};

export default usePostSelectors;