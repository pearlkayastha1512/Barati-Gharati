import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View,TouchableOpacity} from "react-native";
import {
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";



export default function BecomeVendorScreen() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  

  const categories = [
  { label: "Venue", value: "Venue" },
  { label: "Photographer", value: "Photographer" },
  { label: "Decorator", value: "Decorator" },
  { label: "Caterer", value: "Caterer" },
  { label: "DJ", value: "DJ" },
  { label: "Makeup Artist", value: "Makeup Artist" },
];

  const handleSubmit = () => {
    // TODO(API): Submit Vendor Application

    Alert.alert(
      "Application Submitted 🎉",
      "Your application has been sent for admin approval."
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="store-plus"
          size={65}
          color="#C2185B"
        />
      </View>

      <Text style={styles.title}>Become a Vendor</Text>

      <Text style={styles.subtitle}>
        Join thousands of trusted wedding vendors and grow your business with
        Barati Gharati.
      </Text>

      <Card style={styles.card}>
        <Card.Content>

          <TextInput
            label="Business Name"
            mode="outlined"
            value={businessName}
            onChangeText={setBusinessName}
            style={styles.input}
            left={<TextInput.Icon icon="store" />}
            outlineStyle={styles.outline}
          />

          <TextInput
  label="Category"
  mode="outlined"
  value={category}
  onChangeText={setCategory}
  style={styles.input}
  left={<TextInput.Icon icon="shape" />}
  outlineStyle={styles.outline}
/>

          <TextInput
            label="Phone Number"
            mode="outlined"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            outlineStyle={styles.outline}
          />

          <TextInput
            label="Business Address"
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
            outlineStyle={styles.outline}
          />

          <TextInput
            label="Business Description"
            mode="outlined"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            left={<TextInput.Icon icon="text" />}
            outlineStyle={styles.outline}
          />

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleSubmit}
          >
            Submit Application
          </Button>

        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },

  content: {
    padding: 22,
    paddingBottom: 40,
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  title: {
    marginTop: 15,
    fontSize: 32,
    fontWeight: "700",
    color: "#C2185B",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },

  card: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },

  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },

  outline: {
    borderRadius: 12,
  },

  button: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#7E57C2",
    paddingVertical: 6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});