import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

type Reel = {
  reel_id: number;
  caller: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  video: string;
  timestamp: number;
  description: string;
  zuri_points: number;
};

// const reels = [
//   {
//     id: "1",
//     video: {
//       uri: "https://hambre.infura-ipfs.io/ipfs/QmUpUgkQWoRcjM2vUkYysAHNeQuVZSuhpFsQUh4y26e43b",
//     },
//     username: "@felix",
//     caption: "This is how Stark Zuri rewards its creators.",
//     sound: "original sound - StarkZuri",
//   },
//   {
//     id: "2",
//     video: {
//       uri: "https://hambre.infura-ipfs.io/ipfs/QmTNHQgcjSXLMCoAhNVjs4xc5GpvjTmijMeBakFTQLaZti",
//     },
//     username: "@zuriuser",
//     caption: "Build. Post. Earn. #StarkZuri",
//     sound: "trending beat - Zuri",
//   },
// ];

import { useAppContext } from "@/providers/AppProvider";

const ReelItem = ({ item, isVisible }) => {
  const videoRef = useRef(null);

  React.useEffect(() => {
    if (isVisible) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isVisible]);

  const video = { uri: item.video };

  return (
    <View style={styles.reelContainer}>
      <Video
        ref={videoRef}
        source={video}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay={isVisible} // play only when visible
        volume={1.0}
        muted={false} // explicitly unmuted
      />
      <View style={styles.overlay}>
        <View style={styles.captionContainer}>
          <Text style={styles.username}>{item.caller}</Text>
          <Text style={styles.caption}>{item.description}</Text>
          <Text style={styles.sound}>{item.sound}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity>
            <Ionicons name="heart" size={32} color="#1f87fc" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble"
              size={28}
              color="#fff"
              style={{ marginTop: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="share-social"
              size={28}
              color="#fff"
              style={{ marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Write a comment..."
          placeholderTextColor="#ccc"
          style={styles.commentInput}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#1f87fc" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  const { contract } = useAppContext();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);

  const view_reels = () => {
    const myCall = contract.populate("view_reels", []);
    setLoading(true);
    contract["view_reels"](myCall.calldata, {
      parseResponse: false,
      parseRequest: false,
    })
      .then((res) => {
        let val = contract.callData.parse("view_reels", res?.result ?? res);
        const shuffledArray = val
          .slice()
          .map((obj) => ({ ...obj }))
          .sort(() => Math.random() - 0.5);
        setReels(shuffledArray);
      })
      .catch((err) => {
        console.error("Error: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (contract) {
      view_reels();
    }
  }, [contract]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        data={reels}
        keyExtractor={(item) => item.reel_id}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isVisible={index === visibleIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height} // snap per screen height
        decelerationRate="fast" // smooth snap
        snapToAlignment="start" // align snap to start
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / height);
          setVisibleIndex(index);
        }}
        scrollEventThrottle={16} // for smooth onScroll
        getItemLayout={(_, index) => ({
          // improves performance & snapping
          length: height,
          offset: height * index,
          index,
        })}
      />

      <TouchableOpacity style={styles.createReelButton}>
        <Ionicons name="add-circle" size={48} color="#1f87fc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  reelContainer: {
    width,
    height,
    position: "relative",
  },
  video: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
  },
  captionContainer: {
    width: "80%",
    justifyContent: "flex-end",
    paddingBottom: 80,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  sound: {
    color: "#1f87fc",
    fontSize: 12,
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
  },
  commentInputContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 80, // changed from 60 to 80 to avoid overlap
    backgroundColor: "#1a1a1a",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    zIndex: 1, // ensures it's not hidden behind other components
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    height: 40,
  },
  sendButton: {
    paddingLeft: 10,
  },
  createReelButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 2, // keep it above the comment box
  },
});
