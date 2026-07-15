import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./VendorSidebar.styles";
import ContactSupportModal from "../ContactSupportModal";
import Logo from "../../../../assets/Barati_Gharati_Logo-removebg-preview.png";
import { SPACING } from "../../../constants/theme";

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
  { icon: "workspace-premium", label: "Upgrade Plan", route: "UpgradePlan" },
];

// Legal/info links — same screens used on the couple side, registered
// separately in VendorNavigator so they work from this stack too.
const INFO_ITEMS: NavItem[] = [
  { icon: "info-outline", label: "About Us", route: "AboutUs" },
  { icon: "privacy-tip", label: "Privacy Policy", route: "PrivacyPolicy" },
  { icon: "description", label: "Terms & Conditions", route: "TermsConditions" },
  { icon: "assignment-return", label: "Refund Policy", route: "RefundPolicy" },
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
            <Image
              source={Logo}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>
              BUSINESS
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
          >
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

            <View style={{ paddingHorizontal: SPACING.xl }}>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>LEGAL</Text>
            </View>

            <View style={styles.navList}>
              {INFO_ITEMS.map((item) => (
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
          </ScrollView>

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