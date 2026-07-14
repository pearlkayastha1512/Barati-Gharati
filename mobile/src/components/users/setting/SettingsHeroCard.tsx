import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../../screens/couple/styles/SettingsScreen.styles";

export function SettingsHeroCard() {
  return (
    <LinearGradient
      colors={["#ff4d6d", "#ff8fa1", "#fff3b0"]}
      locations={[0, 0.58, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      <View pointerEvents="none" style={styles.heroDecorations}>
        <View style={styles.heroRingLarge} />
        <View style={styles.heroRingSmall} />
        <MaterialIcons name="settings" size={82} color="rgba(255,255,255,0.10)" style={styles.heroWatermark} />
      </View>
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
          <View style={styles.heroStatusIcon}>
            <MaterialIcons name="verified-user" size={17} color="#ff4d6d" />
          </View>
          <Text style={styles.heroStatusText}>Security Enabled</Text>
        </View>
        <View style={styles.heroStatusRow}>
          <View style={styles.heroStatusIcon}>
            <MaterialIcons name="notifications-active" size={17} color="#ff4d6d" />
          </View>
          <Text style={styles.heroStatusText}>Notifications Active</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
