export const uploadFile = async (file) => {
  // console.log("FILE RECEIVED BY uploadFile:", JSON.stringify(file, null, 2));

  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });

    const response = await fetch("https://relayer-xsew.onrender.com/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const json = await response.json();
    console.log("Uploaded to IPFS:", json.url);
    return json.url;
  } catch (e) {
    console.log("error uploading file ", e);
  }
};
