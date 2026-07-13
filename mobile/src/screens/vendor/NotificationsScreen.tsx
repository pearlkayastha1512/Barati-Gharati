import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import { styles } from "./notificationStyles";

import { NotificationCard } from "../../components/vendors/notifications/NotificationCard";

import { useVendorNotificationsStore } from "../../store/vendorNotificationsStore";

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();

  const {
    notifications,
    fetchNotifications,
    toggleRead,
    removeNotification,
  } = useVendorNotificationsStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Stay updated with your business.
          </Text>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={fetchNotifications}
          />
        }
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={55}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyTitle}>
              No Notifications
            </Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onRead={() =>
              toggleRead(item.id, !item.isRead)
            }
            onDelete={() =>
              Alert.alert(
                "Delete Notification",
                "Are you sure?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                      removeNotification(item.id),
                  },
                ]
              )
            }
          />
        )}
      />
    </SafeAreaView>
  );
}