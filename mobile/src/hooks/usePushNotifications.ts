import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { registerPushToken } from "../api/notification.api";
import { useNotificationsStore } from "../store/notificationsStore";

// Expo SDK 53+ removed remote push notifications from Expo Go on Android.
const isExpoGo = Constants.appOwnership === "expo";

try {
  if (!isExpoGo) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (e) {
  console.warn("Notifications.setNotificationHandler not supported in Expo Go:", e);
}

let cachedExpoPushToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export function usePushNotifications() {
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  useEffect(() => {
    if (isExpoGo) {
      console.warn("Push notifications are not supported in Expo Go (SDK 53+). Use a development build for push notifications.");
      return;
    }

    try {
      tokenPromise = registerForPushNotificationsAsync().then((token) => {
        if (token) cachedExpoPushToken = token;
        return token;
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(() => {
        useNotificationsStore.getState().fetchNotifications();
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
        useNotificationsStore.getState().fetchNotifications();
      });
    } catch (err) {
      console.warn("Notification listener setup error:", err);
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}

export async function syncPushTokenWithBackend() {
  if (isExpoGo) return;

  try {
    let token = cachedExpoPushToken;

    if (!token && tokenPromise) {
      token = await tokenPromise;
    }

    if (!token) return;

    await registerPushToken(token);
  } catch (err) {
    console.log("REGISTER PUSH TOKEN ERROR =>", err);
  }
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isExpoGo) return null;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!Device.isDevice) {
      console.log("Push notifications sirf physical device pe kaam karti hain");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch (error) {
    console.warn("registerForPushNotificationsAsync failed:", error);
    return null;
  }
}