import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useNotificationsStore } from "../../store/notificationsStore";
import { NotificationCard } from "../../components/users/notifications/NotificationCard";
import { styles } from "./styles/NotificationsScreen.styles";

// TODO: import API functions once backend is connected
// import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../../api/notification.api";

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationsStore();

  // TODO: fetch on mount once backend connected
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await getNotifications();
  //     // populate store from res.data
  //   };
  //   load();
  // }, []);

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        {hasUnread && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>

          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-none" size={44} color="#dde3ea" />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
            </View>
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onPress={() => markAsRead(n.id)}
                onDelete={() => removeNotification(n.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}