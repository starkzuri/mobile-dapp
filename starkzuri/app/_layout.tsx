// import { Stack } from "expo-router";
// import { AppProvider } from "@/providers/AppProvider";
// import { StatusBar } from "expo-status-bar";
// import { useFonts } from "expo-font";

// export default function RootLayout() {
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   if (!loaded) return null;

//   return (
//     <AppProvider>
//       <Stack>
//         {/* Do NOT include `(tabs)` here as a screen */}
//         {/* Instead, modal screens go here */}
//         <Stack.Screen
//           name="modals/single_post"
//           options={{
//             presentation: "modal",
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="+not-found"
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack>
//       <StatusBar style="auto" />
//     </AppProvider>
//   );
// }

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/providers/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modals/single_post"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="modals/PostComponent"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </AppProvider>
  );
}
