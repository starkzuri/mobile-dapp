import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/more";

const StarkZuriMorePage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);

  // Mock wallet data
  const walletData = {
    balance: "2,847.5",
    pendingTips: "124.8",
    currency: "SZ",
  };

  const handleWithdraw = () => {
    Alert.alert(
      "Withdraw Tips",
      `Withdraw ${walletData.pendingTips} SZ to your external wallet?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Withdraw", onPress: () => console.log("Withdrawing...") },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logging out..."),
      },
    ]);
  };

  const handleFeedback = (type: any) => {
    Alert.alert(
      type === "bug" ? "Report Bug" : "Contact Support",
      type === "bug"
        ? "Please describe the bug you encountered. We'll investigate and fix it as soon as possible."
        : "How can we help you? Our support team will get back to you within 24 hours.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => console.log(`Opening ${type} form...`),
        },
      ]
    );
  };

  const MenuSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    iconColor = "#9CA3AF",
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      )}
    </TouchableOpacity>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    iconColor = "#9CA3AF",
  }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#374151", true: "#1f87fc40" }}
        thumbColor={value ? "#1f87fc" : "#9CA3AF"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>More</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Section */}
        <MenuSection title="Wallet">
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={24} color="#1f87fc" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletBalance}>
                  {walletData.balance} {walletData.currency}
                </Text>
                <Text style={styles.walletLabel}>Total Balance</Text>
              </View>
            </View>

            <View style={styles.walletStats}>
              <View style={styles.walletStat}>
                <Text style={styles.walletStatValue}>
                  {walletData.pendingTips} {walletData.currency}
                </Text>
                <Text style={styles.walletStatLabel}>Pending Tips</Text>
              </View>
              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={handleWithdraw}
              >
                <Ionicons name="arrow-up" size={16} color="#fff" />
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          <MenuItem
            icon="card"
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={() => console.log("Payment methods")}
            iconColor="#10B981"
          />
          <MenuItem
            icon="time"
            title="Transaction History"
            subtitle="View all your transactions"
            onPress={() => console.log("Transaction history")}
            iconColor="#8B5CF6"
          />
        </MenuSection>

        {/* Theme Section */}
        <MenuSection title="Appearance">
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Toggle between light and dark theme"
            value={darkMode}
            onValueChange={setDarkMode}
            iconColor="#F59E0B"
          />
        </MenuSection>

        {/* Notifications Section */}
        <MenuSection title="Notifications">
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={pushNotifications}
            onValueChange={setPushNotifications}
            iconColor="#EF4444"
          />
          <SettingItem
            icon="mail"
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            iconColor="#3B82F6"
          />
          <MenuItem
            icon="settings"
            title="Notification Preferences"
            subtitle="Customize what notifications you receive"
            onPress={() => console.log("Notification preferences")}
            iconColor="#8B5CF6"
          />
        </MenuSection>

        {/* Privacy Section */}
        <MenuSection title="Privacy & Security">
          <SettingItem
            icon="eye"
            title="Profile Visibility"
            subtitle="Make your profile visible to others"
            value={profileVisibility}
            onValueChange={setProfileVisibility}
            iconColor="#06B6D4"
          />
          <SettingItem
            icon="radio-button-on"
            title="Activity Status"
            subtitle="Show when you're active"
            value={activityStatus}
            onValueChange={setActivityStatus}
            iconColor="#10B981"
          />
          <MenuItem
            icon="shield-checkmark"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            onPress={() => console.log("2FA settings")}
            iconColor="#F59E0B"
          />
          <MenuItem
            icon="lock-closed"
            title="Privacy Settings"
            subtitle="Control who can see your content"
            onPress={() => console.log("Privacy settings")}
            iconColor="#8B5CF6"
          />
        </MenuSection>

        {/* Support Section */}
        <MenuSection title="Feedback & Support">
          <MenuItem
            icon="bug"
            title="Report a Bug"
            subtitle="Help us improve by reporting issues"
            onPress={() => handleFeedback("bug")}
            iconColor="#EF4444"
          />
          <MenuItem
            icon="chatbubbles"
            title="Contact Support"
            subtitle="Get help from our support team"
            onPress={() => handleFeedback("support")}
            iconColor="#3B82F6"
          />
          <MenuItem
            icon="star"
            title="Rate the App"
            subtitle="Share your experience with others"
            onPress={() => console.log("Rate app")}
            iconColor="#F59E0B"
          />
          <MenuItem
            icon="bulb"
            title="Feature Request"
            subtitle="Suggest new features"
            onPress={() => console.log("Feature request")}
            iconColor="#8B5CF6"
          />
        </MenuSection>

        {/* Legal Section */}
        <MenuSection title="Legal">
          <MenuItem
            icon="document-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => console.log("Terms of service")}
            iconColor="#6B7280"
          />
          <MenuItem
            icon="shield"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => console.log("Privacy policy")}
            iconColor="#6B7280"
          />
          <MenuItem
            icon="information-circle"
            title="About Stark Zuri"
            subtitle="Learn more about our platform"
            onPress={() => console.log("About")}
            iconColor="#6B7280"
          />
        </MenuSection>

        {/* Account Section */}
        <MenuSection title="Account">
          <MenuItem
            icon="log-out"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            iconColor="#EF4444"
          />
        </MenuSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Stark Zuri v1.2.0</Text>
          <Text style={styles.copyright}>
            © 2025 Stark Zuri. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StarkZuriMorePage;
