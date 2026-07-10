import React from "react";
import { View, ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { useSettingsStore } from "../../store/settingsStore";
import { ProfileStatTile } from "../../components/users/profile/ProfileStatTile";
import { ProfileInfoSection } from "../../components/users/profile/ProfileInfoSection";
import { ProfileQuickActionRow } from "../../components/users/profile/ProfileQuickActionRow";
import { Alert } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { styles } from "./styles/ProfileScreen.styles";

// TODO: Replace local Zustand data with getProfile() API response.

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const { profile } = useSettingsStore();
  const { logout, user } = useAuthStore();

  const displayName = user?.name || profile.fullName || "User";

  const initials =
    displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Auth",
                  },
                ],
              });
            } catch (error) {
              Alert.alert(
                "Error",
                "Unable to logout."
              );
            }
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: "Personal Information",
      rows: [
        { label: "Full Name", value: user?.name || profile.fullName },
        { label: "Email", value: user?.email || profile.email },
        { label: "Phone", value: user?.phone || profile.phone },
        { label: "Gender", value: profile.gender },
      ],
    },
    {
      title: "Partner Information",
      rows: [
        { label: "Partner Name", value: profile.partnerName },
        { label: "Partner Email", value: profile.partnerEmail },
        { label: "Partner Phone", value: profile.partnerPhone },
        { label: "Occupation", value: profile.occupation },
      ],
    },
    {
      title: "Wedding Information",
      rows: [
        { label: "Wedding Date", value: profile.weddingDate },
        { label: "Venue", value: profile.venue },
        { label: "Guest Count", value: profile.guestCount },
        { label: "Theme", value: profile.theme },
      ],
    },
    {
      title: "Contact Information",
      rows: [
        { label: "Address", value: profile.address },
        { label: "City", value: profile.city },
        { label: "State", value: profile.state },
        { label: "Country", value: profile.country },
      ],
    },
  ];

  const stats: {
    icon: keyof typeof MaterialIcons.glyphMap;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
    sublabel: string;
  }[] = [
    {
      icon: "person",
      iconBg: "#E3ECFF",
      iconColor: "#3A6FE8",
      label: "Profile",
      value: "100%",
      sublabel: "Completed",
    },
    {
      icon: "favorite",
      iconBg: "#FDEEF3",
      iconColor: "#C2185B",
      label: "Partner",
      value: profile.partnerName ? "Added" : "Pending",
      sublabel: "Information",
    },
    {
      icon: "event-available",
      iconBg: "#E8F8F0",
      iconColor: "#22B07D",
      label: "Wedding",
      value: profile.weddingDate || "--",
      sublabel: "Not Set",
    },
    {
      icon: "account-balance-wallet",
      iconBg: "#FEF6E0",
      iconColor: "#D9A404",
      label: "Budget",
      value: "₹10.0L",
      sublabel: "Planning",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      <LinearGradient
        colors={["#3AB6E8", "#3A6FE8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <Avatar.Text
            size={64}
            label={initials}
            style={styles.avatar}
            labelStyle={{ color: "#3A6FE8", fontWeight: "700" }}
          />

          <View style={{ marginLeft: 14 }}>
            <Text style={styles.heroName}>
              {displayName}
            </Text>

            <Text style={styles.heroRole}>Customer</Text>
          </View>
        </View>

        <View style={styles.heroInfoRow}>
          <MaterialIcons
            name="verified-user"
            size={16}
            color="#fff"
          />
          <Text style={styles.heroInfoText}>
            Profile Verified
          </Text>
        </View>

        <View style={styles.heroInfoRow}>
          <MaterialIcons
            name="event"
            size={16}
            color="#fff"
          />
          <Text style={styles.heroInfoText}>
            {profile.weddingDate || "Wedding date"}
          </Text>
        </View>

        <Button
          mode="contained"
          icon="pencil"
          style={styles.editButton}
          labelStyle={styles.editButtonLabel}
          onPress={() =>
            navigation.navigate("Settings", {
              openEditModal: true,
            })
          }
        >
          Edit Profile
        </Button>
      </LinearGradient>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <ProfileStatTile
            key={item.label}
            {...item}
          />
        ))}
      </View>

      {sections.map((section) => (
        <View
          key={section.title}
          style={styles.sectionRow}
        >
          <ProfileInfoSection
            title={section.title}
            rows={section.rows}
          />
        </View>
      ))}

      <View style={styles.sectionRow}>
        <Card style={styles.quickActionsCard}>
          <ProfileQuickActionRow
            icon="favorite-border"
            label="Wishlist"
            onPress={() => navigation.navigate("Wishlist")}
          />
          <Divider />

          <ProfileQuickActionRow
            icon="settings"
            label="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
        </Card>
      </View>

      <Button
        mode="contained"
        style={styles.becomeVendorButton}
        onPress={() => navigation.navigate("BecomeVendor")}
      >
        Become a Vendor
      </Button>

      <Button
        mode="outlined"
        style={styles.logoutButton}
        textColor="#E53935"
        onPress={handleLogout}
      >
        Logout
      </Button>
    </ScrollView>
  );
}