import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import { CustomerMembership } from "../../types/user";
import { SettingsHeroCard } from "../../components/users/setting/SettingsHeroCard";
import { AccountCard } from "../../components/users/setting/AccountCard";
import { ToggleRow } from "../../components/users/setting/ToggleRow";
import { EditProfileModal } from "../../components/users/setting/EditProfileModal";
import { DangerZone } from "../../components/users/setting/DangerZone";
import { SecurityToggleItem } from "../../components/users/setting/SecurityToggleItem";
import { styles } from "./styles/SettingsScreen.styles";
import { useRoute } from "@react-navigation/native";
import { ChangePasswordModal } from "../../components/users/setting/ChangePasswordModal";
// TODO: import API functions once backend is connected
// import { getUserSettings, updateUserProfile, updateNotificationPrefs, updatePrivacyPrefs, updateSecurityPrefs, deleteAccount } from "../../api/settings.api";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const { logout, user } = useAuthStore();
  const {
    profile,
    notifications,
    privacy,
    security,
    updateProfile,
    toggleNotification,
    togglePrivacy,
    fetchProfile,
    toggleSecurity,
  } = useSettingsStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  React.useEffect(() => {
  if (route.params?.openEditModal) {
    setEditModalVisible(true);
  }
}, [route.params?.openEditModal]);
useEffect(() => {
  fetchProfile();
}, []);

  // const handleLogout = async () => {

  //   await logout();
  //   navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  // };
 const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();

            navigation.reset({
              index: 0,
              routes: [{ name: "Auth" }],
            });
          } catch (error) {
            Alert.alert(
              "Error",
              "Unable to logout."
            );
          }
        },
      },
    ]
  );
};
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: call deleteAccount() API, then log out and reset navigation
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#3f1d2f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SettingsHeroCard />

        <AccountCard profile={profile} onEdit={() => setEditModalVisible(true)} />

        {/* Membership Banner Card */}
        <TouchableOpacity
          style={{
            backgroundColor: user?.membership === CustomerMembership.PREMIUM ? "#ECFDF5" : "#6C2D45",
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => navigation.navigate("UpgradeMembership")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <MaterialIcons
              name={user?.membership === CustomerMembership.PREMIUM ? "workspace-premium" : "auto-awesome"}
              size={28}
              color={user?.membership === CustomerMembership.PREMIUM ? "#10B981" : "#FF4D6D"}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: user?.membership === CustomerMembership.PREMIUM ? "#065F46" : "#FFFFFF",
                }}
              >
                {user?.membership === CustomerMembership.PREMIUM ? "VIP Premium Member" : "Upgrade to Premium"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: user?.membership === CustomerMembership.PREMIUM ? "#047857" : "#FFCAD3",
                  marginTop: 2,
                }}
              >
                {user?.membership === CustomerMembership.PREMIUM
                  ? "Full concierge & wedding planning active"
                  : "Get dedicated wedding planners & single quotes (₹4,999)"}
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={user?.membership === CustomerMembership.PREMIUM ? "#047857" : "#FFCAD3"}
          />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Notifications</Text>
          <View style={{ marginTop: 8 }}>
            <ToggleRow
              label="Email Notifications"
              value={notifications.emailNotifications}
              onToggle={() => toggleNotification("emailNotifications")}
            />
            <ToggleRow
              label="Booking Updates"
              value={notifications.bookingUpdates}
              onToggle={() => toggleNotification("bookingUpdates")}
            />
            <ToggleRow
              label="Vendor Messages"
              value={notifications.vendorMessages}
              onToggle={() => toggleNotification("vendorMessages")}
            />
            <ToggleRow
              label="Offers & Promotions"
              value={notifications.offersPromotions}
              onToggle={() => toggleNotification("offersPromotions")}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Privacy</Text>
          <View style={{ marginTop: 8 }}>
            <ToggleRow
              label="Public Profile"
              value={privacy.publicProfile}
              onToggle={() => togglePrivacy("publicProfile")}
            />
            <ToggleRow
              label="Activity Status"
              value={privacy.activityStatus}
              onToggle={() => togglePrivacy("activityStatus")}
            />
            <ToggleRow
              label="Share Wedding Progress"
              value={privacy.shareWeddingProgress}
              onToggle={() => togglePrivacy("shareWeddingProgress")}
            />
            <ToggleRow
              label="Marketing Emails"
              value={privacy.marketingEmails}
              onToggle={() => togglePrivacy("marketingEmails")}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Security</Text>

          <View style={{ marginTop: 10 }}>
            <SecurityToggleItem
              icon="verified-user"
              title="Two-Factor Authentication"
              description="Protect your account with an additional verification step."
              value={security.twoFactorAuth}
              onToggle={() => toggleSecurity("twoFactorAuth")}
            />
            <SecurityToggleItem
              icon="notifications-none"
              title="Login Alerts"
              description="Receive notifications whenever someone logs into your account."
              value={security.loginAlerts}
              onToggle={() => toggleSecurity("loginAlerts")}
            />
            <TouchableOpacity
              style={styles.securityItem}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.securityIconCircle}>
                <MaterialIcons name="lock-outline" size={18} color="#ff4d6d" />
              </View>
              <View style={styles.securityCopy}>
                <Text style={styles.securityTitle}>Change Password</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ff8fa1" />
            </TouchableOpacity>
          </View>
        </View>

        <DangerZone onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
        onSave={updateProfile}
      />

      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    
    </SafeAreaView>
  );
}
