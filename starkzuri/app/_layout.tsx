import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppProvider } from "@/providers/AppProvider";

export default function Layout() {
  return (
    <AppProvider>
      <Tabs
        initialRouteName="index" // optional but recommended
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#1f87fc",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: {
            backgroundColor: "#121212",
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 5,
          },
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

            if (route.name === "index") iconName = "home-outline";
            else if (route.name === "notifications")
              iconName = "notifications-outline";
            else if (route.name === "reels") iconName = "play-circle-outline";
            else if (route.name === "profile") iconName = "person-outline";
            else if (route.name === "more")
              iconName = "ellipsis-horizontal-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        })}
      >
        {/* Define tabs explicitly and in the order you want */}
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen
          name="notifications"
          options={{ title: "Notifications" }}
        />
        <Tabs.Screen name="reels" options={{ title: "Reels" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="more" options={{ title: "More" }} />
      </Tabs>
    </AppProvider>
  );
}
