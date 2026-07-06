import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={["#4C6FE0", "#5B8DEF", "#7FB6F0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Avatar.Text
            size={64}
            label="PK"
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.headerText}>
            <Text style={styles.name}>Pearl Kayastha</Text>
            <Text style={styles.role}>Customer</Text>
          </View>
        </View>

        <View style={styles.headerFooter}>
          <View style={styles.headerFooterRow}>
            <MaterialCommunityIcons name="check-decagram" size={16} color="#FFFFFF" />
            <Text style={styles.headerFooterText}>Profile Verified</Text>
          </View>
          <View style={styles.headerFooterRow}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color="#FFFFFF" />
            <Text style={styles.headerFooterText}>Wedding date not set</Text>
          </View>
          <Button
            mode="contained"
            buttonColor="#FFFFFF"
            textColor="#4C6FE0"
            style={styles.editButton}
            contentStyle={styles.editButtonContent}
            labelStyle={styles.editButtonLabel}
            icon="pencil-outline"
            onPress={() => navigation.navigate("EditProfile")}
          >
            Edit Profile
          </Button>
        </View>
      </LinearGradient>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        <StatCard icon="account-outline" iconBg="#E3ECFF" iconColor="#4C6FE0" label="Completed" value="19%" caption="Profile" />
        <StatCard icon="heart-outline" iconBg="#FCE4EC" iconColor="#C2185B" label="Information" value="Pending" caption="Partner" />
      </View>
      <View style={styles.statsRow}>
        <StatCard icon="calendar-heart" iconBg="#E3F6EA" iconColor="#2E9E5B" label="Not Set" value="--" caption="Wedding" />
        <StatCard icon="wallet-outline" iconBg="#FFF6DD" iconColor="#C79100" label="Planning" value="₹10.0L" caption="Budget" />
      </View>

      {/* Personal Information */}
      <SectionCard title="Personal Information" icon="account-circle-outline">
        <DetailRow icon="badge-account-outline" label="Full Name" value="Pearl Kayastha" />
        <DetailRow icon="email-outline" label="Email" value="pearl.gkp@gmail.com" />
        <DetailRow icon="phone-outline" label="Phone" value="6393609526" />
        <DetailRow icon="gender-male-female" label="Gender" value="Not Provided" muted />
      </SectionCard>

      {/* Partner Information */}
      <SectionCard title="Partner Information" icon="heart-outline">
        <DetailRow icon="account-heart-outline" label="Partner Name" value="Not Provided" muted />
        <DetailRow icon="email-outline" label="Email" value="Not Provided" muted />
        <DetailRow icon="phone-outline" label="Phone" value="Not Provided" muted />
        <DetailRow icon="briefcase-outline" label="Occupation" value="Not Provided" muted />
      </SectionCard>

      {/* Wedding Information */}
      <SectionCard title="Wedding Information" icon="calendar-heart">
        <DetailRow icon="calendar-outline" label="Wedding Date" value="Not Provided" muted />
        <DetailRow icon="map-marker-outline" label="Venue" value="Not Provided" muted />
        <DetailRow icon="account-group-outline" label="Guests" value="Not Provided" muted />
        <DetailRow icon="palette-outline" label="Theme" value="Not Provided" muted />
      </SectionCard>

      {/* Contact Information */}
      <SectionCard title="Contact Information" icon="map-marker-radius-outline">
        <DetailRow icon="home-outline" label="Address" value="Not Provided" muted />
        <DetailRow icon="city-variant-outline" label="City" value="Not Provided" muted />
        <DetailRow icon="map-outline" label="State" value="Not Provided" muted />
        <DetailRow icon="earth" label="Country" value="Not Provided" muted />
      </SectionCard>

      {/* Actions */}
      <Button
        mode="contained"
        buttonColor="#C2185B"
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon="store-plus-outline"
        onPress={() => navigation.navigate("BecomeVendor")}
      >
        Become a Vendor
      </Button>

      <Button
        mode="outlined"
        textColor="#C2185B"
        style={styles.logout}
        contentStyle={styles.buttonContent}
        icon="logout"
        onPress={() => {}}
      >
        Logout
      </Button>
    </ScrollView>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  caption,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card style={styles.statCard} elevation={2}>
      <Card.Content style={styles.statCardContent}>
        <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.statCaption}>{caption}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <Card style={styles.sectionCard} elevation={2}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name={icon} size={18} color="#C2185B" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Divider style={styles.sectionDivider} />
        {children}
      </Card.Content>
    </Card>
  );
}

function DetailRow({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={17} color="#C2185B" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, muted && styles.rowValueMuted]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  container: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#FFFFFF",
  },
  avatarLabel: {
    color: "#4C6FE0",
    fontWeight: "700",
  },
  headerText: {
    marginLeft: 14,
  },
  name: {
    fontSize: 19,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  role: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 2,
  },
  headerFooter: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 14,
  },
  headerFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  headerFooterText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  editButton: {
    borderRadius: 10,
    marginTop: 4,
  },
  editButtonContent: {
    paddingVertical: 2,
  },
  editButtonLabel: {
    fontSize: 13,
    fontWeight: "700",
  },

  /* Stat cards */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  statCardContent: {
    paddingVertical: 14,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statCaption: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3A3A3A",
  },
  statLabel: {
    fontSize: 11,
    color: "#B0B0B0",
    marginTop: 2,
  },

  /* Section cards */
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#C2185B",
  },
  sectionDivider: {
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#F5E2E8",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14.5,
    color: "#3A3A3A",
    fontWeight: "600",
  },
  rowValueMuted: {
    color: "#B0B0B0",
    fontWeight: "500",
  },

  /* Actions */
  button: {
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 14,
  },
  logout: {
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 14,
    borderColor: "#C2185B",
  },
  buttonContent: {
    paddingVertical: 6,
  },
});