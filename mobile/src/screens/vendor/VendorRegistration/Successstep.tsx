import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { styles } from "./styles";

export default function SuccessStep() {
  const navigation = useNavigation<any>();
  const reset = useVendorRegistrationStore((state) => state.reset);

  const handleGoToLogin = () => {
    reset();
    // Assumes VendorRegistrationNavigator sits as a top-level screen in AppNavigator,
    // sibling of "Auth" — adjust getParent() depth if your nesting differs.
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: "Auth", params: { screen: "Login" } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.successContainer}>
        <View style={styles.successIconCircle}>
          <MaterialIcons name="check-circle" size={50} color="#22B07D" />
        </View>

        <Text style={styles.successTitle}>Registration Submitted!</Text>
        <Text style={styles.successText}>
          Thank you for registering as a vendor on <Text style={styles.successTextBold}>Barati Gharati</Text>.
        </Text>
        <Text style={styles.successText}>
          Your application has been submitted successfully and is currently{" "}
          <Text style={styles.successHighlight}>under review.</Text>
        </Text>
        <Text style={styles.successText}>
          Once approved, you can log in and start managing your business, bookings, and customers.
        </Text>

        <TouchableOpacity style={styles.goToLoginButton} onPress={handleGoToLogin}>
          <Text style={styles.goToLoginButtonText}>Go to Login</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}