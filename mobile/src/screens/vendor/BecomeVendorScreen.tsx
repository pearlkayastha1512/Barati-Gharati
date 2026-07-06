import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View,TouchableOpacity} from "react-native";
import {
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";


export default function BecomeVendorScreen() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [accepted, setAccepted] = useState(false);
  

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
      <Card style={styles.uploadCard}>
  <TouchableOpacity
    style={styles.uploadArea}
    onPress={() => {}}
  >
    <MaterialCommunityIcons
      name="camera-plus"
      size={55}
      color="#C2185B"
    />

    <Text style={styles.uploadTitle}>
      Upload Business Logo
    </Text>
    <Text style={styles.sectionTitle}>
  Business Gallery
</Text>

<View style={styles.galleryContainer}>
  {[1, 2, 3, 4].map((item) => (
    <TouchableOpacity
      key={item}
      style={styles.galleryBox}
      onPress={() => {
        // TODO(API): Upload gallery image
      }}
    >
      <MaterialCommunityIcons
        name="image-plus"
        size={35}
        color="#C2185B"
      />

      <Text style={styles.galleryText}>
        Add Photo
      </Text>
    </TouchableOpacity>
  ))}
</View>
    <Text style={styles.uploadSubtitle}>
      JPG, PNG (Max 5 MB)
    </Text>
  </TouchableOpacity>
</Card>
<Text style={styles.sectionTitle}>
  Business Documents
</Text>

<TouchableOpacity
  style={styles.documentCard}
  onPress={() => {
    // TODO(API): Upload GST Certificate
  }}
>
  <MaterialCommunityIcons
    name="file-document-outline"
    size={28}
    color="#C2185B"
  />

  <View style={styles.documentInfo}>
    <Text style={styles.documentTitle}>
      GST Certificate
    </Text>

    <Text style={styles.documentSubtitle}>
      PDF / JPG / PNG
    </Text>
  </View>

  <MaterialCommunityIcons
    name="upload"
    size={24}
    color="#999"
  />
</TouchableOpacity>

<TouchableOpacity
  style={styles.documentCard}
  onPress={() => {
    // TODO(API): Upload Business License
  }}
>
  <MaterialCommunityIcons
    name="file-document-outline"
    size={28}
    color="#C2185B"
  />

  <View style={styles.documentInfo}>
    <Text style={styles.documentTitle}>
      Business License
    </Text>

    <Text style={styles.documentSubtitle}>
      PDF / JPG / PNG
    </Text>
  </View>

  <MaterialCommunityIcons
    name="upload"
    size={24}
    color="#999"
  />
</TouchableOpacity>

<TouchableOpacity
  style={styles.documentCard}
  onPress={() => {
    // TODO(API): Upload PAN / Aadhaar
  }}
>
  <MaterialCommunityIcons
    name="card-account-details-outline"
    size={28}
    color="#C2185B"
  />

  <View style={styles.documentInfo}>
    <Text style={styles.documentTitle}>
      PAN / Aadhaar
    </Text>

    <Text style={styles.documentSubtitle}>
      PDF / JPG / PNG
    </Text>
  </View>

  <MaterialCommunityIcons
    name="upload"
    size={24}
    color="#999"
  />
</TouchableOpacity>
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
          <View style={styles.checkboxContainer}>
  <Checkbox
    status={accepted ? "checked" : "unchecked"}
    onPress={() => setAccepted(!accepted)}
    color="#C2185B"
  />

  <Text style={styles.checkboxText}>
    I agree to the Terms & Conditions
  </Text>
</View>
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
  marginTop: 15,
  borderRadius: 14,
  backgroundColor: "#C2185B",
  paddingVertical: 8,
},

  buttonText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#fff",
},
  uploadCard: {
  marginBottom: 25,
  borderRadius: 18,
  elevation: 3,
  backgroundColor: "#fff",
},

uploadArea: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 35,
  borderWidth: 2,
  borderStyle: "dashed",
  borderColor: "#E8B5C9",
  borderRadius: 18,
},

uploadTitle: {
  marginTop: 12,
  fontSize: 17,
  fontWeight: "700",
  color: "#C2185B",
},

uploadSubtitle: {
  marginTop: 5,
  color: "#777",
},
sectionTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
  marginBottom: 15,
},

galleryContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 25,
},

galleryBox: {
  width: "48%",
  height: 120,
  borderWidth: 2,
  borderStyle: "dashed",
  borderColor: "#E8B5C9",
  borderRadius: 15,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
  backgroundColor: "#fff",
},

galleryText: {
  marginTop: 8,
  color: "#666",
  fontSize: 13,
},
checkboxContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 5,
  marginBottom: 20,
},

checkboxText: {
  flex: 1,
  color: "#555",
  fontSize: 14,
},
documentCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 16,
  borderRadius: 14,
  marginBottom: 12,
  elevation: 2,
},

documentInfo: {
  flex: 1,
  marginLeft: 15,
},

documentTitle: {
  fontWeight: "700",
  fontSize: 15,
  color: "#333",
},

documentSubtitle: {
  marginTop: 3,
  color: "#777",
  fontSize: 13,
},
});