import { Post } from "@/stores/usePaginationStore";
import Constants from "expo-constants";
import { User } from "./MiniFunctions";
import { bigintToLongAddress, bigintToShortStr, truncateAddress } from "./AppUtils";

const { PUBLIC_SUPABASE_URL_COMMENT_NOTIFICATION_URL, SUPABASE_ANON_KEY } =
    Constants.expoConfig?.extra || {};

export const sendCommentNotification = async (
  post: Post | undefined, 
  commenter: User, 
  commentText: string
) => {
    if (!post) return;
    
    const targetAddress = bigintToLongAddress(post.author?.userId) || bigintToLongAddress(post.caller);
    const commenterAddress = bigintToLongAddress(commenter.userId);
    const commenterName = bigintToShortStr(commenter.username) || truncateAddress(commenterAddress);
    
    // Truncate comment text if too long
    let truncatedComment = commentText;
    if (commentText && commentText.length > 50) {
        truncatedComment = `${commentText.slice(0, 47)}...`;
    }
    
    // Fire and forget notification - NO AWAIT
    fetch(`${PUBLIC_SUPABASE_URL_COMMENT_NOTIFICATION_URL}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        targetWalletAddress: targetAddress,
        commenterWalletAddress: commenterAddress,
        postId: post.postId,
        commenterName: commenterName,
        commentText: truncatedComment,
        postType: 'post'
      })
    }).catch(() => {
      // Silent fail - notification failure shouldn't affect user experience
    });
}