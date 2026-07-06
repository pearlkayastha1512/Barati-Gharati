import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BookingScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineMedium" style={styles.heading}>
        Booking Summary
      </Text>
      <Text style={styles.subheading}>Review your details before confirming</Text>

      <Card style={styles.card} elevation={3}>
        {/* Vendor header strip */}
        <LinearGradient
          colors={["#C2185B", "#E91E63"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.vendorStrip}
        >
          <Text variant="titleLarge" style={styles.vendor}>
            Royal Palace Banquet
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color="#FFF" />
            <Text style={styles.location}>Ghaziabad</Text>
          </View>
        </LinearGradient>

        <Card.Content style={styles.content}>
          <DetailRow icon="crown-outline" label="Package" value="Gold Wedding Package" />
          <DetailRow icon="account-group-outline" label="Guests" value="400 Guests" />
          <DetailRow icon="calendar-heart" label="Wedding Date" value="25 December 2026" />
          <DetailRow icon="clock-outline" label="Time" value="7:00 PM" />

          <Divider style={styles.dashedDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹90,000</Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor="#C2185B"
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon="check-decagram-outline"
        onPress={() => navigation.navigate("BookingSuccess")}
      >
        Confirm Booking
      </Button>
    </ScrollView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color="#C2185B" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
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
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    color: "#C2185B",
    fontWeight: "700",
  },
  subheading: {
    color: "#9E9E9E",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 20,
  },

  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  vendorStrip: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  vendor: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  location: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },

  content: {
    paddingTop: 20,
    paddingBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
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
    fontSize: 15,
    color: "#3A3A3A",
    fontWeight: "500",
  },

  dashedDivider: {
    marginVertical: 10,
    borderStyle: "dashed",
    borderWidth: 0.6,
    borderColor: "#F0BFCE",
    backgroundColor: "transparent",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 22,
    color: "#C2185B",
    fontWeight: "800",
  },

  button: {
    marginTop: 26,
    borderRadius: 14,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});