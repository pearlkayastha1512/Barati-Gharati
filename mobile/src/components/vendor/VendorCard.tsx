import { View, StyleSheet, Image } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function VendorCard() {
    const navigation = useNavigation<any>();
  return (
    <Card style={styles.card}>
      <Image
        source={{
          uri: "https://picsum.photos/400/250",
        }}
        style={styles.image}
      />

      <Card.Content>
        <Text variant="titleMedium">
          Royal Palace Banquet
        </Text>

        <Text variant="bodyMedium">
          📍 Ghaziabad
        </Text>

        <Text variant="bodyMedium">
          ⭐ 4.8 (120 Reviews)
        </Text>

        <Text
          variant="titleSmall"
          style={styles.price}
        >
          Starting ₹80,000
        </Text>
      </Card.Content>

      <Card.Actions>
        <Button
  mode="contained"
  onPress={() => navigation.navigate("VendorDetails")}
>
  View Details
</Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 14,
  },

  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  price: {
    color: "#C2185B",
    marginTop: 8,
    fontWeight: "bold",
  },
});