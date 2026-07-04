import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Avatar.Text
        size={90}
        label="PK"
        style={styles.avatar}
      />

      <Text variant="headlineMedium" style={styles.name}>
        Pearl Kayastha
      </Text>

      <Text style={styles.email}>
        pearl@example.com
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>📱 +91 9876543210</Text>

          <Divider style={styles.divider} />

          <Text>💍 Wedding Date</Text>
          <Text>25 December 2026</Text>

          <Divider style={styles.divider} />

          <Text>🎯 Role</Text>
          <Text>Customer</Text>
        </Card.Content>
      </Card>

      <Button
  mode="contained"
  style={styles.button}
  onPress={() => navigation.navigate("BecomeVendor")}
>
  Become a Vendor
</Button>

      <Button
        mode="outlined"
        style={styles.logout}
        onPress={() => {}}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
    alignItems: "center",
    padding: 20,
  },

  avatar: {
    marginTop: 20,
    backgroundColor: "#C2185B",
  },

  name: {
    marginTop: 15,
    fontWeight: "700",
  },

  email: {
    color: "#666",
    marginBottom: 25,
  },

  card: {
    width: "100%",
    borderRadius: 14,
  },

  divider: {
    marginVertical: 15,
  },

  button: {
    marginTop: 25,
    width: "100%",
    borderRadius: 10,
  },

  logout: {
    marginTop: 15,
    width: "100%",
    borderRadius: 10,
  },
});