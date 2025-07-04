import { useMemo } from 'react';
import usePostStore from '@/stores/usePaginationStore';


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

  const posts = usePostStore(state => state.posts || []);
  const isLoading = usePostStore(state => state.isLoadingPosts || false);
  const isRefreshing = usePostStore(state => state.isRefreshing || false);
  const isInitializing = usePostStore(state => state.isInitializing || false);
  const hasError = usePostStore(state => state.hasError || false);
  const errorMessage = usePostStore(state => state.errorMessage || null);
  const currentPage = usePostStore(state => state.currentPage || null);
  const totalPages = usePostStore(state => state.totalPages || null);
  const hasNextPage = usePostStore(state => state.hasNextPage || false);

 
  const sortedPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return [];
    }
    
    return [...posts].sort((a, b) => {
      try {
        const dateA = BigInt(a.date_posted || 0);
        const dateB = BigInt(b.date_posted || 0);
        return dateB > dateA ? 1 : -1;
      } catch (error) {
        console.warn('Error sorting posts by date:', error);
        return 0;
      }
    });
  }, [posts]);

  const canLoadMore = useMemo(() => {
    return hasNextPage && !isLoading && !isRefreshing;
  }, [hasNextPage, isLoading, isRefreshing]);

  return {
    posts: sortedPosts, // Return sorted posts
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