import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function BookingSuccessScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Ionicons
        name="checkmark-circle"
        size={110}
        color="#4CAF50"
      />

      <Text variant="headlineMedium" style={styles.title}>
        Booking Confirmed
      </Text>

      <Text style={styles.subtitle}>
        Your booking has been placed successfully.
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    marginTop: 20,
    fontWeight: "700",
    color: "#4CAF50",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#666",
  },

  button: {
    marginTop: 35,
    width: "100%",
    borderRadius: 10,
  },
});