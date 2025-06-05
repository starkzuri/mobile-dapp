import Constants from "expo-constants";
import { RpcProvider, constants } from "starknet";

const { PUBLIC_CHAIN_ID, ARGENT_WEBWALLET_URL } =
  Constants.expoConfig?.extra || {};

export const NODE_URL =
  PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";

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
