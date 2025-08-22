import { Post } from "@/stores/usePaginationStore";
import Constants from "expo-constants";
import { User } from "./MiniFunctions";
import { bigintToLongAddress, bigintToShortStr, truncateAddress } from "./AppUtils";
import { shortString } from "starknet";

const { PUBLIC_SUPABASE_URL_NOTIFICATION_URL, SUPABASE_ANON_KEY } =
    Constants.expoConfig?.extra || {};

export const sendNotification  = async (post: Post | undefined, user: User) =>{

    if (!post) return;

    const targetAddress = bigintToLongAddress(post.author?.userId) || bigintToLongAddress(post.caller);;
    const userAddress = bigintToLongAddress(user.userId);
    const username = bigintToShortStr(user.username) || truncateAddress(userAddress)

    let content = post.content;
    if (content && content.length > 50) {
        content = `${content.slice(0, 47)}...`;
    }

    // Fire and forget notification - NO AWAIT
    fetch(`${PUBLIC_SUPABASE_URL_NOTIFICATION_URL}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        targetWalletAddress: targetAddress,
        likerWalletAddress: userAddress,
        postId: post.postId,
        likerName: username,
        content: content,
        postType: 'post'
      })
    }).catch(() => {
      // Silent fail - notification failure shouldn't affect user experience
    });


}