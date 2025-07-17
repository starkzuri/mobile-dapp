import { useAppContext } from "@/providers/AppProvider";
import { bigintToLongAddress } from "@/utils/AppUtils";
import { useState, useEffect, SetStateAction } from "react";


type User = {
  userId: number;
  name: number;
  username: number;
  about: string;
  profile_pic: string;
  cover_photo: string;
  date_registered: number;
  no_of_followers: number;
  number_following: number;
  notifications: number;
  zuri_points: number;
};

const useUser = (accountAddress: bigint | string | null | undefined) => {
  const { contract } = useAppContext();
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when accountAddress changes
    setUser(null);
    setError(null);
    
    // Don't fetch if no contract or accountAddress
    if (!contract || !accountAddress) {
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userAddress = bigintToLongAddress(accountAddress);
        const myCall = contract.populate("view_user", [userAddress]);
        
        const res = await contract["view_user"](myCall.calldata, {
          parseResponse: false,
          parseRequest: false,
        });
        
        // Parse the response
        const parsedUser = res;
        setUser(parsedUser);
        
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [contract, accountAddress]);

  return {
    user,
    loadingUser,
    error,
    refetch: () => {
      if (contract && accountAddress) {
        const userAddress = bigintToLongAddress(accountAddress);
        const myCall = contract.populate("view_user", [userAddress]);
        setLoading(true);
        contract["view_user"](myCall.calldata, {
          parseResponse: false,
          parseRequest: false,
        })
          .then((res: any) => {
            const parsedUser =res;
            setUser(parsedUser);
            setError(null);
          })
          .catch((err: { message: SetStateAction<string | null>; }) => {
            console.error("Error refetching user:", err);
            setError(err instanceof Error ? err.message : "Failed to refetch user");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
};

export default useUser;