import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { CustomerMembership } from "../../types/user";
import { MembershipCheckoutModal } from "../auth/MembershipCheckoutModal";
import { verifyCustomerPremiumUpgrade } from "../../api/payment.api";
import { RazorpaySuccess } from "../../types/payment";

export default function UpgradeMembershipScreen() {
  const navigation = useNavigation<any>();
  const { user, login, token } = useAuthStore();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const isPremium = user?.membership === CustomerMembership.PREMIUM;

  const handlePaymentSuccess = async (payment: RazorpaySuccess) => {
    try {
      const res = await verifyCustomerPremiumUpgrade(payment);
        if (res.user && token) {
          await login(token, res.user);
        }
        setCheckoutModalVisible(false);
        Alert.alert(
          "Upgrade Successful 🎉",
          "Congratulations! You are now a Premium Member. Enjoy full access to dedicated wedding planning!",
          [
            {
              text: "Plan My Wedding",
              onPress: () => navigation.replace("PlanMyWedding"),
            },
          ]
        );
    } catch (error: any) {
      Alert.alert(
        "Verification Error",
        error?.response?.data?.message || "Failed to verify payment."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color="#3F1D2F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Plan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.crownCircle}>
            <MaterialIcons name="workspace-premium" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>
            {isPremium ? "You are a VIP Premium Member" : "Upgrade to Premium Membership"}
          </Text>
          <Text style={styles.heroSub}>
            {isPremium
              ? "Enjoy dedicated wedding planners, consolidated quotations, and VIP priority."
              : "Get a dedicated Barati Gharati wedding planner to handle venues, vendors, and single quotations."}
          </Text>
        </View>

        {/* Status or Pricing Card */}
        {isPremium ? (
          <View style={styles.activeCard}>
            <MaterialIcons name="check-circle" size={24} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.activeTitle}>Active Premium Plan</Text>
              <Text style={styles.activeDesc}>Full concierge access active on your account</Text>
            </View>
          </View>
        ) : (
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingLabel}>ONE-TIME PAYMENT</Text>
              <Text style={styles.priceText}>
                ₹4,999 <Text style={styles.priceSub}>/ lifetime</Text>
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Feature List */}
            <View style={styles.featureList}>
              {[
                "Dedicated Barati Gharati planning team",
                "Personalized venue and vendor shortlisting",
                "One consolidated wedding quotation",
                "End-to-end booking coordination & VIP priority",
              ].map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <MaterialIcons name="check-circle" size={20} color="#FF4D6D" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => setCheckoutModalVisible(true)}
            >
              <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
              <Text style={styles.upgradeBtnText}>Upgrade Now — ₹4,999</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Razorpay Checkout Modal */}
      <MembershipCheckoutModal
        visible={checkoutModalVisible}
        customerName={user?.name || ""}
        customerEmail={user?.email || ""}
        customerPhone={user?.phone || ""}
        onClose={() => setCheckoutModalVisible(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFDF0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FFCAD3",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3F1D2F",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: "#6C2D45",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  crownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF4D6D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: "#FFCAD3",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  activeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 16,
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#065F46",
  },
  activeDesc: {
    fontSize: 12,
    color: "#047857",
    marginTop: 2,
  },
  pricingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFCAD3",
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  pricingHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  pricingLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8D6171",
    letterSpacing: 1,
  },
  priceText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#3F1D2F",
    marginTop: 4,
  },
  priceSub: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8D6171",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  featureList: {
    marginVertical: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3F1D2F",
    marginLeft: 10,
    flex: 1,
  },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4D6D",
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 14,
  },
  upgradeBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },
});
