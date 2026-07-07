import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NotificationItem } from "../../../store/notificationsStore";
import { styles } from "../../../screens/couple/styles/NotificationsScreen.styles";

type Props = {
  notification: NotificationItem;
  onPress: () => void;
  onDelete: () => void;
};

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function NotificationCard({ notification, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity
      style={[styles.notificationCard, !notification.isRead && styles.notificationCardUnread]}
      onPress={onPress}
    >
      <View style={styles.notificationIconCircle}>
        <MaterialIcons name="notifications" size={18} color="#C2185B" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{timeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
      <TouchableOpacity onPress={onDelete} style={{ marginLeft: 8 }}>
        <MaterialIcons name="close" size={18} color="#ccc" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}