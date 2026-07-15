import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import { adminGradient, adminTheme } from "../../constants/adminTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/authStore";
import {
  getAdminRoleLabel,
  hasAdminPermission,
} from "../../utils/adminAccess";

const navItems = [
  {
    name: "Overview",
    icon: "grid-outline",
    route: "Dashboard",
    permission: "dashboard.view",
  },
  {
    name: "Customers",
    icon: "people-outline",
    route: "CustomerManagement",
    permission: "customers.view",
  },
  {
    name: "Vendors",
    icon: "storefront-outline",
    route: "VendorManagement",
    permission: "vendors.view",
  },
  {
    name: "Chat Moderation",
    icon: "shield-checkmark-outline",
    route: "ChatModeration",
    permission: "chat.view",
  },
];

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const activeRoute = props.state.routeNames[props.state.index];
  const visibleItems = navItems.filter((item) =>
    hasAdminPermission(user, item.permission),
  );

  const handleLogout = async () => {
    await logout();
    const rootNavigation = props.navigation.getParent();
    rootNavigation?.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoBox}>
          <Image
            source={require("../../../assets/Barati Gharati Logo new.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.profileRow}>
          <LinearGradient colors={adminGradient} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || "A").charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName} numberOfLines={1}>
              {user?.name || "Administrator"}
            </Text>
            <Text style={styles.profileRole} numberOfLines={1}>
              {getAdminRoleLabel(user?.adminRole)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ADMIN TOOLS</Text>

        {visibleItems.map((item) => {
          const active = activeRoute === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.82}
              style={[styles.navItem, !active && styles.navItemIdle]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              {active ? (
                <LinearGradient colors={adminGradient} style={styles.activeFill}>
                  <Ionicons name={item.icon as any} size={21} color={adminTheme.ink} />
                  <Text style={[styles.navText, styles.navTextActive]}>{item.name}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={adminTheme.ink}
                    style={styles.chevron}
                  />
                </LinearGradient>
              ) : (
                <>
                  <View style={styles.idleIcon}>
                    <Ionicons name={item.icon as any} size={20} color={adminTheme.primaryDark} />
                  </View>
                  <Text style={styles.navText}>{item.name}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <View style={styles.securityCard}>
          <Ionicons name="lock-closed" size={18} color={adminTheme.primaryDark} />
          <View style={styles.securityCopy}>
            <Text style={styles.securityTitle}>Secure admin access</Text>
            <Text style={styles.securityText}>Only assigned modules are visible.</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={21} color={adminTheme.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminTheme.surface },
  scrollContent: { paddingTop: 8, paddingBottom: 24 },
  logoBox: {
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: adminTheme.border,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: adminTheme.white,
  },
  logoImage: { width: "100%", height: 104 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 18,
    padding: 13,
    borderRadius: 18,
    backgroundColor: adminTheme.blushSoft,
    borderWidth: 1,
    borderColor: adminTheme.border,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "900", color: adminTheme.ink },
  profileCopy: { flex: 1, minWidth: 0, marginLeft: 11 },
  profileName: { color: adminTheme.ink, fontSize: 14, fontWeight: "800" },
  profileRole: { color: adminTheme.muted, fontSize: 11, marginTop: 2 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.7,
    color: adminTheme.muted,
    marginHorizontal: 24,
    marginTop: 25,
    marginBottom: 9,
    fontWeight: "800",
  },
  navItem: { marginHorizontal: 12, marginVertical: 4, borderRadius: 17, overflow: "hidden" },
  navItemIdle: {
    minHeight: 55,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  activeFill: {
    minHeight: 55,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  idleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: adminTheme.blush,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { marginLeft: 12, fontSize: 14, color: adminTheme.ink, fontWeight: "700" },
  navTextActive: { fontWeight: "900" },
  chevron: { marginLeft: "auto" },
  footer: { paddingHorizontal: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: adminTheme.border },
  securityCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: adminTheme.blushSoft,
  },
  securityCopy: { flex: 1, marginLeft: 10 },
  securityTitle: { color: adminTheme.ink, fontSize: 12, fontWeight: "800" },
  securityText: { color: adminTheme.muted, fontSize: 10, marginTop: 2 },
  logoutRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingTop: 17 },
  logoutText: { color: adminTheme.danger, fontWeight: "800", marginLeft: 10 },
});
