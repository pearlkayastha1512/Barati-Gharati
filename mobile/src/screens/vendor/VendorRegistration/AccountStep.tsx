import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import RegistrationCard from "../../../components/vendors/vendorRegistration/RegistrationCard";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
import { CategoryDropdown } from "../../../components/vendors/vendorRegistration/CategoryDropdown";

import { styles } from "./styles";
import {
  startVendorRegistrationVerification,
  verifyVendorRegistrationOtp,
} from "../../../api/vendor.api";

export default function AccountStep() {
  const { account, setAccount, nextStep, setRegistrationVerificationId } = useVendorRegistrationStore();
  const [ownerName, setOwnerName] = useState(account.ownerName);
  const [businessEmail, setBusinessEmail] = useState(account.businessEmail);
  const [phone, setPhone] = useState(account.phone);
  const [password, setPassword] = useState(account.password);
  const [confirmPassword, setConfirmPassword] = useState(account.confirmPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerificationId, setPendingVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!ownerName.trim() || !businessEmail.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (!pendingVerificationId) {
        const result = await startVendorRegistrationVerification({
          ownerName,
          email: businessEmail,
          phone,
        });
        setPendingVerificationId(result.verificationId);
        return;
      }
      if (!/^\d{6}$/.test(otp)) {
        setError("Enter the 6-digit OTP sent to your email.");
        return;
      }
      await verifyVendorRegistrationOtp(pendingVerificationId, otp);
      setAccount({ ownerName, businessEmail, phone, password, confirmPassword });
      setRegistrationVerificationId(pendingVerificationId);
      nextStep();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? reason?.message ?? "Verification failed.");
    } finally {
      setLoading(false);
    }
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
          onChangeText={(value) => {
            setBusinessEmail(value);
            setPendingVerificationId(null);
            setRegistrationVerificationId(null);
          }}
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
          onChangeText={(value) => {
            setPhone(value);
            setPendingVerificationId(null);
            setRegistrationVerificationId(null);
          }}
          keyboardType="phone-pad"
          style={styles.input}
          left={<TextInput.Icon icon="phone-outline" />}
        />

        {pendingVerificationId ? (
          <>
            <Text style={styles.label}>Email OTP</Text>
            <TextInput
              mode="outlined"
              placeholder="6-digit OTP"
              value={otp}
              onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              style={styles.input}
              left={<TextInput.Icon icon="shield-check-outline" />}
            />
          </>
        ) : null}

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

        <NavigationButtons
          showPrevious={false}
          onNext={() => void handleContinue()}
          nextLabel={loading ? "Please wait..." : pendingVerificationId ? "Verify & Continue" : "Send Email OTP"}
          nextDisabled={loading}
        />
      </RegistrationCard>
    </ScrollView>
  );
}
