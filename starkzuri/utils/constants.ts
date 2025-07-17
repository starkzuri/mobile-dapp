import Constants from "expo-constants";
import { RpcProvider, constants } from "starknet";

const { PUBLIC_CHAIN_ID, ARGENT_WEBWALLET_URL } =
  Constants.expoConfig?.extra || {};

export const NODE_URL =
  PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";

export const STARKNET_CHAIN_ID =
  PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA;

export const ARGENT_WEBWALLET =
  ARGENT_WEBWALLET_URL || "https://web.argent.xyz";

export const provider = new RpcProvider({
  nodeUrl: NODE_URL,
  chainId: STARKNET_CHAIN_ID,
});


export const STRK_ADDRESS = "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// Primary social action fees
export const COMMENT_FEE = BigInt("142400000000000000"); // 0.1424 STRK
export const LIKE_FEE = BigInt("71200000000000000");     // 0.0712 STRK

// Community fees
export const COMMUNITY_JOIN_FEE = BigInt("71200000000000000"); // 0.0712 STRK

// Reel interaction fees
export const REEL_LIKE_FEE = BigInt("71200000000000000");    // 0.0712 STRK
export const REEL_COMMENT_FEE = BigInt("142400000000000000"); // 0.1424 STRK
export const REEL_REPOST_FEE = BigInt("71200000000000000");   // 0.0712 STRK
export const REEL_DISLIKE_FEE = BigInt("14000000000000");    // 0.000014 STRK

export const FEE_DESCRIPTIONS = {
  COMMENT: "Comment on post/reel",
  LIKE: "Like post or reel", 
  COMMUNITY_JOIN: "Join community",
  REEL_LIKE: "Like reel",
  REEL_COMMENT: "Comment on reel",
  REEL_REPOST: "Repost reel",
  REEL_DISLIKE: "Dislike reel",
} as const;