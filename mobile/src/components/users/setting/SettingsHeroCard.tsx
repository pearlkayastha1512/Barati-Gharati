import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

export function SettingsHeroCard() {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroBadge}>
        <MaterialIcons name="settings" size={14} color="#fff" />
        <Text style={styles.heroBadgeText}>Account Settings</Text>
      </View>

      <Text style={styles.heroTitle}>Manage your{"\n"}account preferences</Text>
      <Text style={styles.heroSubtitle}>
        Control notifications, privacy, security and your account settings.
      </Text>

      <View style={styles.heroStatusBox}>
        <View style={styles.heroStatusRow}>
          <MaterialIcons name="verified-user" size={18} color="#fff" />
          <Text style={styles.heroStatusText}>Security Enabled</Text>
        </View>
        <View style={styles.heroStatusRow}>
          <MaterialIcons name="notifications-active" size={18} color="#fff" />
          <Text style={styles.heroStatusText}>Notifications Active</Text>
        </View>
      </View>
    </View>
  );
}