// import { useAppContext } from "@/providers/AppProvider";
// import React, { useState, useEffect } from "react";
// import { bigintToLongAddress } from "./AppUtils";

// type User = {
//   userId: number;
//   name: number;
//   username: number;
//   about: string;
//   profile_pic: string;
//   cover_photo: string;
//   date_registered: number;
//   no_of_followers: number;
//   number_following: number;
//   notifications: number;
//   zuri_points: number;
// };

// const MiniFunctions = (accountAddress) => {
//   const { contract } = useAppContext();
//   const [user, setUser] = useState<User>({
//     userId: 0,
//     name: 0,
//     username: 0,
//     about: "",
//     profile_pic: "",
//     cover_photo: "",
//     date_registered: 0,
//     no_of_followers: 0,
//     number_following: 0,
//     notifications: 0,
//     zuri_points: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const userAddress = bigintToLongAddress(accountAddress);

//   const view_user = () => {
//     const myCall = contract.populate("view_user", [userAddress]);
//     setLoading(true);
//     contract["view_user"](myCall.calldata, {
//       parseResponse: false,
//       parseRequest: false,
//     })
//       .then((res) => {
//         let val = contract.callData.parse("view_user", res?.result ?? res);
//         console.log("user " + val);
//         setUser(val);
//       })
//       .catch((err) => {
//         console.error("Error: ", err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     view_user();
//   }, [contract]);

//   return user;
// };

// export default MiniFunctions;

import { useAppContext } from "@/providers/AppProvider";
import React, { useState, useEffect } from "react";
import { bigintToLongAddress } from "./AppUtils";

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

// Assuming accountAddress is a bigint or string that bigintToLongAddress can accept
const MiniFunctions = (accountAddress: bigint | string): User => {
  const { contract } = useAppContext();

  const [user, setUser] = useState<User>({
    userId: 0,
    name: 0,
    username: 0,
    about: "",
    profile_pic: "",
    cover_photo: "",
    date_registered: 0,
    no_of_followers: 0,
    number_following: 0,
    notifications: 0,
    zuri_points: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const userAddress = bigintToLongAddress(accountAddress);

  const view_user = async () => {
    try {
      const myCall = await contract.populate("view_user", [userAddress]);
      setLoading(true);
      const res = await contract["view_user"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const val = contract.callData.parse("view_user", res?.result ?? res);
      setUser(val);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) view_user();
  }, [contract, accountAddress]);

  return user;
};

// const viewConnectedUser = (id: string) => {
//   const { contract } = useAppContext();
// };

export default MiniFunctions;
