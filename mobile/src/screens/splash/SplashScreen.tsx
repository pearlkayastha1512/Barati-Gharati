import { View, Text, Image, StyleSheet } from "react-native";
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

      <Image
        source={require("../../../assets/Barati Gharati Logo new.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Wedding Planner</Text>

      <Text style={styles.subtitle}>
        Plan Your Dream Wedding
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#C2185B",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});