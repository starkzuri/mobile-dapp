import "dotenv/config";
export default {
  expo: {
    name: "starkzuri",
    slug: "starkzuri",
    version: "1.0.0",
    extra: {
      PUBLIC_CHAIN_ID: process.env.PUBLIC_CHAIN_ID,
      ARGENT_WEBWALLET_URL: process.env.ARGENT_WEBWALLET_URL,
      eas: {
        projectId: "c8a62244-ddce-4c68-9e8b-7295f13c67af",
      },
    },
    orientation: "portrait",
    icon: "./assets/images/ST4.png",
    scheme: "starkzuri",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.felix.starkzuri",
      adaptiveIcon: {
        foregroundImage: "./assets/images/ST4.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/ST4.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/ST4.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: "felabs",
  },
};
