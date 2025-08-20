
import "dotenv/config";
export default {
  expo: {
    name: "starkzuri",
    slug: "starkzuri",
    version: "1.0.0",
    extra: {
      PUBLIC_CHAIN_ID: process.env.PUBLIC_CHAIN_ID,
      ARGENT_WEBWALLET_URL: process.env.ARGENT_WEBWALLET_URL,
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "413c273d-a0ea-4a19-9809-da0c328fec12",
      },
    },
    ios: {
      bundleIdentifier: "com.kagwep.starkzuri",
    },
    plugins: ["expo-localization"],
    orientation: "portrait",
    icon: "./assets/images/ST4.png",
    scheme: "starkzuri",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.kagwep.starkzuri",
      adaptiveIcon: {
        foregroundImage: "./assets/images/ST4.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      googleServicesFile:"./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/ST4.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification_icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
        }
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/ST4.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#0a0a0a",
        },
      ],
      
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: "kagwep",
  },
};
