import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { deleteAdminCustomer, getAdminCustomers } from "../../api/admin.api";
import type { AdminCustomer } from "../../types/admin";
import { useAuthStore } from "../../store/authStore";
import { hasAdminPermission } from "../../utils/adminAccess";

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Backend server se connect nahi ho pa raha hai.";
  }
  return "Customers load nahi ho sake.";
};

export default function CustomerManagement({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const canManage = hasAdminPermission(user, "customers.manage");
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCustomers = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const response = await getAdminCustomers();
      setCustomers(response.data.filter((item) => item.role === "USER"));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadCustomers(); }, [loadCustomers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone || ""].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [customers, search]);

  const verified = customers.filter((customer) => customer.isVerified).length;
  const joinedThisMonth = customers.filter((customer) => {
    const date = new Date(customer.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const confirmDelete = (customer: AdminCustomer) => {
    Alert.alert(
      "Delete customer?",
      `${customer.name} ka account aur linked data permanently delete ho sakta hai.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(customer.id);
            try {
              await deleteAdminCustomer(customer.id);
              setCustomers((current) => current.filter((item) => item.id !== customer.id));
            } catch (deleteError) {
              Alert.alert("Unable to delete", getErrorMessage(deleteError));
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadCustomers(true)} tintColor={adminTheme.primary} />}
      >
        <AdminPageHeader navigation={navigation} title="Customers" subtitle="Customer Management" icon="people-outline" />

        <LinearGradient colors={adminGradient} style={styles.hero}>
          <View style={styles.heroIcon}><Ionicons name="people" size={23} color={adminTheme.ink} /></View>
          <Text style={styles.heroTitle}>Know your customers.</Text>
          <Text style={styles.heroText}>Live customer accounts, contact information and verification status—all in one view.</Text>
        </LinearGradient>

        <View style={styles.statGrid}>
          <StatCard icon="people-outline" iconColor={adminTheme.primaryDark} iconBg={adminTheme.blush} label="Total Customers" value={customers.length} />
          <StatCard icon="shield-checkmark-outline" iconColor={adminTheme.success} iconBg={adminTheme.successBg} label="Verified" value={verified} />
          <StatCard icon="person-add-outline" iconColor={adminTheme.warning} iconBg={adminTheme.warningBg} label="New This Month" value={joinedThisMonth} />
          <StatCard icon="alert-circle-outline" iconColor={adminTheme.danger} iconBg={adminTheme.dangerBg} label="Unverified" value={customers.length - verified} />
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={adminTheme.muted} />
          <TextInput
            placeholder="Search name, email or phone..."
            placeholderTextColor="#B88C9D"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}><Ionicons name="close-circle" size={20} color={adminTheme.muted} /></TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Customer directory</Text>
          <Text style={styles.resultCount}>{filtered.length} results</Text>
        </View>

        {loading ? (
          <View style={styles.stateCard}><ActivityIndicator color={adminTheme.primary} /><Text style={styles.stateText}>Loading customers...</Text></View>
        ) : error ? (
          <TouchableOpacity style={styles.stateCard} onPress={() => loadCustomers()}>
            <Ionicons name="cloud-offline-outline" size={29} color={adminTheme.danger} />
            <Text style={styles.errorText}>{error}</Text><Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        ) : filtered.length === 0 ? (
          <View style={styles.stateCard}><Ionicons name="people-outline" size={30} color={adminTheme.primary} /><Text style={styles.stateText}>No customers found.</Text></View>
        ) : (
          filtered.map((customer) => (
            <View key={customer.id} style={styles.customerCard}>
              <View style={styles.customerTop}>
                <LinearGradient colors={[adminTheme.primary, "#FF8A86"]} style={styles.avatar}>
                  <Text style={styles.avatarText}>{customer.name.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
                <View style={styles.customerCopy}>
                  <Text style={styles.customerName} numberOfLines={1}>{customer.name}</Text>
                  <Text style={styles.joinedText}>Joined {new Date(customer.createdAt).toLocaleDateString("en-IN")}</Text>
                </View>
                <View style={[styles.statusPill, customer.isVerified ? styles.verifiedPill : styles.unverifiedPill]}>
                  <Text style={[styles.statusText, { color: customer.isVerified ? adminTheme.success : adminTheme.warning }]}>
                    {customer.isVerified ? "Verified" : "Unverified"}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}><Ionicons name="mail-outline" size={17} color={adminTheme.primaryDark} /><Text style={styles.infoText} numberOfLines={1}>{customer.email}</Text></View>
              <View style={styles.infoRow}><Ionicons name="call-outline" size={17} color={adminTheme.primaryDark} /><Text style={styles.infoText}>{customer.phone || "Phone not added"}</Text></View>
              {canManage ? (
                <TouchableOpacity style={styles.deleteButton} disabled={deletingId === customer.id} onPress={() => confirmDelete(customer)}>
                  {deletingId === customer.id ? <ActivityIndicator size="small" color={adminTheme.danger} /> : <Ionicons name="trash-outline" size={17} color={adminTheme.danger} />}
                  <Text style={styles.deleteText}>{deletingId === customer.id ? "Deleting..." : "Delete account"}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
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
  heroIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center" },
  heroTitle: { color: adminTheme.ink, fontSize: 24, lineHeight: 31, fontWeight: "900", marginTop: 13 },
  heroText: { color: "#633044", fontSize: 12, lineHeight: 19, fontWeight: "600", marginTop: 6 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 18 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: adminTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: adminTheme.border, paddingHorizontal: 14, marginBottom: 20 },
  searchInput: { flex: 1, color: adminTheme.ink, fontSize: 13, paddingVertical: 13, marginLeft: 8 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 },
  listTitle: { color: adminTheme.ink, fontSize: 18, fontWeight: "900" },
  resultCount: { color: adminTheme.primaryDark, fontSize: 11, fontWeight: "800", backgroundColor: adminTheme.blush, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  stateCard: { minHeight: 150, borderRadius: 22, borderWidth: 1, borderStyle: "dashed", borderColor: adminTheme.border, backgroundColor: adminTheme.surface, alignItems: "center", justifyContent: "center", padding: 20 },
  stateText: { color: adminTheme.muted, marginTop: 10, fontWeight: "700" },
  errorText: { color: adminTheme.danger, marginTop: 10, textAlign: "center" },
  retryText: { color: adminTheme.primaryDark, fontSize: 12, fontWeight: "900", marginTop: 6 },
  customerCard: { backgroundColor: adminTheme.surface, borderRadius: 22, borderWidth: 1, borderColor: adminTheme.border, padding: 15, marginBottom: 12, shadowColor: adminTheme.shadow, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  customerTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 47, height: 47, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  avatarText: { color: adminTheme.white, fontSize: 18, fontWeight: "900" },
  customerCopy: { flex: 1, minWidth: 0, marginHorizontal: 11 },
  customerName: { color: adminTheme.ink, fontSize: 15, fontWeight: "900" },
  joinedText: { color: adminTheme.muted, fontSize: 10, marginTop: 3 },
  statusPill: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 },
  verifiedPill: { backgroundColor: adminTheme.successBg },
  unverifiedPill: { backgroundColor: adminTheme.warningBg },
  statusText: { fontSize: 9, fontWeight: "900" },
  divider: { height: 1, backgroundColor: adminTheme.blush, marginVertical: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { flex: 1, color: adminTheme.muted, fontSize: 12, marginLeft: 8 },
  deleteButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 13, backgroundColor: adminTheme.dangerBg, paddingHorizontal: 11, paddingVertical: 8, marginTop: 4 },
  deleteText: { color: adminTheme.danger, fontSize: 11, fontWeight: "800", marginLeft: 6 },
});
