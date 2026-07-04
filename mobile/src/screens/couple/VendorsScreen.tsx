import { View, Text, StyleSheet } from "react-native";
import VendorCard from "../../components/vendor/VendorCard";

export default function VendorListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendors</Text>
      <VendorCard />
    <VendorCard />
    <VendorCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#C2185B",
  },
});