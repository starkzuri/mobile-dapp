import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";
import { Contract, Provider, constants, ProviderInterface } from "starknet";
import { ABI, CONTRACT_ADDRESS } from "./abi";
// import { connect } from "get-starknet"; // Ensure you have this installed

import { NODE_URL } from "../utils/constants";

// console.log(ABI);

// --------------------
// Types
// --------------------
type ViewUserFn = (address: string) => Promise<any> | void;

interface AppContextType {
  address: string | null;
  contract: Contract | null;
  provider: ProviderInterface | null;
  viewUser: ViewUserFn;
}

// --------------------
// Initial Values
// --------------------
const initialData: AppContextType = {
  address: null,
  contract: null,
  provider: null,
  viewUser: () => {},
};

const AppContext = createContext<AppContextType>(initialData);
export const useAppContext = () => useContext(AppContext);

// --------------------
// Provider
// --------------------
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<ProviderInterface | null>(null);

  // console.log(contract);

  const viewUser: ViewUserFn = async (address) => {
    if (!contract) return;

    try {
      const myCall = contract.populate("view_user", [address]);
      const result = await contract["view_user"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const parsed = contract.callData.parse(
        "view_user",
        result?.result ?? result
      );
      console.log(parsed);
      return parsed;
    } catch (error) {
      console.error("Error viewing user:", error);
    }
  };

  const connectContract = () => {
    try {
      let _provider: ProviderInterface = new Provider({ nodeUrl: NODE_URL });

      if (provider) {
        _provider = provider;
      }

      const _contract = new Contract(ABI, CONTRACT_ADDRESS, _provider);
      setContract(_contract);
      // console.log(_contract);
      // console.log("Connected Contract:", _contract);
    } catch (error) {
      console.error("Error connecting to contract:", error);
    }
  };

  // const connectToStarknet = async () => {
  //   try {
  //     const { wallet } = await connect({
  //       modalMode: "neverAsk",
  //     });

  //     if (wallet?.isConnected && wallet.account) {
  //       setProvider(wallet.account);
  //       setAddress(wallet.account.address);
  //     }
  //   } catch (error) {
  //     console.error("Error connecting to Starknet wallet:", error);
  //   }
  // };

  const appValue = useMemo<AppContextType>(
    () => ({
      address,
      contract,
      provider,
      viewUser,
    }),
    [address, contract, provider]
  );

  // useEffect(() => {
  //   if (provider) connectContract();
  // }, [provider]);

  useEffect(() => {
    connectContract();
  }, []);

  return <AppContext.Provider value={appValue}>{children}</AppContext.Provider>;
};

export { AppProvider };
