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
  Dimensions,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const { width } = Dimensions.get("window");

const CreateReelForm = ({ onClose }) => {
  const [videoUri, setVideoUri] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const selectVideo = () => {
    const options = {
      mediaType: "video",
      videoQuality: "high",
      durationLimit: 60,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setVideoUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!videoUri) {
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

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert("Success!", "Your reel has been created successfully");
      // Reset form
      setVideoUri(null);
      setDescription("");
    }, 2000);
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
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
          onPress={selectVideo}
          activeOpacity={0.8}
        >
          {videoUri ? (
            <View style={styles.videoPreview}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoIcon}>▶️</Text>
                <Text style={styles.videoText}>Video Selected</Text>
                <Text style={styles.changeVideoText}>Tap to change</Text>
              </View>
            </View>
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
        onPress={handleSubmit}
        disabled={isUploading}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {isUploading ? "Creating Reel..." : "Create Reel"}
        </Text>
      </TouchableOpacity>

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
});

export default CreateReelForm;
