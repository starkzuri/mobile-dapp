// import { BigNumber } from "bignumber.js";
// import { shortString, num, uint256 } from "starknet";

// export function bigintToShortStr(bigintstr) {
//   try {
//     if (!bigintstr) return "";
//     const bn = BigNumber(bigintstr);
//     const hex_sentence = `0x` + bn.toString(16);
//     return shortString.decodeShortString(hex_sentence);
//   } catch (error) {
//     return bigintstr;
//   }
// }

// export function convertToReadableNumber(string) {
//   const num = BigNumber(string).toString(16);
//   const hex_sentence = `0x` + num;
//   return shortString.decodeShortString(hex_sentence);
// }

// export function bigintToLongAddress(bigintstr) {
//   try {
//     if (!bigintstr) return "";
//     const bn = BigNumber(bigintstr);
//     const hex_sentence = `0x` + bn.toString(16);
//     return hex_sentence;
//   } catch (error) {
//     return bigintstr;
//   }
// }

// export const getUint256CalldataFromBN = (bn) => uint256.bnToUint256(bn);

// export const parseInputAmountToUint256 = (input, decimals) =>
//   getUint256CalldataFromBN(parseUnits(input, decimals).value);

// export const parseUnits = (value, decimals) => {
//   let [integer, fraction = ""] = value.split(".");

//   const negative = integer.startsWith("-");
//   if (negative) {
//     integer = integer.slice(1);
//   }

//   // If the fraction is longer than allowed, round it off
//   if (fraction.length > decimals) {
//     const unitIndex = decimals;
//     const unit = Number(fraction[unitIndex]);

//     if (unit >= 5) {
//       const fractionBigInt = BigInt(fraction.slice(0, decimals)) + BigInt(1);
//       fraction = fractionBigInt.toString().padStart(decimals, "0");
//     } else {
//       fraction = fraction.slice(0, decimals);
//     }
//   } else {
//     fraction = fraction.padEnd(decimals, "0");
//   }

//   const parsedValue = BigInt(`${negative ? "-" : ""}${integer}${fraction}`);

//   return {
//     value: parsedValue,
//     decimals,
//   };
// };

// export function timeAgo(timestamp) {
//   const now = Date.now();
//   const timeDifference = now - timestamp;

//   const seconds = Math.floor(timeDifference / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   const weeks = Math.floor(days / 7);
//   const months = Math.floor(days / 30);
//   const years = Math.floor(days / 365);

//   if (years > 0) {
//     return years === 1 ? "1 year ago" : `${years} years ago`;
//   }
//   if (months > 0) {
//     return months === 1 ? "1 month ago" : `${months} months ago`;
//   }
//   if (weeks > 0) {
//     return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
//   }
//   if (days > 0) {
//     return days === 1 ? "1 day ago" : `${days} days ago`;
//   }
//   if (hours > 0) {
//     return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
//   }
//   if (minutes > 0) {
//     return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
//   }
//   if (seconds > 0) {
//     return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
//   }

//   return "just now";
// }

// // export function multilineToSingleline(multilineString) {
// //   return multilineString.replace(/\n/g, "<br />");
// // }

// export function multilineToSingleline(multilineString) {
//   return multilineString
//     .replace(/\n/g, "<br />")
//     .replace(/\*(.*?)\*/g, "<b>$1</b>") // bold text
//     .replace(/^\s*-\s*(.*?)$/gm, "<li>$1</li>"); // lists
// }

// export function formatDate(timestamp) {
//   const date = new Date(timestamp);

//   const options = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   };

//   return date.toLocaleDateString("en-US", options);
// }

// export function isWithinOneDay(previousTimestamp) {
//   const currentTime = Date.now(); // get current timestamp
//   const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
//   const diffInMs = currentTime - previousTimestamp;
//   return diffInMs <= oneDayInMs;
// }

import { BigNumber } from "bignumber.js";
import { shortString, uint256 } from "starknet";

/**
 * Convert bigint string to decoded short string
 */
export function bigintToShortStr(
  bigintstr: string | number | undefined
): string {
  try {
    if (!bigintstr) return "";
    const bn = new BigNumber(bigintstr);
    const hex_sentence = `0x${bn.toString(16)}`;
    return shortString.decodeShortString(hex_sentence);
  } catch (error) {
    return String(bigintstr);
  }
}

/**
 * Convert number string to readable decoded short string
 */
export function convertToReadableNumber(input: string | number): string {
  const numHex = new BigNumber(input).toString(16);
  const hex_sentence = `0x${numHex}`;
  return shortString.decodeShortString(hex_sentence);
}

/**
 * Convert bigint string to hexadecimal address
 */
export function bigintToLongAddress(
  bigintstr: string | number | undefined
): string {
  try {
    if (!bigintstr) return "";
    const bn = new BigNumber(bigintstr);
    return `0x${bn.toString(16)}`;
  } catch (error) {
    return String(bigintstr);
  }
}

/**
 * Converts BigNumber to Uint256 calldata
 */
export const getUint256CalldataFromBN = (bn: any) => uint256.bnToUint256(bn);

/**
 * Parses input string value to Uint256
 */
export const parseInputAmountToUint256 = (input: string, decimals: number) =>
  getUint256CalldataFromBN(parseUnits(input, decimals).value);

/**
 * Parses a decimal string value to bigint based on decimals
 */
export const parseUnits = (
  value: string,
  decimals: number
): { value: bigint; decimals: number } => {
  let [integer, fraction = ""] = value.split(".");
  const negative = integer.startsWith("-");

  if (negative) {
    integer = integer.slice(1);
  }

  // Round the fraction if it exceeds the allowed decimals
  if (fraction.length > decimals) {
    const roundingDigit = Number(fraction[decimals]);
    if (roundingDigit >= 5) {
      const rounded = BigInt(fraction.slice(0, decimals)) + BigInt(1);
      fraction = rounded.toString().padStart(decimals, "0");
    } else {
      fraction = fraction.slice(0, decimals);
    }
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }

  const parsed = BigInt(`${negative ? "-" : ""}${integer}${fraction}`);

  return {
    value: parsed,
    decimals,
  };
};

/**
 * Returns a human-readable time ago string
 */
export function timeAgo(timestamp: number | bigint): string {
  const now = Date.now();

  // Convert to number if BigInt
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;

  const timeDifference = now - ts;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months > 0) return months === 1 ? "1 month ago" : `${months} months ago`;
  if (weeks > 0) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  if (seconds > 0)
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;

  return "just now";
}

/**
 * Converts multiline string into single line with HTML
 */
export function multilineToSingleline(multilineString: string): string {
  return multilineString
    .replace(/\n/g, "<br />")
    .replace(/\*(.*?)\*/g, "<b>$1</b>") // bold
    .replace(/^\s*-\s*(.*?)$/gm, "<li>$1</li>"); // list items
}

/**
 * Formats timestamp to a full readable date string
 */
export function formatDate(timestamp: number | string): string {
  const date = new Date(Number(timestamp));
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options);
}

/**
 * Checks if a timestamp is within the last 24 hours
 */
export function isWithinOneDay(previousTimestamp: number): boolean {
  const currentTime = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return currentTime - previousTimestamp <= oneDayInMs;
}

/**
 * Truncates an address by showing the first `start` and last `end` characters.
 * @param address - The full address (e.g., Starknet address).
 * @param start - Number of characters to keep from the start.
 * @param end - Number of characters to keep from the end.
 * @returns Truncated address (e.g., "0x123...abcd").
 */
export function truncateAddress(
  address: string,
  start: number = 4,
  end: number = 4
): string {
  if (!address) return "";

  // Validate input
  if (start < 0 || end < 0) {
    throw new Error("Start and end values must be positive.");
  }
  if (start + end >= address.length) {
    return address; // Return full address if truncation isn't possible
  }

  const firstPart = address.substring(0, start);
  const lastPart = address.substring(address.length - end);

  return `${firstPart}...${lastPart}`;
}
