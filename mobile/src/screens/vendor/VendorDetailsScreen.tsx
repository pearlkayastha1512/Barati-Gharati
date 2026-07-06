import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function VendorDetailsScreen() {
    const navigation = useNavigation<any>();
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: "https://picsum.photos/600/350",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text variant="headlineSmall">
          Royal Palace Banquet
        </Text>

        <Text style={styles.location}>
          📍 Ghaziabad
        </Text>

        <Text style={styles.rating}>
          ⭐ 4.8 (120 Reviews)
        </Text>

        <Text style={styles.price}>
          Starting ₹80,000
        </Text>

        <Text style={styles.heading}>
          About
        </Text>

        <Text>
          Spacious banquet hall suitable for weddings,
          receptions and engagement ceremonies.
        </Text>

       <Button
  mode="contained"
  style={styles.button}
  onPress={() => navigation.navigate("PackageDetails")}
>
  View Packages
</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },

  image: {
    width: "100%",
    height: 250,
  },

  content: {
    padding: 20,
  },

  location: {
    marginTop: 8,
    color: "#666",
  },

  rating: {
    marginTop: 6,
  },

  price: {
    marginTop: 10,
    color: "#C2185B",
    fontWeight: "bold",
    fontSize: 18,
  },

  heading: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 18,
  },

  button: {
    marginTop: 25,
  },
});