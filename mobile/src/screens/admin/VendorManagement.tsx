import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatCard from "../../components/admin/StatCard";
import { adminGradient, adminTheme } from "../../constants/adminTheme";
import {
  approveAdminVendor,
  getAdminVendors,
  rejectAdminVendor,
} from "../../api/admin.api";
import type { AdminVendor, VendorApprovalStatus } from "../../types/admin";
import { useAuthStore } from "../../store/authStore";
import { hasAdminPermission } from "../../utils/adminAccess";

const statusConfig: Record<VendorApprovalStatus, { label: string; color: string; background: string }> = {
  approved: { label: "Approved", color: adminTheme.success, background: adminTheme.successBg },
  pending: { label: "Pending", color: adminTheme.warning, background: adminTheme.warningBg },
  rejected: { label: "Rejected", color: adminTheme.danger, background: adminTheme.dangerBg },
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Backend server se connect nahi ho pa raha hai.";
  }
  return "Vendors load nahi ho sake.";
};

export default function VendorManagement({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const canManage = hasAdminPermission(user, "vendors.manage");
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | VendorApprovalStatus>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadVendors = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const response = await getAdminVendors();
      setVendors(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadVendors(); }, [loadVendors]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vendors.filter((vendor) => {
      const matchesStatus = selectedStatus === "all" || vendor.approvalStatus === selectedStatus;
      const matchesSearch = !term || [vendor.businessName, vendor.ownerName, vendor.city, vendor.category].some((value) => value.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [search, selectedStatus, vendors]);

  const runStatusAction = async (vendor: AdminVendor, nextStatus: "approved" | "rejected") => {
    setActionId(vendor.id);
    try {
      if (nextStatus === "approved") await approveAdminVendor(vendor.id);
      else await rejectAdminVendor(vendor.id);
      setVendors((current) => current.map((item) => item.id === vendor.id ? { ...item, approvalStatus: nextStatus } : item));
    } catch (actionError) {
      Alert.alert("Action failed", getErrorMessage(actionError));
    } finally {
      setActionId(null);
    }
  };

  const confirmReject = (vendor: AdminVendor) => {
    Alert.alert("Reject vendor?", `${vendor.businessName} ki registration reject karni hai?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => void runStatusAction(vendor, "rejected") },
    ]);
  };

  const filters: Array<{ key: "all" | VendorApprovalStatus; label: string }> = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadVendors(true)} tintColor={adminTheme.primary} />}
      >
        <AdminPageHeader navigation={navigation} title="Vendors" subtitle="Vendor Management" icon="storefront-outline" />

        <LinearGradient colors={adminGradient} style={styles.hero}>
          <View style={styles.heroBadge}><Ionicons name="shield-checkmark" size={15} color={adminTheme.ink} /><Text style={styles.heroBadgeText}>Trusted marketplace</Text></View>
          <Text style={styles.heroTitle}>Build a trusted vendor network.</Text>
          <Text style={styles.heroText}>Review live registrations and manage approval status from your phone.</Text>
        </LinearGradient>

        <View style={styles.statGrid}>
          <StatCard icon="storefront-outline" iconColor={adminTheme.primaryDark} iconBg={adminTheme.blush} label="Total Vendors" value={vendors.length} />
          <StatCard icon="time-outline" iconColor={adminTheme.warning} iconBg={adminTheme.warningBg} label="Pending" value={vendors.filter((item) => item.approvalStatus === "pending").length} />
          <StatCard icon="checkmark-circle-outline" iconColor={adminTheme.success} iconBg={adminTheme.successBg} label="Approved" value={vendors.filter((item) => item.approvalStatus === "approved").length} />
          <StatCard icon="close-circle-outline" iconColor={adminTheme.danger} iconBg={adminTheme.dangerBg} label="Rejected" value={vendors.filter((item) => item.approvalStatus === "rejected").length} />
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={adminTheme.muted} />
          <TextInput placeholder="Search business, owner, city..." placeholderTextColor="#B88C9D" value={search} onChangeText={setSearch} style={styles.searchInput} />
          {search ? <TouchableOpacity onPress={() => setSearch("")}><Ionicons name="close-circle" size={20} color={adminTheme.muted} /></TouchableOpacity> : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = selectedStatus === filter.key;
            return (
              <TouchableOpacity key={filter.key} onPress={() => setSelectedStatus(filter.key)} style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.listHeader}><Text style={styles.listTitle}>Vendor directory</Text><Text style={styles.resultCount}>{filtered.length} results</Text></View>

        {loading ? (
          <View style={styles.stateCard}><ActivityIndicator color={adminTheme.primary} /><Text style={styles.stateText}>Loading vendors...</Text></View>
        ) : error ? (
          <TouchableOpacity style={styles.stateCard} onPress={() => loadVendors()}><Ionicons name="cloud-offline-outline" size={29} color={adminTheme.danger} /><Text style={styles.errorText}>{error}</Text><Text style={styles.retryText}>Tap to retry</Text></TouchableOpacity>
        ) : filtered.length === 0 ? (
          <View style={styles.stateCard}><Ionicons name="storefront-outline" size={30} color={adminTheme.primary} /><Text style={styles.stateText}>No vendors found.</Text></View>
        ) : (
          filtered.map((vendor) => {
            const status = statusConfig[vendor.approvalStatus];
            return (
              <View key={vendor.id} style={styles.vendorCard}>
                <View style={styles.vendorTop}>
                  {vendor.profileImage ? (
                    <Image source={{ uri: vendor.profileImage }} style={styles.avatar} />
                  ) : (
                    <LinearGradient colors={[adminTheme.primary, "#FF8A86"]} style={styles.avatarFallback}><Text style={styles.avatarText}>{vendor.businessName.charAt(0).toUpperCase()}</Text></LinearGradient>
                  )}
                  <View style={styles.vendorCopy}>
                    <Text style={styles.vendorName} numberOfLines={1}>{vendor.businessName}</Text>
                    <Text style={styles.ownerText} numberOfLines={1}>{vendor.ownerName} · {vendor.category || "Uncategorized"}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: status.background }]}><Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text></View>
                </View>

                <View style={styles.detailsBox}>
                  <View style={styles.infoRow}><Ionicons name="location-outline" size={17} color={adminTheme.primaryDark} /><Text style={styles.infoText}>{vendor.city || "City not added"}</Text></View>
                  <View style={styles.infoRow}><Ionicons name="mail-outline" size={17} color={adminTheme.primaryDark} /><Text style={styles.infoText} numberOfLines={1}>{vendor.email}</Text></View>
                  <View style={styles.badgesRow}>
                    <View style={styles.badgePill}><Ionicons name="ribbon-outline" size={13} color={adminTheme.warning} /><Text style={styles.badgeText}>{vendor.badge.toUpperCase()}</Text></View>
                    <View style={[styles.badgePill, { backgroundColor: vendor.businessVerified ? adminTheme.successBg : adminTheme.warningBg }]}><Text style={[styles.badgeText, { color: vendor.businessVerified ? adminTheme.success : adminTheme.warning }]}>{vendor.businessVerified ? "Business verified" : "Verification pending"}</Text></View>
                  </View>
                </View>

                {canManage ? (
                  <View style={styles.actionRow}>
                    {vendor.approvalStatus !== "approved" ? (
                      <TouchableOpacity disabled={actionId === vendor.id} style={[styles.actionButton, styles.approveButton]} onPress={() => void runStatusAction(vendor, "approved")}>
                        {actionId === vendor.id ? <ActivityIndicator size="small" color={adminTheme.white} /> : <Ionicons name="checkmark" size={18} color={adminTheme.white} />}
                        <Text style={styles.approveText}>Approve</Text>
                      </TouchableOpacity>
                    ) : null}
                    {vendor.approvalStatus !== "rejected" ? (
                      <TouchableOpacity disabled={actionId === vendor.id} style={[styles.actionButton, styles.rejectButton]} onPress={() => confirmReject(vendor)}>
                        <Ionicons name="close" size={18} color={adminTheme.danger} /><Text style={styles.rejectText}>Reject</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: adminTheme.background },
  container: { flex: 1 },
  content: { padding: 18, paddingBottom: 40 },
  hero: { borderRadius: 25, padding: 20, marginBottom: 18 },
  heroBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.65)", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 6 },
  heroBadgeText: { color: adminTheme.ink, fontSize: 10, fontWeight: "800", marginLeft: 6 },
  heroTitle: { color: adminTheme.ink, fontSize: 24, lineHeight: 31, fontWeight: "900", marginTop: 13 },
  heroText: { color: "#633044", fontSize: 12, lineHeight: 19, fontWeight: "600", marginTop: 6 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 18 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: adminTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: adminTheme.border, paddingHorizontal: 14 },
  searchInput: { flex: 1, color: adminTheme.ink, fontSize: 13, paddingVertical: 13, marginLeft: 8 },
  filterRow: { paddingVertical: 13, paddingRight: 12 },
  filterChip: { borderRadius: 15, borderWidth: 1, borderColor: adminTheme.border, backgroundColor: adminTheme.surface, paddingHorizontal: 15, paddingVertical: 8, marginRight: 8 },
  filterChipActive: { backgroundColor: adminTheme.primary, borderColor: adminTheme.primary },
  filterText: { color: adminTheme.muted, fontSize: 11, fontWeight: "800" },
  filterTextActive: { color: adminTheme.white },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 },
  listTitle: { color: adminTheme.ink, fontSize: 18, fontWeight: "900" },
  resultCount: { color: adminTheme.primaryDark, fontSize: 11, fontWeight: "800", backgroundColor: adminTheme.blush, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  stateCard: { minHeight: 150, borderRadius: 22, borderWidth: 1, borderStyle: "dashed", borderColor: adminTheme.border, backgroundColor: adminTheme.surface, alignItems: "center", justifyContent: "center", padding: 20 },
  stateText: { color: adminTheme.muted, marginTop: 10, fontWeight: "700" },
  errorText: { color: adminTheme.danger, marginTop: 10, textAlign: "center" },
  retryText: { color: adminTheme.primaryDark, fontSize: 12, fontWeight: "900", marginTop: 6 },
  vendorCard: { backgroundColor: adminTheme.surface, borderRadius: 22, borderWidth: 1, borderColor: adminTheme.border, padding: 15, marginBottom: 13, shadowColor: adminTheme.shadow, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  vendorTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 17, backgroundColor: adminTheme.blush },
  avatarFallback: { width: 50, height: 50, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  avatarText: { color: adminTheme.white, fontSize: 18, fontWeight: "900" },
  vendorCopy: { flex: 1, minWidth: 0, marginHorizontal: 11 },
  vendorName: { color: adminTheme.ink, fontSize: 14, fontWeight: "900" },
  ownerText: { color: adminTheme.muted, fontSize: 10, marginTop: 3 },
  statusPill: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 9, fontWeight: "900" },
  detailsBox: { backgroundColor: adminTheme.blushSoft, borderRadius: 16, padding: 12, marginTop: 13 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  infoText: { flex: 1, color: adminTheme.muted, fontSize: 11, marginLeft: 7 },
  badgesRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 2 },
  badgePill: { flexDirection: "row", alignItems: "center", backgroundColor: adminTheme.warningBg, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 5, marginRight: 6, marginTop: 4 },
  badgeText: { color: adminTheme.warning, fontSize: 9, fontWeight: "900", marginLeft: 3 },
  actionRow: { flexDirection: "row", marginTop: 13 },
  actionButton: { flex: 1, minHeight: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  approveButton: { backgroundColor: adminTheme.primary, marginRight: 7 },
  rejectButton: { backgroundColor: adminTheme.dangerBg, borderWidth: 1, borderColor: "#FFC2CB", marginLeft: 7 },
  approveText: { color: adminTheme.white, fontWeight: "900", fontSize: 12, marginLeft: 5 },
  rejectText: { color: adminTheme.danger, fontWeight: "900", fontSize: 12, marginLeft: 5 },
});
