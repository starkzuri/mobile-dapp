import * as FileSystem from "expo-file-system";
import mime from "mime";

// Replace with Storacha or Web3.Storage endpoint
const STORACHA_UPLOAD_URL = "https://api.web3.storage/upload";
const STORACHA_API_KEY = "z6MkkYHYAZuEiBoohYUB4SBS7tMSmBDppH6p8Vq5iGxEppwZ";

export const uploadImagesToStoracha = async (imageUris: string[]) => {
  const formData = new FormData();

  for (let uri of imageUris) {
    const name = uri.split("/").pop() ?? `file-${Date.now()}.jpg`;
    const type = mime.getType(uri) ?? "image/jpeg";

    formData.append("file", {
      uri,
      name,
      type,
    } as any);
  }

  const res = await fetch(STORACHA_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STORACHA_API_KEY}`,
    },
    body: formData,
  });

  const json = await res.json();

  // The CID or file access path will be here
  const cid = json.cid;
  const urls = imageUris.map((uri) => {
    const fileName = uri.split("/").pop();
    return `https://ipfs.io/ipfs/${cid}/${fileName}`;
  });

  return urls;
};
