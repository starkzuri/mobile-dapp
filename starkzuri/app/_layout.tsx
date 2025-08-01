import { useEffect, useState } from "react";
import { Stack, Slot, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/providers/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider,useSafeAreaInsets } from 'react-native-safe-area-context';

function useIsSafeAreaReady() {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
   
  
  useEffect(() => {
    if (insets.top > 0 || insets.bottom >= 0) {
      setIsReady(true);
    } else {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [insets]);
  
  return isReady;
}

export default function RootLayout() {
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(false);
  const isSafeAreaReady = useIsSafeAreaReady();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const privateKey = await AsyncStorage.getItem("privateKey");
        const accountAddress = await AsyncStorage.getItem("accountAddress");

        if (privateKey && accountAddress) {
          router.replace("/"); // User is logged in
        } else {
          router.replace("/login"); // Not logged in
        }
      } catch (e) {
        router.replace("/login");
      } finally {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, [isSafeAreaReady]);

  if (!isSafeAreaReady || checkingLogin) {
    return (
      <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/single_post"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="modals/single_reel"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="modals/PostComponent"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <Toast />
      <StatusBar style="dark" />
    </AppProvider>
    </SafeAreaProvider>
  );
}
