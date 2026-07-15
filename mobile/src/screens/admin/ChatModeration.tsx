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
import { adminTheme } from "../../constants/adminTheme";
import {
  blockChatUser,
  getChatModerationUsers,
  muteChatUser,
  resetChatWarnings,
  suspendChatUser,
} from "../../api/admin.api";
import type { ChatModerationStatus, ChatModerationUser } from "../../types/admin";
import { useAuthStore } from "../../store/authStore";
import { hasAdminPermission } from "../../utils/adminAccess";

const statusConfig: Record<ChatModerationStatus, { label: string; color: string; background: string }> = {
  active: { label: "Active", color: adminTheme.success, background: adminTheme.successBg },
  muted: { label: "Muted", color: adminTheme.warning, background: adminTheme.warningBg },
  blocked: { label: "Blocked", color: adminTheme.danger, background: adminTheme.dangerBg },
  suspended: { label: "Suspended", color: adminTheme.ink, background: "#E9E2E5" },
  flagged: { label: "Flagged", color: adminTheme.primaryDark, background: adminTheme.blush },
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Backend server se connect nahi ho pa raha hai.";
  }
  return "Moderation queue load nahi ho saki.";
};

type ActionName = "mute30" | "mute24" | "mute7" | "block" | "suspend" | "reset";

export default function ChatModeration({ navigation }: any) {
  const currentAdmin = useAuthStore((state) => state.user);
  const canModerate = hasAdminPermission(currentAdmin, "chat.moderate");
  const canSuspend = hasAdminPermission(currentAdmin, "accounts.suspend");
  const [users, setUsers] = useState<ChatModerationUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const loadUsers = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const response = await getChatModerationUsers();
      setUsers(response.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.phone, user.role, user.status].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [search, users]);

  const runAction = async (user: ChatModerationUser, action: ActionName) => {
    setActiveAction(`${user.id}:${action}`);
    try {
      if (action === "mute30") await muteChatUser(user.id, 30);
      if (action === "mute24") await muteChatUser(user.id, 24 * 60);
      if (action === "mute7") await muteChatUser(user.id, 7 * 24 * 60);
      if (action === "block") await blockChatUser(user.id);
      if (action === "suspend") await suspendChatUser(user.id);
      if (action === "reset") await resetChatWarnings(user.id);
      await loadUsers();
    } catch (actionError) {
      Alert.alert("Action failed", getErrorMessage(actionError));
    } finally {
      setActiveAction(null);
    }
  };

  const confirmAction = (user: ChatModerationUser, action: "block" | "suspend" | "reset") => {
    const copy = {
      block: { title: "Block chat access?", message: `${user.name} messages send nahi kar payega.`, button: "Block" },
      suspend: { title: "Suspend account?", message: `${user.name} platform par login nahi kar payega.`, button: "Suspend" },
      reset: { title: "Reset warnings?", message: `${user.name} ke chat warnings aur current mute clear ho jayenge.`, button: "Reset" },
    }[action];
    Alert.alert(copy.title, copy.message, [
      { text: "Cancel", style: "cancel" },
      { text: copy.button, style: action === "reset" ? "default" : "destructive", onPress: () => void runAction(user, action) },
    ]);
  };

  const flaggedCount = users.filter((user) => user.status === "flagged").length;
  const restrictedCount = users.filter((user) => ["muted", "blocked", "suspended"].includes(user.status)).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadUsers(true)} tintColor={adminTheme.primary} />}
      >
        <AdminPageHeader navigation={navigation} title="Chat Safety" subtitle="Chat Moderation" icon="shield-checkmark-outline" />

        <LinearGradient colors={[adminTheme.ink, "#742C49", adminTheme.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}><Ionicons name="lock-closed" size={14} color={adminTheme.white} /><Text style={styles.heroBadgeText}>Protected conversations</Text></View>
            <View style={styles.heroIcon}><Ionicons name="shield-checkmark" size={26} color={adminTheme.white} /></View>
          </View>
          <Text style={styles.heroTitle}>Keep every conversation safe.</Text>
          <Text style={styles.heroText}>Review flagged accounts, warnings and active chat restrictions in real time.</Text>
        </LinearGradient>

        <View style={styles.statGrid}>
          <StatCard icon="warning-outline" iconColor={adminTheme.primaryDark} iconBg={adminTheme.blush} label="In Queue" value={users.length} />
          <StatCard icon="flag-outline" iconColor={adminTheme.warning} iconBg={adminTheme.warningBg} label="Flagged" value={flaggedCount} />
          <StatCard icon="ban-outline" iconColor={adminTheme.danger} iconBg={adminTheme.dangerBg} label="Restricted" value={restrictedCount} />
          <StatCard icon="shield-checkmark-outline" iconColor={adminTheme.success} iconBg={adminTheme.successBg} label="Safety Status" value="Live" />
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={adminTheme.muted} />
          <TextInput placeholder="Search user, email, phone or status..." placeholderTextColor="#B88C9D" value={search} onChangeText={setSearch} style={styles.searchInput} />
          {search ? <TouchableOpacity onPress={() => setSearch("")}><Ionicons name="close-circle" size={20} color={adminTheme.muted} /></TouchableOpacity> : null}
        </View>

        <View style={styles.listHeader}><Text style={styles.listTitle}>Moderation queue</Text><Text style={styles.resultCount}>{filtered.length} accounts</Text></View>

        {loading ? (
          <View style={styles.stateCard}><ActivityIndicator color={adminTheme.primary} /><Text style={styles.stateText}>Loading moderation queue...</Text></View>
        ) : error ? (
          <TouchableOpacity style={styles.stateCard} onPress={() => loadUsers()}><Ionicons name="cloud-offline-outline" size={29} color={adminTheme.danger} /><Text style={styles.errorText}>{error}</Text><Text style={styles.retryText}>Tap to retry</Text></TouchableOpacity>
        ) : filtered.length === 0 ? (
          <View style={styles.stateCard}><View style={styles.safeIcon}><Ionicons name="checkmark" size={28} color={adminTheme.success} /></View><Text style={styles.emptyTitle}>All conversations look safe</Text><Text style={styles.stateText}>No flagged or moderated accounts found.</Text></View>
        ) : (
          filtered.map((chatUser) => {
            const status = statusConfig[chatUser.status];
            const busy = activeAction?.startsWith(`${chatUser.id}:`) ?? false;
            return (
              <View key={chatUser.id} style={styles.userCard}>
                <View style={styles.userTop}>
                  <LinearGradient colors={[adminTheme.primary, "#FF8A86"]} style={styles.avatar}><Text style={styles.avatarText}>{chatUser.name.charAt(0).toUpperCase()}</Text></LinearGradient>
                  <View style={styles.userCopy}>
                    <Text style={styles.userName} numberOfLines={1}>{chatUser.name}</Text>
                    <Text style={styles.userRole}>{chatUser.role} · {chatUser.warningCount} warning{chatUser.warningCount === 1 ? "" : "s"}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: status.background }]}><Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text></View>
                </View>

                <View style={styles.contactBox}>
                  <Text style={styles.email} numberOfLines={1}>{chatUser.email}</Text>
                  {chatUser.violationReason ? <Text style={styles.reason}>Reason: {chatUser.violationReason}</Text> : null}
                  {chatUser.lastViolationTime ? <Text style={styles.dateText}>Last violation: {new Date(chatUser.lastViolationTime).toLocaleString("en-IN")}</Text> : null}
                  {chatUser.status === "muted" && chatUser.chatMutedUntil ? <Text style={styles.mutedUntil}>Muted until {new Date(chatUser.chatMutedUntil).toLocaleString("en-IN")}</Text> : null}
                </View>

                {canModerate ? (
                  <View style={styles.actions}>
                    <Text style={styles.actionLabel}>Quick moderation</Text>
                    <View style={styles.actionGrid}>
                      <ActionButton label="30 min" icon="time-outline" busy={activeAction === `${chatUser.id}:mute30`} disabled={busy} onPress={() => void runAction(chatUser, "mute30")} />
                      <ActionButton label="24 hrs" icon="time-outline" busy={activeAction === `${chatUser.id}:mute24`} disabled={busy} onPress={() => void runAction(chatUser, "mute24")} />
                      <ActionButton label="7 days" icon="calendar-outline" busy={activeAction === `${chatUser.id}:mute7`} disabled={busy} onPress={() => void runAction(chatUser, "mute7")} />
                      <ActionButton label="Block" icon="ban-outline" tone="danger" busy={activeAction === `${chatUser.id}:block`} disabled={busy} onPress={() => confirmAction(chatUser, "block")} />
                      <ActionButton label="Reset" icon="refresh-outline" tone="success" busy={activeAction === `${chatUser.id}:reset`} disabled={busy} onPress={() => confirmAction(chatUser, "reset")} />
                      {canSuspend ? <ActionButton label="Suspend" icon="person-remove-outline" tone="dark" busy={activeAction === `${chatUser.id}:suspend`} disabled={busy} onPress={() => confirmAction(chatUser, "suspend")} /> : null}
                    </View>
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

function ActionButton({ label, icon, tone = "default", busy, disabled, onPress }: { label: string; icon: string; tone?: "default" | "danger" | "success" | "dark"; busy: boolean; disabled: boolean; onPress: () => void }) {
  const palette = {
    default: { background: adminTheme.blush, color: adminTheme.primaryDark },
    danger: { background: adminTheme.dangerBg, color: adminTheme.danger },
    success: { background: adminTheme.successBg, color: adminTheme.success },
    dark: { background: adminTheme.ink, color: adminTheme.white },
  }[tone];
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.actionButton, { backgroundColor: palette.background }, disabled && styles.disabledButton]}>
      {busy ? <ActivityIndicator size="small" color={palette.color} /> : <Ionicons name={icon as any} size={16} color={palette.color} />}
      <Text style={[styles.actionText, { color: palette.color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: adminTheme.background },
  container: { flex: 1 },
  content: { padding: 18, paddingBottom: 40 },
  hero: { borderRadius: 25, padding: 20, marginBottom: 18, shadowColor: adminTheme.ink, shadowOpacity: 0.18, shadowRadius: 12, elevation: 4 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7 },
  heroBadgeText: { color: adminTheme.white, fontSize: 10, fontWeight: "800", marginLeft: 6 },
  heroIcon: { width: 45, height: 45, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  heroTitle: { color: adminTheme.white, fontSize: 24, lineHeight: 31, fontWeight: "900", marginTop: 18 },
  heroText: { color: "#FFD9E2", fontSize: 12, lineHeight: 19, fontWeight: "600", marginTop: 7 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 18 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: adminTheme.surface, borderRadius: 18, borderWidth: 1, borderColor: adminTheme.border, paddingHorizontal: 14, marginBottom: 20 },
  searchInput: { flex: 1, color: adminTheme.ink, fontSize: 13, paddingVertical: 13, marginLeft: 8 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 },
  listTitle: { color: adminTheme.ink, fontSize: 18, fontWeight: "900" },
  resultCount: { color: adminTheme.primaryDark, fontSize: 11, fontWeight: "800", backgroundColor: adminTheme.blush, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  stateCard: { minHeight: 170, borderRadius: 22, borderWidth: 1, borderStyle: "dashed", borderColor: adminTheme.border, backgroundColor: adminTheme.surface, alignItems: "center", justifyContent: "center", padding: 20 },
  safeIcon: { width: 56, height: 56, borderRadius: 19, backgroundColor: adminTheme.successBg, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: adminTheme.ink, fontSize: 16, fontWeight: "900", marginTop: 13 },
  stateText: { color: adminTheme.muted, marginTop: 7, textAlign: "center", fontSize: 12 },
  errorText: { color: adminTheme.danger, marginTop: 10, textAlign: "center" },
  retryText: { color: adminTheme.primaryDark, fontSize: 12, fontWeight: "900", marginTop: 6 },
  userCard: { backgroundColor: adminTheme.surface, borderRadius: 22, borderWidth: 1, borderColor: adminTheme.border, padding: 15, marginBottom: 13, shadowColor: adminTheme.shadow, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  userTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 47, height: 47, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  avatarText: { color: adminTheme.white, fontSize: 18, fontWeight: "900" },
  userCopy: { flex: 1, minWidth: 0, marginHorizontal: 11 },
  userName: { color: adminTheme.ink, fontSize: 14, fontWeight: "900" },
  userRole: { color: adminTheme.muted, fontSize: 10, textTransform: "capitalize", marginTop: 3 },
  statusPill: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 9, fontWeight: "900" },
  contactBox: { backgroundColor: adminTheme.blushSoft, borderRadius: 16, padding: 12, marginTop: 13 },
  email: { color: adminTheme.ink, fontSize: 11, fontWeight: "700" },
  reason: { color: adminTheme.muted, fontSize: 11, lineHeight: 16, marginTop: 7 },
  dateText: { color: adminTheme.muted, fontSize: 10, marginTop: 6 },
  mutedUntil: { color: adminTheme.warning, fontSize: 10, fontWeight: "800", marginTop: 6 },
  actions: { marginTop: 13 },
  actionLabel: { color: adminTheme.ink, fontSize: 11, fontWeight: "900", marginBottom: 8 },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  actionButton: { minWidth: "30%", flexGrow: 1, minHeight: 38, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 9 },
  actionText: { fontSize: 10, fontWeight: "900", marginLeft: 5 },
  disabledButton: { opacity: 0.58 },
});
