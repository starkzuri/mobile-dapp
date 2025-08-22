import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { useAppContext } from "@/providers/AppProvider";
import Constants from "expo-constants";


interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Function to send token to backend with wallet address
const sendTokenToBackend = async (token: string, walletAddress: string) => {
  try {

    const { PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY } =
    Constants.expoConfig?.extra || {};
    
    const response = await fetch(`${PUBLIC_SUPABASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}` || '',
      },
      body: JSON.stringify({
        pushToken: token,
        walletAddress: walletAddress, // Use wallet address as unique ID
        userId: walletAddress, // Also store as userId for queries
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register push token');
    }

    console.log(`✅ Push token registered for wallet: ${walletAddress.substring(0, 10)}...`);
  } catch (error) {
    console.error('❌ Failed to register push token:', error);
  }
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Get wallet address from Web3 context
  const { address, isReady } = useAppContext();

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  console.log("reaching for ready",isReady)

  // Register push token when wallet is ready and connected
  useEffect(() => {
    if (!isReady) return; // Wait for Web3 to initialize

    const registerPushToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        
        if (token) {
          setExpoPushToken(token);
          
          // Only send to backend if we have a wallet address
          if (address) {
            await sendTokenToBackend(token, address);
          } else {
            console.log('📱 Push token ready, waiting for wallet connection...');
          }
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    registerPushToken();
  }, [isReady]); // Run when Web3 is ready

  // Register token with backend when wallet connects
  useEffect(() => {
    if (expoPushToken && address) {
      sendTokenToBackend(expoPushToken, address);
    }
  }, [address, expoPushToken]); // Run when wallet address changes

  // Set up notification listeners
  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2)
        );
        // Handle the notification response here
        // You could navigate to specific screens based on notification data
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};