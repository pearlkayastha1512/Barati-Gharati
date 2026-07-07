import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "./Sidebar.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

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
  { icon: "notifications-none", label: "Notifications", route: "Notifications" },
  { icon: "settings", label: "Settings", route: "Settings" },
  { icon: "help-outline", label: "Help & Support", route: "HelpSupport" },
];

// Legal/info links — separated visually from the main nav list
const INFO_ITEMS: NavItem[] = [
  { icon: "info-outline", label: "About Us", route: "AboutUs" },
  { icon: "privacy-tip", label: "Privacy Policy", route: "PrivacyPolicy" },
  { icon: "description", label: "Terms of Service", route: "TermsOfService" },
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
    onClose();
    await logout();
    // TODO: confirm this matches your actual auth stack's initial route name
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX }] }]}
          onStartShouldSetResponder={() => true}
        >
          {/* User info header */}
          <View style={styles.userHeader}>
            <Image
              // TODO: replace with user?.avatarUrl once available from getUserProfile()
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.name || "Guest"}</Text>
            <Text style={styles.userEmail}>{user?.email || ""}</Text>
          </View>

          {/* Secondary nav — items not already in the bottom tab bar */}
          <View style={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.navItem}
                onPress={() => handleNavigate(item)}
              >
                <MaterialIcons name={item.icon} size={22} color="#C2185B" />
                <Text style={styles.navItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            {/* Legal / info links */}
            {INFO_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.navItem}
                onPress={() => handleNavigate(item)}
              >
                <MaterialIcons name={item.icon} size={22} color="#999" />
                <Text style={styles.infoItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#C2185B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}