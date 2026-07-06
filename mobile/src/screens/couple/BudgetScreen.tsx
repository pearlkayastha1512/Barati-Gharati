import { View, StyleSheet } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

export default function BudgetScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Budget Overview
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Total Budget</Text>
          <Text variant="headlineSmall">₹5,00,000</Text>

          <View style={{ height: 15 }} />

          <Text>Spent</Text>
          <Text variant="titleLarge">₹1,80,000</Text>

          <View style={{ height: 15 }} />

          <Text>Remaining</Text>
          <Text variant="titleLarge">₹3,20,000</Text>

          <ProgressBar
            progress={0.36}
            style={styles.progress}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">
            Recent Expenses
          </Text>

          <Text>Venue Booking - ₹90,000</Text>

          <Text>Photographer - ₹35,000</Text>

          <Text>Decoration - ₹55,000</Text>
        </Card.Content>
      </Card>
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
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    marginBottom: 20,
    borderRadius: 14,
  },

  progress: {
    marginTop: 15,
    height: 10,
    borderRadius: 10,
  },
});