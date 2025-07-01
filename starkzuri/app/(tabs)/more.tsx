import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import MiniFunctions from "@/utils/MiniFunctions";
import { useAppContext } from "@/providers/AppProvider";
import { getEthBalance, weiToEth } from "@/utils/AppUtils";

// Icon components (you can replace these with react-native-vector-icons)
const IconWrapper = ({ children, color, size = 24 }) => (
  <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
    <Text style={[styles.iconText, { color, fontSize: size }]}>{children}</Text>
  </View>
);

const StarkZuriMoreTab = () => {
  const [recentReward, setRecentReward] = useState(null);
  const { account, address, contract } = useAppContext();
  const router = useRouter();
  const [ethbalance, setEthBalance] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  // console.log(ethbalance);

  const glowAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const rewardAnimation = useRef(new Animated.Value(0)).current;
  // const user = MiniFunctions(address);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    if (!contract || !address) return;
    try {
      const userAddress = address;
      const myCall = await contract.populate("view_user", [userAddress]);

      const res = await contract["view_user"](myCall.calldata, {
        parseResponse: false,
        parseRequest: false,
      });

      const val = contract.callData.parse("view_user", res?.result ?? res);

      setUser(val);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const getGasBalance = async () => {
    const gasbalance = await getEthBalance(address);
    setEthBalance(weiToEth(gasbalance));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getGasBalance();
    // You can add more data fetching here if needed
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUser();
    getGasBalance();
  }, [contract, address]);
  useEffect(() => {
    getGasBalance();
  }, [user]);

  // console.log(ethbalance);
  // console.log(user);

  // Animate glow effect
  useEffect(() => {
    const glowSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowSequence.start();

    return () => glowSequence.stop();
  }, []);

  // Simulate recent rewards
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const rewards = [12.5, 8.3, 15.7, 6.2, 23.1];
  //     const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
  //     setRecentReward(randomReward);

  //     // Animate reward popup
  //     Animated.sequence([
  //       Animated.timing(rewardAnimation, {
  //         toValue: 1,
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //       Animated.delay(2500),
  //       Animated.timing(rewardAnimation, {
  //         toValue: 0,
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //     ]).start(() => setRecentReward(null));

  //     // Pulse effect
  //     Animated.sequence([
  //       Animated.timing(pulseAnimation, {
  //         toValue: 1.05,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(pulseAnimation, {
  //         toValue: 1,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }, 8000);

  //   return () => clearInterval(interval);
  // }, []);

  const menuItems = [
    // {
    //   icon: "👥",
    //   title: "Invite Friends",
    //   subtitle: "Earn 50 $ZURI per referral",
    //   color: "#1f87fc",
    // },
    // {
    //   icon: "👑",
    //   title: "Upgrade to Premium",
    //   subtitle: "Unlock exclusive features",
    //   color: "#ffd700",
    //   badge: "PRO",
    // },
    // {
    //   icon: "⚙️",
    //   title: "App Settings",
    //   subtitle: "Notifications, language, theme",
    //   color: "#8b5cf6",
    // },
    // {
    //   icon: "❓",
    //   title: "Help & Support",
    //   subtitle: "FAQs and contact support",
    //   color: "#10b981",
    // },
    // {
    //   icon: "📄",
    //   title: "Whitepaper / Tokenomics",
    //   subtitle: "Learn about $ZURI economics",
    //   color: "#f59e0b",
    // },
    {
      icon: "✖️",
      title: "Follow us on X",
      subtitle: "follow us on X",
      color: "#ef4444",
    },
    {
      icon: "👾",
      title: "Join Discord",
      subtitle: "Join our Discord Community",
      color: "#06b6d4",
    },
    {
      icon: "🚪↩️",
      title: "Log Out",
      subtitle: "Log out of stark zuri",
      color: "#ef4444",
    },
  ];

  const handleWithdraw = () => {
    Alert.alert(
      "Withdraw $ZURI",
      "Your tokens will be sent to your connected wallet. This may take a few minutes.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => console.log("Withdrawal initiated") },
      ]
    );
  };

  const handleLogOut = async () => {
    console.log("logging out");
    await AsyncStorage.multiRemove(["privateKey", "accountAddress"]);

    return router.replace("/login");
  };
  const handleReportBug = () => {};

  const handleMenuItemPress = (title) => {
    console.log(title);
    switch (title) {
      case "Log Out":
        handleLogOut();
        break;
      case "Report Bug / Feedback":
        handleReportBug();
        break;
    }
  };

  const glowColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(31, 135, 252, 0.1)", "rgba(31, 135, 252, 0.3)"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1f87fc"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
          <Text style={styles.headerSubtitle}>
            Manage your Stark Zuri experience
          </Text>
        </View>

        {/* Wallet Balance Section */}
        <Animated.View
          style={[
            styles.walletContainer,
            { transform: [{ scale: pulseAnimation }] },
          ]}
        >
          <Animated.View
            style={[styles.walletCard, { shadowColor: glowColor }]}
          >
            {/* Recent Reward Popup */}
            {recentReward && (
              <Animated.View
                style={[
                  styles.rewardPopup,
                  {
                    opacity: rewardAnimation,
                    transform: [
                      {
                        translateY: rewardAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.rewardText}>+{recentReward} $ZURI</Text>
                <Text style={styles.rewardSubtext}>Content reward!</Text>
              </Animated.View>
            )}

            <View style={styles.walletHeader}>
              <IconWrapper color="#1f87fc" size={20}>
                💰
              </IconWrapper>
              <Text style={styles.walletTitle}>Wallet Balance</Text>
            </View>

            <Text style={styles.balanceAmount}>
              {user?.zuri_points?.toLocaleString()} ZURI
            </Text>
            <Text style={styles.balanceUsd}>
              ≈ ${(user?.zuri_points?.toString() * 0.01).toFixed(2)} USD
            </Text>

            <View style={styles.earningsContainer}>
              <View style={styles.earningsItem}>
                <Text style={styles.earningsLabel}>Eth Balance</Text>
                <Text style={styles.earningsAmount}>
                  {ethbalance.toString()} ETH
                </Text>
              </View>
              <View style={styles.earningsItem}>
                <Text style={styles.earningsLabel}>This Week</Text>
                <Text style={styles.earningsAmount}>
                  {user?.zuri_points?.toLocaleString()} $ZURI
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdraw}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
              <Text style={styles.withdrawIcon}>↗</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.title)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <IconWrapper color={item.color}>{item.icon}</IconWrapper>
                <View style={styles.menuItemText}>
                  <View style={styles.menuItemTitleRow}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Stark Zuri v1.2.0</Text>
          <Text style={styles.footerSubtext}>Built on Starknet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
  },
  walletContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#333333",
    position: "relative",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rewardPopup: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: "#1f87fc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  rewardText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  rewardSubtext: {
    color: "#ffffff",
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 12,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },
  earningsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  earningsItem: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f87fc",
  },
  withdrawButton: {
    backgroundColor: "#1f87fc",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  withdrawButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  withdrawIcon: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  menuContainer: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  badge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  chevron: {
    fontSize: 20,
    color: "#666666",
    fontWeight: "300",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#444444",
  },
});

export default StarkZuriMoreTab;
