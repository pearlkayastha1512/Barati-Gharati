import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { adminGradient, adminTheme } from "../../constants/adminTheme";
import { useAdminStore } from "../../store/adminStore";
import { useAuthStore } from "../../store/authStore";
import { getChatModerationUsers } from "../../api/admin.api";
import { getAdminRoleLabel, hasAdminPermission } from "../../utils/adminAccess";

const modules = [
  {
    title: "Customer Management",
    desc: "Search customers, verify account details and manage access.",
    icon: "people-outline",
    route: "CustomerManagement",
    permission: "customers.view",
  },
  {
    title: "Vendor Management",
    desc: "Review registrations and approve or reject vendors.",
    icon: "storefront-outline",
    route: "VendorManagement",
    permission: "vendors.view",
  },
  {
    title: "Chat Moderation",
    desc: "Review warnings and keep platform conversations safe.",
    icon: "shield-checkmark-outline",
    route: "ChatModeration",
    permission: "chat.view",
  },
];

export default function DashboardScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const { dashboard, isDashboardLoading, dashboardError, loadDashboard } = useAdminStore();
  const [moderationCount, setModerationCount] = useState(0);

  const canViewChat = hasAdminPermission(user, "chat.view");
  const visibleModules = useMemo(
    () => modules.filter((item) => hasAdminPermission(user, item.permission)),
    [user],
  );

  const load = async () => {
    await loadDashboard();
    if (canViewChat) {
      try {
        const response = await getChatModerationUsers();
        setModerationCount(response.count);
      } catch {
        setModerationCount(0);
      }
    }
  };

  useEffect(() => {
    void load();
  }, [canViewChat]);

  const stats = [
    { label: "Customers", value: dashboard.totalCustomers, icon: "people-outline" },
    { label: "Vendors", value: dashboard.totalVendors, icon: "storefront-outline" },
    {
      label: canViewChat ? "Moderation Queue" : "Pending Vendors",
      value: canViewChat ? moderationCount : dashboard.pendingVendorApprovals,
      icon: canViewChat ? "shield-outline" : "time-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isDashboardLoading} onRefresh={load} tintColor={adminTheme.primary} />
        }
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={25} color={adminTheme.ink} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{getAdminRoleLabel(user?.adminRole)}</Text>
            <Text style={styles.title}>Admin Dashboard</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || "A").charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <LinearGradient colors={adminGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color={adminTheme.ink} />
            <Text style={styles.heroBadgeText}>Focused mobile administration</Text>
          </View>
          <Text style={styles.heroTitle}>Welcome back,{"\n"}{user?.name || "Admin"}</Text>
          <Text style={styles.heroDescription}>
            Manage customers, vendors and platform chat safety from one secure place.
          </Text>
          <View style={styles.heroStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.heroStatusText}>Live platform data</Text>
          </View>
        </LinearGradient>

        {dashboardError ? (
          <TouchableOpacity style={styles.errorCard} onPress={load}>
            <Ionicons name="alert-circle-outline" size={20} color={adminTheme.danger} />
            <Text style={styles.errorText}>{dashboardError}</Text>
            <Text style={styles.retry}>Retry</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.sectionTitle}>Platform overview</Text>
        <Text style={styles.sectionSubtitle}>Updated directly from your database.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon as any} size={21} color={adminTheme.primaryDark} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Management tools</Text>
        <Text style={styles.sectionSubtitle}>Only your assigned modules are shown.</Text>
        <View style={styles.moduleList}>
          {visibleModules.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={styles.moduleCard}
              activeOpacity={0.82}
              onPress={() => navigation.navigate(item.route)}
            >
              <LinearGradient colors={index === 2 ? ["#FFE4EA", "#FFF7E3"] : ["#FFF0F3", "#FFFFFF"]} style={styles.moduleIcon}>
                <Ionicons name={item.icon as any} size={25} color={adminTheme.primaryDark} />
              </LinearGradient>
              <View style={styles.moduleCopy}>
                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleDescription}>{item.desc}</Text>
              </View>
              <View style={styles.moduleArrow}>
                <Ionicons name="arrow-forward" size={18} color={adminTheme.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: adminTheme.background },
  container: { flex: 1, backgroundColor: adminTheme.background },
  content: { padding: 18, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  menuButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: adminTheme.surface, borderWidth: 1, borderColor: adminTheme.border, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1, minWidth: 0, marginHorizontal: 12 },
  eyebrow: { color: adminTheme.primaryDark, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  title: { color: adminTheme.ink, fontSize: 22, lineHeight: 29, fontWeight: "900" },
  avatar: { width: 43, height: 43, borderRadius: 22, backgroundColor: adminTheme.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: adminTheme.white, fontSize: 17, fontWeight: "900" },
  hero: { borderRadius: 27, padding: 22, marginBottom: 24, shadowColor: adminTheme.shadow, shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 5 },
  heroBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.72)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  heroBadgeText: { marginLeft: 6, color: adminTheme.ink, fontSize: 11, fontWeight: "800" },
  heroTitle: { color: adminTheme.ink, fontSize: 29, lineHeight: 35, fontWeight: "900", marginTop: 18 },
  heroDescription: { color: "#633044", fontSize: 13, lineHeight: 20, fontWeight: "600", marginTop: 10 },
  heroStatus: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginTop: 17, backgroundColor: "rgba(255,255,255,0.64)", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 16 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: adminTheme.success, marginRight: 7 },
  heroStatusText: { color: adminTheme.ink, fontSize: 11, fontWeight: "800" },
  errorCard: { flexDirection: "row", alignItems: "center", padding: 13, borderRadius: 16, backgroundColor: adminTheme.dangerBg, borderWidth: 1, borderColor: "#FFC0CA", marginBottom: 20 },
  errorText: { flex: 1, color: adminTheme.danger, fontSize: 12, marginHorizontal: 8 },
  retry: { color: adminTheme.danger, fontWeight: "900", fontSize: 12 },
  sectionTitle: { color: adminTheme.ink, fontSize: 19, fontWeight: "900" },
  sectionSubtitle: { color: adminTheme.muted, fontSize: 12, marginTop: 2, marginBottom: 13 },
  statsRow: { paddingBottom: 25, paddingRight: 10 },
  statCard: { width: 132, minHeight: 135, backgroundColor: adminTheme.surface, borderWidth: 1, borderColor: adminTheme.border, borderRadius: 22, padding: 15, marginRight: 11 },
  statIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: adminTheme.blush, alignItems: "center", justifyContent: "center" },
  statValue: { color: adminTheme.ink, fontSize: 25, lineHeight: 32, fontWeight: "900", marginTop: 11 },
  statLabel: { color: adminTheme.muted, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  moduleList: { marginTop: 2 },
  moduleCard: { flexDirection: "row", alignItems: "center", backgroundColor: adminTheme.surface, borderWidth: 1, borderColor: adminTheme.border, borderRadius: 22, padding: 14, marginBottom: 12, shadowColor: adminTheme.shadow, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  moduleIcon: { width: 52, height: 52, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  moduleCopy: { flex: 1, minWidth: 0, marginHorizontal: 12 },
  moduleTitle: { color: adminTheme.ink, fontSize: 14, fontWeight: "900" },
  moduleDescription: { color: adminTheme.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  moduleArrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: adminTheme.blush, alignItems: "center", justifyContent: "center" },
});
