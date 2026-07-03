import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../../store/authStore";
import { useAppStore } from "../../store/appStore";
export default function SplashScreen() {
  const navigation = useNavigation<any>();

const { restoreSession, isAuthenticated, user } = useAuthStore();
const { isFirstLaunch } = useAppStore();
useEffect(() => {
  const checkApp = async () => {
    await restoreSession();

    setTimeout(() => {
      if (isFirstLaunch) {
        navigation.replace("Onboarding");
      } else if (!isAuthenticated) {
        navigation.replace("Auth");
      } else if (user?.role === "VENDOR") {
        navigation.replace("Vendor");
      } else {
        navigation.replace("Couple");
      }
    }, 2000);
  };

  checkApp();
}, []);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.Image
        source={require("../../../assets/Barati Gharati Logo new.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      />

      <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
        Plan Your Dream Wedding
      </Animated.Text>

      <View style={styles.divider} />

      <ActivityIndicator size="large" color="#C2185B" />

      <Animated.Text style={[styles.loading, { opacity: textOpacity }]}>
        Loading...
      </Animated.Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  logo: {
    width: 280,
    height: 180,
    resizeMode: "contain",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 18,
    color: "#C2185B",
    fontWeight: "500",
  },

  divider: {
    marginTop: 18,
    width: 180,
    height: 2,
    backgroundColor: "#F3A6C7",
    borderRadius: 10,
  },

  loading: {
    marginTop: 15,
    fontSize: 16,
    color: "#C2185B",
  },
});