import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "@/utils/Infura";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useAppContext } from "@/providers/AppProvider";
import MiniFunctions from "@/utils/MiniFunctions";
import ConfirmPostModal from "./PostConfirmationModal";
import Toast from "react-native-toast-message";
import { CONTRACT_ADDRESS } from "@/providers/abi";
import { weiToEth } from "@/utils/AppUtils";

const { width } = Dimensions.get("window");

const CreateReelForm = ({ onClose }) => {
  const { account, isReady, contract, address } = useAppContext();
  const [videoUri, setVideoUri] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const user = MiniFunctions(address?.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState("");
  const [platformFee, setPlatformFee] = useState("");

  const handleVideoPicker = () => {
    Alert.alert("Select Video", "choose an option", [
      { text: "Camera", onPress: () => selectVideo("camera") },
      { text: "gallery", onPress: () => selectVideo("gallery") },
    ]);
  };

  const selectVideo = async (source: "camera" | "gallery") => {
    // const options = {
    //   mediaType: "video",
    //   videoQuality: "high",
    //   durationLimit: 60,
    // };

    const permissionResult =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "you still need to allow access");
      return;
    }

    const uploadedUrls: string[] = [];

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.8,
            videoMaxDuration: 60,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 60,
            quality: 1,
          });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      // validate duration(recommended)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Media Library access is required.");
        return;
      }

      const savedAsset = await MediaLibrary.createAssetAsync(asset.uri);
      const assetInfo = await MediaLibrary.getAssetInfoAsync(savedAsset.id);

      console.log("Video duration:", assetInfo.duration); // in seconds

      if (assetInfo.duration > 60) {
        Alert.alert("Too long", "Video must be 60 seconds or less.");
        return;
      }

      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
        asset.uri,
        {
          time: 1000, // Get thumbnail at 1 second mark
        }
      );

      Toast.show({
        type: "info",
        text1: "uploading video",
        position: "top",
        autoHide: false,
      });

      try {
        setIsLoading(true);

        const file = {
          uri: asset.uri,
          name: asset.fileName || `reel_${Date.now()}.mp4`,
          type: "video/mp4",
        };

        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          setVideoUrl(uploadedUrl);
          setVideoUri(thumbnailUri);
          Toast.hide();

          console.log("Reel uploaded to:", uploadedUrl);
          console.log("Thumbnail preview:", thumbnailUri);
          console.log("video loading ", isLoading);
        } else {
          Toast.hide();
          Toast.show({
            type: "error",
            text1: "Upload failed",
            text2: "Try uploading again later",
          });
        }
      } catch (error) {
        setIsLoading(false);
        Toast.hide();
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: "please try again later",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const verifyUploadVideo = async () => {
    if (!videoUrl) {
      Alert.alert("Missing Video", "Please select a video to upload");
      return;
    }

    if (description.trim() === "") {
      Alert.alert(
        "Missing Description",
        "Please add a description for your reel"
      );
      return;
    }
    await estimateGasFees();
    setIsModalVisible(true);
  };

  const estimateGasFees = async () => {
    if (!isReady || !account || !contract) return;

    const myCall = contract.populate("create_reel", [description, videoUrl]);

    try {
      const { suggestedMaxFee, unit } = await account.estimateInvokeFee({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "create_reel",
        calldata: myCall.calldata,
      });

      const feeToEth = weiToEth(suggestedMaxFee, 0);
      setEstimatedFee(feeToEth);
      setPlatformFee("0.00");
    } catch (error) {
      console.log("some error occured ", error);
    }
  };

  const handleSubmit = async () => {
    if (!videoUrl) {
      Alert.alert("Missing Video", "Please select a video to upload");
      return;
    }

    if (description.trim() === "") {
      Alert.alert(
        "Missing Description",
        "Please add a description for your reel"
      );
      return;
    }

    if (!isReady || !account || !contract) return;
    Toast.show({
      type: "info",
      text1: "Processing Transaction...",
      position: "top",
      autoHide: false,
    });

    const myCall = contract.populate("create_reel", [description, videoUrl]);

    try {
      const res = await account.execute(myCall);
      Alert.alert("video uploaded successfully");
      console.log("reel created", res.transaction_hash);
      Toast.hide();
      Toast.show({
        type: "success",
        text1: "reel uploaded!",
        text2: "Your reel is now live 🎉",
      });
    } catch (err) {
      // Alert.alert("error upoading video");
      console.error("TX failed: ", err);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Reel upload Failed",
        text2: "Please try again later 😢",
      });
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.arrowIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
        </View>
        <View style={styles.headerRight}>
          <Image
            source={{
              uri:
                user.profile_pic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Video Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video</Text>
        <TouchableOpacity
          style={[
            styles.uploadContainer,
            videoUri && styles.uploadContainerWithVideo,
          ]}
          onPress={handleVideoPicker}
          activeOpacity={0.8}
        >
          {/* {videoUri ? (
            <ImageBackground
              source={{ uri: videoUri }}
              style={styles.videoPreview}
            >
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoIcon}>▶️</Text>
                <Text style={styles.videoText}>Video Selected</Text>
                <Text style={styles.changeVideoText}>Tap to change</Text>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📹</Text>
              </View>
              <Text style={styles.uploadText}>Tap to select video</Text>
              <Text style={styles.uploadSubtext}>
                MP4, MOV up to 60 seconds
              </Text>
            </View>
          )} */}

          {isLoading ? (
            <View style={[styles.videoPreview, styles.loadingOverlay]}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Uploading video...</Text>
            </View>
          ) : videoUri ? (
            <ImageBackground
              source={{ uri: videoUri }}
              style={styles.videoPreview}
            >
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoIcon}>▶️</Text>
                <Text style={styles.videoText}>Video Selected</Text>
                <Text style={styles.changeVideoText}>Tap to change</Text>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📹</Text>
              </View>
              <Text style={styles.uploadText}>Tap to select video</Text>
              <Text style={styles.uploadSubtext}>
                MP4, MOV up to 60 seconds
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write a caption that will engage your audience..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>
      </View>

      {/* Hashtag Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Tags</Text>
        <View style={styles.tagsContainer}>
          {["#trending", "#starkzuri", "#viral", "#creative", "#daily"].map(
            (tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => setDescription((prev) => prev + " " + tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          isUploading && styles.submitButtonDisabled,
        ]}
        onPress={verifyUploadVideo}
        disabled={isUploading}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {isUploading ? "Creating Reel..." : "Create Reel"}
        </Text>
      </TouchableOpacity>

      <Toast />

      <ConfirmPostModal
        visible={isModalVisible}
        onConfirm={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        message=""
        gasFee={estimatedFee}
        platformFee={platformFee}
      />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  arrowIcon: {
    fontSize: 24,
    color: "#d1d5db",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerRight: {
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1f87fc",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: "#1f87fc",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    backgroundColor: "rgba(31, 135, 252, 0.05)",
  },
  uploadContainerWithVideo: {
    borderStyle: "solid",
    backgroundColor: "rgba(31, 135, 252, 0.1)",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1f87fc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadIconText: {
    fontSize: 24,
  },
  uploadText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  videoPreview: {
    alignItems: "center",
  },
  videoPlaceholder: {
    alignItems: "center",
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  videoText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 4,
  },
  changeVideoText: {
    fontSize: 14,
    color: "#1f87fc",
  },
  inputContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
  },
  textInput: {
    color: "#ffffff",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  characterCount: {
    color: "#666",
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(31, 135, 252, 0.15)",
    borderColor: "#1f87fc",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: "#1f87fc",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#1f87fc",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1f87fc",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#666",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 40,
  },
  loadingOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent overlay
    borderRadius: 12,
  },

  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CreateReelForm;
