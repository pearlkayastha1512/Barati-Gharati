import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../../store/authStore";
import { useVendorSettingsStore } from "../../store/vendorSettingsStore";
import { styles } from "./vendorSettingsStyles";
import { COLORS } from "../../constants/theme";

const GRADIENT_START = COLORS.gradientStart;
const GRADIENT_END = COLORS.gradientEnd;
export default function VendorSettingsScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const {
    businessVisibility,
    acceptNewBookings,
    displayPricingPublicly,
    availabilityCalendarVisible,
    newBookingNotifications,
    paymentAlerts,
    customerMessageAlerts,
    marketingEmails,
    isSavingAccount,
    isChangingPassword,
    toggleSetting,
    updateAccount,
    submitPasswordChange,
  } = useVendorSettingsStore();

  const [ownerName, setOwnerName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSaveAccount = async () => {
  // TODO: Call Update Account API here when backend is ready.
  // Example:
  // await updateVendorAccount({ ownerName, email, phone });

  const result = await updateAccount({ ownerName, email, phone });

  Alert.alert(
    result.success ? "Success" : "Error",
    result.success ? "Account updated successfully." : result.message
  );
};

  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    Alert.alert("Error", "Please fill in all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "New password and confirm password do not match.");
    return;
  }

  // TODO: Call Change Password API here when backend is ready.
  // Example:
  // await changePassword({ currentPassword, newPassword });

  const result = await submitPasswordChange(currentPassword, newPassword);

  Alert.alert(
    result.success ? "Success" : "Error",
    result.success ? "Password changed successfully." : result.message
  );

  if (result.success) {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={[GRADIENT_START, GRADIENT_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="cog-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Vendor Settings</Text>
          </View>
          <Text style={styles.heroTitle}>{user?.name ?? "Your Business"}</Text>
          <Text style={styles.heroSubtitle}>
            Manage your business preferences, notifications and security settings.
          </Text>
        </LinearGradient>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.sectionSubtitle}>Update your business and contact details.</Text>

          <TextInput
            style={styles.input}
            placeholder="Business / Owner Name"
            placeholderTextColor="#999"
            value={ownerName}
            onChangeText={setOwnerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
           style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
            onPress={handleSaveAccount}
            disabled={isSavingAccount}
          >
            <Text style={styles.primaryButtonText}>{isSavingAccount ? "Saving..." : "Save Account"}</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.sectionSubtitle}>Update your account password.</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#999"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
            onPress={handleChangePassword}
            disabled={isChangingPassword}
          >
            <Text style={styles.primaryButtonText}>{isChangingPassword ? "Changing..." : "Change Password"}</Text>
          </TouchableOpacity>
        </View>

        {/* Business Preferences — local-only, no backend fields exist for these yet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Preferences</Text>
          <Text style={styles.sectionSubtitle}>Control how your business appears to customers.</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Business Visibility</Text>
              <Text style={styles.toggleSubtext}>Show your business to customers.</Text>
            </View>
            <Switch value={businessVisibility} onValueChange={() => toggleSetting("businessVisibility")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Accept New Bookings</Text>
              <Text style={styles.toggleSubtext}>Allow customers to send new booking requests.</Text>
            </View>
            <Switch value={acceptNewBookings} onValueChange={() => toggleSetting("acceptNewBookings")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Display Pricing Publicly</Text>
              <Text style={styles.toggleSubtext}>Show service prices on your public profile.</Text>
            </View>
            <Switch value={displayPricingPublicly} onValueChange={() => toggleSetting("displayPricingPublicly")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Availability Calendar</Text>
              <Text style={styles.toggleSubtext}>Display your available dates to customers.</Text>
            </View>
            <Switch value={availabilityCalendarVisible} onValueChange={() => toggleSetting("availabilityCalendarVisible")} />
          </View>
        </View>

        {/* Notifications — local-only, no backend preference fields exist yet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionSubtitle}>Choose which notifications you want to receive.</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>New Booking Notifications</Text>
              <Text style={styles.toggleSubtext}>Receive alerts whenever a customer books your service.</Text>
            </View>
            <Switch value={newBookingNotifications} onValueChange={() => toggleSetting("newBookingNotifications")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Payment Alerts</Text>
              <Text style={styles.toggleSubtext}>Get notified whenever a payment is received.</Text>
            </View>
            <Switch value={paymentAlerts} onValueChange={() => toggleSetting("paymentAlerts")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Customer Messages</Text>
              <Text style={styles.toggleSubtext}>Receive notifications for new customer chats.</Text>
            </View>
            <Switch value={customerMessageAlerts} onValueChange={() => toggleSetting("customerMessageAlerts")} />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Marketing Emails</Text>
              <Text style={styles.toggleSubtext}>Receive promotional offers and platform updates.</Text>
            </View>
            <Switch value={marketingEmails} onValueChange={() => toggleSetting("marketingEmails")} />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Text style={styles.dangerText}>Deactivating your business hides it from customers. Existing bookings remain unaffected.</Text>

          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Business Status</Text>
              <Text style={styles.statusSubtext}>Customers can only book active businesses.</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Active</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() =>
              Alert.alert(
                "Not available yet",
                "Deactivating your business isn't connected to the backend yet."
              )
            }
          >
            <Text style={styles.dangerButtonText}>Deactivate Business</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}