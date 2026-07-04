import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";

export default function PackageDetailsScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text variant="headlineMedium" style={styles.title}>
        Packages
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">
            Silver Package
          </Text>

          <Text style={styles.price}>
            ₹50,000
          </Text>

          <Text>
            • Decoration{"\n"}
            • Basic Lighting{"\n"}
            • 200 Guests
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">
            Book Now
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">
            Gold Package
          </Text>

          <Text style={styles.price}>
            ₹90,000
          </Text>

          <Text>
            • Premium Decoration{"\n"}
            • DJ{"\n"}
            • 400 Guests
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">
            Book Now
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">
            Platinum Package
          </Text>

          <Text style={styles.price}>
            ₹1,50,000
          </Text>

          <Text>
            • Luxury Decoration{"\n"}
            • DJ{"\n"}
            • Live Catering{"\n"}
            • 700 Guests
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">
            Book Now
          </Button>
        </Card.Actions>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    padding: 20,
  },

  title: {
    marginBottom: 20,
    color: "#C2185B",
    fontWeight: "700",
  },

  card: {
    marginBottom: 20,
    borderRadius: 14,
  },

  price: {
    color: "#C2185B",
    fontWeight: "700",
    marginVertical: 10,
    fontSize: 18,
  },
});