import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "./Sidebar.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

type Props = {
  visible: boolean;
  onClose: () => void;
};

type NavItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
};

// Only items NOT already covered by the bottom tab bar
// (Home, Vendors, Bookings, Budget, Profile live in the tab bar — no need to duplicate here)
const NAV_ITEMS: NavItem[] = [
  { icon: "check-circle-outline", label: "Wedding Planner", route: "Checklist" },
  { icon: "chat-bubble-outline", label: "Messages", route: "Messages" },
  { icon: "notifications-none", label: "Notifications", route: "Notifications" },
  { icon: "settings", label: "Settings", route: "Settings" },
  { icon: "help-outline", label: "Help & Support", route: "HelpSupport" },
];

// Legal/info links — separated visually from the main nav list
// Legal/info links — separated visually from the main nav list
const INFO_ITEMS: NavItem[] = [
  { icon: "info-outline", label: "About Us", route: "AboutUs" },
  { icon: "privacy-tip", label: "Privacy Policy", route: "PrivacyPolicy" },
  { icon: "description", label: "Terms & Conditions", route: "TermsConditions" },
  { icon: "assignment-return", label: "Refund Policy", route: "RefundPolicy" },
];

export function Sidebar({ visible, onClose }: Props) {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleNavigate = (item: NavItem) => {
    onClose();
    // TODO: each of these routes needs to actually exist in your navigator.
    // Settings, HelpSupport, AboutUs, PrivacyPolicy, TermsOfService are likely
    // NEW screens you haven't built yet — create them or this will throw
    // the same "not a valid name" error we saw earlier.
    navigation.navigate(item.route);
  };

  const handleLogout = async () => {
    try {
      onClose();
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const displayName = user?.name || "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX }] }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Gradient header — matches HomeScreen hero card theme */}
          <LinearGradient
            colors={["#fffef7", "#ffe6eb", "#ff8fa1", "#ff4d6d"]}
            locations={[0, 0.28, 0.68, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.userHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Menu</Text>
            <View style={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.navItem}
                  onPress={() => handleNavigate(item)}
                >
                  <View style={styles.navIconCircle}>
                    <MaterialIcons name={item.icon} size={19} color="#FF4D6D" />
                  </View>
                  <Text style={styles.navItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Legal</Text>
            <View style={styles.infoList}>
              {INFO_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.infoItem}
                  onPress={() => handleNavigate(item)}
                >
                  <View style={styles.infoIconCircle}>
                    <MaterialIcons name={item.icon} size={15} color="#8D6171" />
                  </View>
                  <Text style={styles.infoItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} color="#E63B5F" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}