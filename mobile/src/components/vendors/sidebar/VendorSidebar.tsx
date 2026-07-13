import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./VendorSidebar.styles";
import ContactSupportModal from "../ContactSupportModal";

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
// (Dashboard, Bookings, Services, Messages, Profile live in the tab bar — no need to duplicate here)
const NAV_ITEMS: NavItem[] = [
  { icon: "collections", label: "Portfolio", route: "Portfolio" },
  { icon: "star-border", label: "Reviews", route: "Reviews" },
  { icon: "calendar-month", label: "Calendar", route: "VendorCalendar" },
  { icon: "account-balance-wallet", label: "Earnings", route: "Earnings" },
  { icon: "bar-chart", label: "Analytics", route: "Analytics" },
  { icon: "settings", label: "Settings", route: "Settings" },
];

export function VendorSidebar({ visible, onClose }: Props) {
  const navigation = useNavigation<any>();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [supportVisible,setSupportVisible] = React.useState(false);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleNavigate = (item: NavItem) => {
    onClose();
    // TODO: each of these routes needs to actually exist in VendorNavigator.
    // Portfolio, Reviews, VendorCalendar, Earnings, Analytics, Settings are
    // NEW screens — create them or this will throw the same
    // "not a valid name" error we saw earlier with the couple side.
    navigation.navigate(item.route);
  };

  const handleLogout = () => {
    onClose();
    // TODO: clear authStore once real auth is wired
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX }] }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.logoText}>Barati Gharati</Text>
            <Text style={styles.sectionLabel}>BUSINESS</Text>
          </View>

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
          </View>

          <View style={styles.supportBox}>
            <Text style={styles.supportTitle}>Vendor Support</Text>
            <Text style={styles.supportSubtitle}>Need help managing your business?</Text>
            <TouchableOpacity
  style={styles.supportButton}
  onPress={() => setSupportVisible(true)}
>
  <Text style={styles.supportButtonText}>
    Contact Support
  </Text>
</TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#C2185B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
      <ContactSupportModal
  visible={supportVisible}
  onClose={()=>setSupportVisible(false)}
/>
    </Modal>
  );
}