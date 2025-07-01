import CryptoJS from "crypto-js";

export interface EncryptedBackup {
  ciphertext: string;
  salt: string;
  iv: string;
}

// Encrypt a string using a password and return a JSON string
export function encryptWithPassword(
  plainText: string,
  password: string
): string {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv });

  const data: EncryptedBackup = {
    ciphertext: encrypted.toString(),
    salt: salt.toString(),
    iv: iv.toString(),
  };

  return JSON.stringify(data);
}

// Decrypt a previously encrypted JSON string using the correct password
export function decryptWithPassword(
  encryptedJson: string,
  password: string
): string | null {
  try {
    const parsed: EncryptedBackup = JSON.parse(encryptedJson);
    const { ciphertext, salt, iv } = parsed;

    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return null;
  }
}
