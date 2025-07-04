
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

 const usePost = (postId: number) => {
  const post = usePostStore(state => state.getPostById(postId));
  const updatePost = usePostStore(state => state.updatePost);
  const removePost = usePostStore(state => state.removePost);

  const update = useCallback((updates: Partial<Post>) => {
    updatePost(postId, updates);
  }, [postId, updatePost]);

  const remove = useCallback(() => {
    removePost(postId);
  }, [postId, removePost]);

  return {
    post,
    update,
    remove,
    isLoading: post?.isOptimistic || false
  };
};


export default usePost;