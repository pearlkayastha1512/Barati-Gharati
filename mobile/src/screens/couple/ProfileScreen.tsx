import React from "react";
import { View, ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ProfileStatTile } from "../../components/users/profile/ProfileStatTile";
import { ProfileInfoSection } from "../../components/users/profile/ProfileInfoSection";
import { ProfileQuickActionRow } from "../../components/users/profile/ProfileQuickActionRow";
import { styles } from "./styles/ProfileScreen.styles";

// TODO: import API functions once backend is connected
// import { getProfile } from "../../api/user.api";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  // TODO: replace with real user data from useAuthStore / getProfile() once connected
  const user = {
    name: "Pearl Kayastha",
    initials: "PK",
    email: "pearl@example.com",
    phone: "8527636888",
    gender: undefined as string | undefined,
    occupation: undefined as string | undefined,
    weddingDate: undefined as string | undefined,
    venue: undefined as string | undefined,
    guests: undefined as string | undefined,
    theme: undefined as string | undefined,
    address: undefined as string | undefined,
    city: undefined as string | undefined,
    state: undefined as string | undefined,
    country: undefined as string | undefined,
    profileCompletion: 19,
    partnerStatus: "Pending",
    budget: "₹10.0L",
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero card */}
      <LinearGradient
        colors={["#3AB6E8", "#3A6FE8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <Avatar.Text
            size={64}
            label={user.initials}
            style={styles.avatar}
            labelStyle={{ color: "#3A6FE8", fontWeight: "700" }}
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.heroName}>{user.name}</Text>
            <Text style={styles.heroRole}>Customer</Text>
          </View>
        </View>

        <View style={styles.heroInfoRow}>
          <MaterialIcons name="verified-user" size={16} color="#fff" />
          <Text style={styles.heroInfoText}>Profile Verified</Text>
        </View>
        <View style={styles.heroInfoRow}>
          <MaterialIcons name="event" size={16} color="#fff" />
          <Text style={styles.heroInfoText}>
            {user.weddingDate ? user.weddingDate : "Wedding date not set"}
          </Text>
        </View>

        <Button
          mode="contained"
          style={styles.editButton}
          labelStyle={styles.editButtonLabel}
          icon="pencil"
          onPress={() => navigation.navigate("EditProfile")}
        >
          Edit Profile
        </Button>
      </LinearGradient>

      {/* Stat tiles */}
      <View style={styles.statsGrid}>
        <ProfileStatTile
          icon="person"
          iconBg="#E3ECFF"
          iconColor="#3A6FE8"
          label="Profile"
          value={`${user.profileCompletion}%`}
          sublabel="Completed"
        />
        <ProfileStatTile
          icon="favorite"
          iconBg="#FDEEF3"
          iconColor="#C2185B"
          label="Partner"
          value={user.partnerStatus}
          sublabel="Information"
        />
        <ProfileStatTile
          icon="event-available"
          iconBg="#E8F8F0"
          iconColor="#22B07D"
          label="Wedding"
          value={user.weddingDate ? user.weddingDate : "--"}
          sublabel="Not Set"
        />
        <ProfileStatTile
          icon="account-balance-wallet"
          iconBg="#FEF6E0"
          iconColor="#D9A404"
          label="Budget"
          value={user.budget}
          sublabel="Planning"
        />
      </View>

      {/* Info sections */}
      <View style={styles.sectionRow}>
        <ProfileInfoSection
          title="Personal Information"
          rows={[
            { label: "Full Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone },
            { label: "Gender", value: user.gender },
          ]}
        />
      </View>

      <View style={styles.sectionRow}>
        <ProfileInfoSection
          title="Partner Information"
          rows={[
            { label: "Partner Name", value: undefined },
            { label: "Email", value: undefined },
            { label: "Phone", value: undefined },
            { label: "Occupation", value: user.occupation },
          ]}
        />
      </View>

      <View style={styles.sectionRow}>
        <ProfileInfoSection
          title="Wedding Information"
          rows={[
            { label: "Wedding Date", value: user.weddingDate },
            { label: "Venue", value: user.venue },
            { label: "Guests", value: user.guests },
            { label: "Theme", value: user.theme },
          ]}
        />
      </View>

      <View style={styles.sectionRow}>
        <ProfileInfoSection
          title="Contact Information"
          rows={[
            { label: "Address", value: user.address },
            { label: "City", value: user.city },
            { label: "State", value: user.state },
            { label: "Country", value: user.country },
          ]}
        />
      </View>

      {/* Quick actions */}
      <View style={styles.sectionRow}>
        <Card style={styles.quickActionsCard}>
          <ProfileQuickActionRow icon="favorite-border" label="Wishlist" onPress={() => navigation.navigate("Wishlist")} />
          <Divider />
          <ProfileQuickActionRow icon="chat-bubble-outline" label="Messages" onPress={() => {}} />
          <Divider />
          <ProfileQuickActionRow icon="settings" label="Settings" onPress={() => navigation.navigate("Settings")} />
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
        onPress={() => {}}
      >
        Logout
      </Button>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}