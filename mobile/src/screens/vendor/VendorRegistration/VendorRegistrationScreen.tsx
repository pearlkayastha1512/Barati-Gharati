import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { StepIndicator } from "../../../components/vendors/vendorRegistration/StepIndicator";
import AccountStep from "./AccountStep";
import BusinessStep from "./BusinessStep";
import GalleryStep from "./GalleryStep";
import ReviewStep from "./ReviewStep";
import SuccessStep from "./Successstep";
import { styles } from "./styles";
import { View } from "react-native";

export default function VendorRegistrationScreen() {
  const step = useVendorRegistrationStore((state) => state.step);

  if (step === 5) {
    return <SuccessStep />;
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AccountStep />;
      case 2:
        return <BusinessStep />;
      case 3:
        return <GalleryStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <AccountStep />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <StepIndicator currentStep={step} />
      </View>
      {renderStep()}
    </SafeAreaView>
  );
}