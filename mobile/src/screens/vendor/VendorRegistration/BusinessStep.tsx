import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import RegistrationCard from "../../../components/vendors/vendorRegistration/RegistrationCard";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
import { CategoryDropdown } from "../../../components/vendors/vendorRegistration/CategoryDropdown";

import { styles } from "./styles";

export default function BusinessStep() {
  const { business, setBusiness, nextStep, prevStep } = useVendorRegistrationStore();
  const [businessName, setBusinessName] = useState(business.businessName);
  const [category, setCategory] = useState(business.category);
  const [city, setCity] = useState(business.city);
  const [address, setAddress] = useState(business.address);
  const [description, setDescription] = useState(business.description);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!businessName.trim() || !category || !city.trim() || !address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setBusiness({ businessName, category, city, address, description });
    nextStep();
  };

  return (
    <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
      <RegistrationCard>
        <SectionTitle title="Business Information" subtitle="Tell customers about your business." />

        <Text style={styles.label}>Business Name</Text>
        <TextInput
          mode="outlined"
          placeholder="Royal Palace Banquets"
          value={businessName}
          onChangeText={setBusinessName}
          style={styles.input}
          left={<TextInput.Icon icon="store-outline" />}
        />

        <Text style={styles.label}>Category</Text>
        <CategoryDropdown value={category} onSelect={setCategory} />

        <Text style={styles.label}>City</Text>
        <TextInput
          mode="outlined"
          placeholder="Noida"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          left={<TextInput.Icon icon="map-marker-outline" />}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          mode="outlined"
          placeholder="Sector 62, Noida"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          left={<TextInput.Icon icon="map-marker-outline" />}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          mode="outlined"
          placeholder="Tell couples about your services..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
          left={<TextInput.Icon icon="text" />}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <NavigationButtons onPrevious={prevStep} onNext={handleContinue} />
      </RegistrationCard>
    </ScrollView>
  );
}