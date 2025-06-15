import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 columns with padding

const RewardCards = ({ onCardPress }) => {
  const rewardCards = [
    {
      id: "1",
      title: "Engagement Star",
      icon: "⭐",
      description: "Master of community engagement and interaction",
    },
    {
      id: "2",
      title: "Thought Leader",
      icon: "🧠",
      description: "Influential voice sharing valuable insights",
    },
    {
      id: "3",
      title: "Impact Badge",
      icon: "💥",
      description: "Making a significant difference in the community",
    },
    {
      id: "4",
      title: "Viral Booster",
      icon: "🚀",
      description: "Content that spreads like wildfire",
    },
    {
      id: "5",
      title: "Educator",
      icon: "🎓",
      description: "Teaching and sharing knowledge with others",
    },
    {
      id: "6",
      title: "Community Builder",
      icon: "🏗️",
      description: "Bringing people together and fostering connections",
    },
    {
      id: "7",
      title: "Earner",
      icon: "💰",
      description: "Consistent contributor earning rewards",
    },
    {
      id: "8",
      title: "Premium Creator",
      icon: "👑",
      description: "High-quality content creator with premium status",
    },
    {
      id: "9",
      title: "Trustworthy",
      icon: "🛡️",
      description: "Reliable and trusted community member",
    },
    {
      id: "10",
      title: "Collector",
      icon: "🏆",
      description: "Dedicated collector of achievements and rewards",
    },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onCardPress && onCardPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rewardCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingVertical: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1f87fc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#1f87fc",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "#b0b0b0",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default RewardCards;
