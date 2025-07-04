import usePostStore from '@/stores/usePaginationStore';
import { useCallback } from 'react';

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

const usePostActions = () => {
  // Get stable references to store methods
  const setContract = usePostStore(state => state.setContract);
  const initializePagination = usePostStore(state => state.initializePagination);
  const loadMorePosts = usePostStore(state => state.loadMorePosts);
  const refreshPosts = usePostStore(state => state.refreshPosts);
  const updatePost = usePostStore(state => state.updatePost);
  const optimisticLike = usePostStore(state => state.optimisticLike);
  const revertOptimisticLike = usePostStore(state => state.revertOptimisticLike);
  const addPost = usePostStore(state => state.addPost);
  const removePost = usePostStore(state => state.removePost);
  const clearError = usePostStore(state => state.clearError);
  const reset = usePostStore(state => state.reset);

  const initializePosts = useCallback(async (contract: any) => {
    setContract(contract);
    await initializePagination();
  }, []); 

  const loadMore = useCallback(async () => {
    await loadMorePosts();
  }, []);

  const refresh = useCallback(async () => {
    await refreshPosts();
  }, []); 

  const likePost = useCallback(async (postId: number, onLike: (id: number) => Promise<void>) => {
    // Optimistic update
    optimisticLike(postId);
    
    try {
      await onLike(postId);
    
      updatePost(postId, { isOptimistic: false });
    } catch (error) {

      revertOptimisticLike(postId);
      throw error;
    }
  }, []);

  const claimPoints = useCallback(async (postId: number, onClaim: (id: number) => Promise<void>) => {
    // Get current post data
    const currentPost = usePostStore.getState().getPostById(postId);
    const originalPoints = currentPost?.zuri_points || "0";
    
    // Optimistic update
    updatePost(postId, { zuri_points: "0", isOptimistic: true });
    
    try {
      await onClaim(postId);
      // Confirm the update
      updatePost(postId, { isOptimistic: false });
    } catch (error) {
      // Revert optimistic update
      updatePost(postId, { zuri_points: originalPoints, isOptimistic: false });
      throw error;
    }
  }, []); // Remove updatePost from dependencies

  return {
    initializePosts,
    loadMore,
    refresh,
    likePost,
    claimPoints,
    addPost,
    updatePost,
    removePost,
    clearError,
    reset
  };
};

export default usePostActions;