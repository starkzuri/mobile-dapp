import usePostStore from "@/stores/usePaginationStore";

const usePostsByUser = (userId: number) => {
  const posts = usePostStore(state => state.getPostsByUser(userId));
  
  return {
    posts,
    count: posts.length
  };
};

export default usePostsByUser;