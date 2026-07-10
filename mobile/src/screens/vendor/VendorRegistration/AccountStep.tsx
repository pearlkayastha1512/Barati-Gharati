import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import RegistrationCard from "../../../components/vendors/vendorRegistration/RegistrationCard";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
import { CategoryDropdown } from "../../../components/vendors/vendorRegistration/CategoryDropdown";

import { styles } from "./styles";

export default function AccountStep() {
  const { account, setAccount, nextStep } = useVendorRegistrationStore();
  const [ownerName, setOwnerName] = useState(account.ownerName);
  const [businessEmail, setBusinessEmail] = useState(account.businessEmail);
  const [phone, setPhone] = useState(account.phone);
  const [password, setPassword] = useState(account.password);
  const [confirmPassword, setConfirmPassword] = useState(account.confirmPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!ownerName.trim() || !businessEmail.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setAccount({ ownerName, businessEmail, phone, password, confirmPassword });
    nextStep();
  };

  return (
    <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
      <RegistrationCard>
        <SectionTitle title="Account Information" subtitle="Let's create your vendor account first." />

        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          mode="outlined"
          placeholder="John Doe"
          value={ownerName}
          onChangeText={setOwnerName}
          style={styles.input}
          left={<TextInput.Icon icon="account-outline" />}
        />

        <Text style={styles.label}>Business Email</Text>
        <TextInput
          mode="outlined"
          placeholder="vendor@email.com"
          value={businessEmail}
          onChangeText={setBusinessEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          left={<TextInput.Icon icon="email-outline" />}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          mode="outlined"
          placeholder="+91 9876543210"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          left={<TextInput.Icon icon="phone-outline" />}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          mode="outlined"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          mode="outlined"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          left={<TextInput.Icon icon="lock-outline" />}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <NavigationButtons showPrevious={false} onNext={handleContinue} />
      </RegistrationCard>
    </ScrollView>
  );
}