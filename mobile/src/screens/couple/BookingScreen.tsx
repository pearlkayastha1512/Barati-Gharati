import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Booking Summary
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.vendor}>
            Royal Palace Banquet
          </Text>

          <Text style={styles.location}>
            📍 Ghaziabad
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.label}>Package</Text>
          <Text>Gold Wedding Package</Text>

          <Text style={styles.label}>Guests</Text>
          <Text>400 Guests</Text>

          <Text style={styles.label}>Wedding Date</Text>
          <Text>25 December 2026</Text>

          <Text style={styles.label}>Time</Text>
          <Text>7:00 PM</Text>

          <Divider style={styles.divider} />

          <Text style={styles.total}>
            Total Amount : ₹90,000
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("BookingSuccess")}
      >
        Confirm Booking
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    padding: 20,
  },

  heading: {
    color: "#C2185B",
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    borderRadius: 15,
    elevation: 3,
  },

  vendor: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  location: {
    color: "#666",
    marginBottom: 10,
  },

  divider: {
    marginVertical: 15,
  },

  label: {
    fontWeight: "700",
    marginTop: 10,
    color: "#C2185B",
  },

  total: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 18,
    color: "#C2185B",
  },

  button: {
    marginTop: 25,
    borderRadius: 10,
    paddingVertical: 5,
  },
});