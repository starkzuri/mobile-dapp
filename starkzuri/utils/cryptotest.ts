// utils/crypto.ts
import * as Random from "expo-random";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const MAX_KEY = BigInt(
  "3618502788666131213697322783095070105526743751716087489154079457884512865583"
);

async function getKeyFromPassword(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithPassword(plainText, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommended 12 bytes IV
  const key = await getKeyFromPassword(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plainText)
  );

  // Return base64 concatenated: salt + iv + ciphertext
  const buffer = new Uint8Array(
    salt.byteLength + iv.byteLength + encrypted.byteLength
  );
  buffer.set(salt, 0);
  buffer.set(iv, salt.byteLength);
  buffer.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  return btoa(String.fromCharCode(...buffer));
}

export async function decryptWithPassword(cipherTextBase64, password) {
  const data = Uint8Array.from(atob(cipherTextBase64), (c) => c.charCodeAt(0));

  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);

  const key = await getKeyFromPassword(password, salt);
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );
    return decoder.decode(decrypted);
  } catch {
    return null; // wrong password or corrupted
  }
}
