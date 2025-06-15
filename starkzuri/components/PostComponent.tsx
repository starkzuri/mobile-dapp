import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import {
  Camera,
  Image as ImageIcon,
  X,
  Send,
  Zap,
  ArrowLeft,
} from "lucide-react-native";
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";
import { useRouter } from "expo-router";
import { useAppContext } from "@/providers/AppProvider";
import { multilineToSingleline } from "@/utils/AppUtils";
import MiniFunctions from "@/utils/MiniFunctions";

const CreatePostComponent = ({ onCreatePost, userAddress, onClose }) => {
  const { account, isReady, contract } = useAppContext();
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = MiniFunctions(account?.address?.toString());

  const MAX_CONTENT_LENGTH = 280;

  const handleImagePicker = () => {
    // Mock image picker - in real app, use react-native-image-picker
    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: () => selectImage("camera") },
      { text: "Gallery", onPress: () => selectImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const selectImage = async (source) => {
    // Mock image selection - replace with actual image picker logic
    const options: ImageLibraryOptions & CameraOptions = {
      mediaType: "photo",
      quality: 0.8,
      includeBase64: false,
    };

    try {
      const result =
        source === "camera"
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.didCancel) {
        console.log("user did cancel the image picker");
        return;
      }

      if (result.errorCode) {
        console.error("ImagePicker Error", result.errorMessage);
        return;
      }

      const asset: Asset | undefined = result.assets?.[0];

      if (asset) {
        const { uri, fileName, type } = asset;
        console.log("selected image ", { uri, fileName, type });
        // showing the image now

        setSelectedImage({
          uri: uri,
          name: `image_${fileName}${Date.now()}.jpg`,
          type: type,
        });
      }
    } catch (error) {
    } finally {
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert("Error", "Please enter some content for your post");
      return;
    }

    setIsLoading(true);

    if (!isReady || !account || !contract) return;

    try {
      // const newPost = {
      //   content: postContent.trim(),
      //   image: selectedImage,
      //   timestamp: Date.now(),
      // };

      const formattedContent = multilineToSingleline(postContent.trim());

      // Call the parent component's create post function
      // await onCreatePost(newPost);

      const myCall = contract.populate("create_post", [
        formattedContent,
        selectedImage,
      ]);

      const res = await account.execute(myCall);
      console.log("post made", res.transaction_hash);

      // Reset form
      setPostContent("");
      setSelectedImage("");

      Alert.alert("Success", "Your post has been created!");
    } catch (error) {
      console.error("TX failed ", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getShortAddress = (address) => {
    if (!address) return "Anonymous";
    const addr = address.toString();
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const remainingChars = MAX_CONTENT_LENGTH - postContent.length;
  const isOverLimit = remainingChars < 0;
  const canPost = postContent.trim().length > 0 && !isOverLimit && !isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#d1d5db" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri: user.profile_pic,
                }}
                style={styles.avatar}
              />
            </Pressable>
          </View>
        </View>

        {/* Content Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's happening on StarkZuri?"
            placeholderTextColor="#666666"
            multiline
            value={postContent}
            onChangeText={setPostContent}
            maxLength={MAX_CONTENT_LENGTH + 50} // Allow slight overflow for warning
          />

          {/* Character Counter */}
          <View style={styles.characterCounter}>
            <Text
              style={[
                styles.counterText,
                isOverLimit && styles.overLimitText,
                remainingChars <= 20 &&
                  remainingChars >= 0 &&
                  styles.warningText,
              ]}
            >
              {remainingChars}
            </Text>
          </View>
        </View>

        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleImagePicker}
            >
              <ImageIcon size={20} color="#1f87fc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handleImagePicker}
            >
              <Camera size={20} color="#1f87fc" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.postButton, canPost && styles.postButtonActive]}
            onPress={handleCreatePost}
            disabled={!canPost}
          >
            {isLoading ? (
              <Text style={styles.postButtonText}>Posting...</Text>
            ) : (
              <>
                <Send size={16} color={canPost ? "#FFFFFF" : "#666666"} />
                <Text
                  style={[
                    styles.postButtonText,
                    canPost && styles.postButtonTextActive,
                  ]}
                >
                  Post
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Maximize your Zuri Points:</Text>
          <Text style={styles.tipText}>
            • Post engaging content that sparks conversations
          </Text>
          <Text style={styles.tipText}>
            • Add images to increase visibility
          </Text>
          <Text style={styles.tipText}>
            • Engage with your audience in comments
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1f87fc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(31, 135, 252, 0.3)",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  rewardInfoContainer: {
    marginBottom: 20,
  },
  rewardInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(31, 135, 252, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(31, 135, 252, 0.3)",
  },
  rewardText: {
    color: "#1f87fc",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333333",
    position: "relative",
  },
  textInput: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCounter: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: "#8B8B8B",
    fontSize: 12,
    fontWeight: "500",
  },
  warningText: {
    color: "#ffa500",
  },
  overLimitText: {
    color: "#ff4757",
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    padding: 6,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mediaButtons: {
    flexDirection: "row",
    gap: 12,
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(31, 135, 252, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(31, 135, 252, 0.3)",
  },
  postButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  postButtonActive: {
    backgroundColor: "#1f87fc",
  },
  postButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  postButtonTextActive: {
    color: "#FFFFFF",
  },
  tipsContainer: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  tipsTitle: {
    color: "#1f87fc",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipText: {
    color: "#8B8B8B",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default CreatePostComponent;
