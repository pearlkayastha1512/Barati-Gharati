import React from "react";
import {
  View,
  Text,
 TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { VendorNotification } from "../../../store/vendorNotificationsStore";

interface Props {
  notification: VendorNotification;
  onRead: () => void;
  onDelete: () => void;
}

export function NotificationCard({
  notification,
  onRead,
  onDelete,
}: Props) {
  const formattedDate = new Date(
    notification.createdAt
  ).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.card,
        !notification.isRead && styles.unreadCard,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={
              notification.isRead
                ? "bell-outline"
                : "bell-ring"
            }
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {notification.title}
          </Text>

          <Text style={styles.time}>
            {formattedDate}
          </Text>
        </View>

        {!notification.isRead && (
          <View style={styles.dot} />
        )}
      </View>

      <Text style={styles.message}>
        {notification.message}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.readBtn}
          onPress={onRead}
        >
          <MaterialCommunityIcons
            name={
              notification.isRead
                ? "email-open-outline"
                : "check-circle-outline"
            }
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.readText}>
            {notification.isRead
              ? "Mark Unread"
              : "Mark Read"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color={COLORS.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  time: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.textMuted,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  message: {
    marginTop: 14,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },

  readBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  readText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
  },
});