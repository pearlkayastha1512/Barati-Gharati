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

export default function SplashScreen({ navigation }: any) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  const run = async () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    // ⏱ splash delay (5 seconds example)
    await new Promise(resolve => setTimeout(resolve, 10000));

    navigation.replace("Onboarding");
  };

  run();
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