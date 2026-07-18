// import React, { useState } from "react";
// import { ScrollView, View, Text } from "react-native";
// import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
// import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
// import RegistrationCard from "../../../components/vendors/vendorRegistration/RegistrationCard";
// import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
// import { CategoryDropdown } from "../../../components/vendors/vendorRegistration/CategoryDropdown";
// import { ReviewCard } from "../../../components/vendors/vendorRegistration/ReviewCard";
// import { UploadImageCard } from "../../../components/vendors/vendorRegistration/UploadImageCard";

// import { styles } from "./styles";

// // TODO: import API function once backend is connected
// // import { registerVendor } from "../../api/vendor.api";

// export default function ReviewStep() {
//   const { account, business, gallery, prevStep, nextStep } = useVendorRegistrationStore();
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     try {
//       // TODO: await registerVendor({ account, business, gallery });
//       // Simulated delay for now, since there's no real backend call yet:
//       await new Promise((resolve) => setTimeout(resolve, 600));
//       nextStep();
//     } catch (error) {
//       console.log("Vendor registration failed:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
//       <View style={{ marginBottom: 16 }}>
//         <SectionTitle title="Review Your Information" subtitle="Please verify everything before submitting." />
//       </View>

//       <ReviewCard
//         title="Account Information"
//         rows={[
//           { label: "Owner Name", value: account.ownerName },
//           { label: "Email", value: account.businessEmail },
//           { label: "Phone", value: account.phone },
//         ]}
//       />

//       <ReviewCard
//         title="Business Information"
//         rows={[
//           { label: "Business", value: business.businessName },
//           { label: "Category", value: business.category },
//           { label: "City", value: business.city },
//           { label: "Address", value: business.address },
//         ]}
//       />

//       {business.description ? (
//         <View style={styles.reviewCard}>
//           <Text style={styles.reviewCardTitle}>Description</Text>
//           <Text style={{ fontSize: 13, color: "#555", lineHeight: 19 }}>{business.description}</Text>
//         </View>
//       ) : null}

//       <View style={styles.reviewCard}>
//         <Text style={styles.reviewCardTitle}>Uploaded Images</Text>
//         <View style={styles.galleryRow}>
//           <UploadImageCard label="Profile Image" imageUri={gallery.profileImageUri} />
//           <UploadImageCard label="Cover Image" imageUri={gallery.coverImageUri} />
//         </View>
//       </View>

//       <NavigationButtons
//         onPrevious={prevStep}
//         onNext={handleSubmit}
//         nextLabel={submitting ? "Submitting..." : "Submit Registration"}
//         nextDisabled={submitting}
//       />
//     </ScrollView>
//   );
// }


import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";

import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
import { ReviewCard } from "../../../components/vendors/vendorRegistration/ReviewCard";
import { UploadImageCard } from "../../../components/vendors/vendorRegistration/UploadImageCard";

import { styles } from "./styles";
import { BadgePaymentModal } from "../../../components/vendors/vendorRegistration/BadgePaymentModal";
import { RazorpaySuccess } from "../../../types/payment";

const badgePlans = [
  { badge: "bronze" as const, label: "Bronze", monthlyPrice: 0, yearlyPrice: 0, limit: 5, color: "#B7791F", background: "#FFF7E6" },
  { badge: "silver" as const, label: "Silver", monthlyPrice: 999, yearlyPrice: 9990, limit: 15, color: "#64748B", background: "#F1F5F9" },
  { badge: "gold" as const, label: "Gold", monthlyPrice: 1999, yearlyPrice: 19990, limit: 50, color: "#A16207", background: "#FEF9C3" },
];

export default function ReviewStep() {
  const {
  account,
  business,
  gallery,
  selectedBadge,
  setSelectedBadge,
  badgeBillingCycle,
  setBadgeBillingCycle,
  registrationVerificationId,
  prevStep,
  submitRegistration,
} = useVendorRegistrationStore();

  const [submitting, setSubmitting] =
    useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<RazorpaySuccess | null>(null);

  const completeRegistration = async (payment?: RazorpaySuccess) => {
    const response = await submitRegistration(payment);
    console.log("Vendor registration response:", response);
    Alert.alert("Success", "Vendor registration submitted successfully.");
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (selectedBadge === "bronze") {
        await completeRegistration();
      } else if (completedPayment) {
        await completeRegistration(completedPayment);
      } else {
        setSubmitting(false);
        setPaymentOpen(true);
      }
    } catch (error: any) {
      console.log(
        "Vendor registration failed:",
        error?.response?.data,
      );

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message ??
          "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.stepScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 16 }}>
        <SectionTitle
          title="Review Your Information"
          subtitle="Please verify everything before submitting."
        />
      </View>

      <ReviewCard
        title="Account Information"
        rows={[
          {
            label: "Owner Name",
            value: account.ownerName,
          },
          {
            label: "Email",
            value: account.businessEmail,
          },
          {
            label: "Phone",
            value: account.phone,
          },
        ]}
      />

      <ReviewCard
        title="Business Information"
        rows={[
          {
            label: "Business",
            value: business.businessName,
          },
          {
            label: "Category",
            value: business.category,
          },
          {
            label: "City",
            value: business.city,
          },
          {
            label: "Address",
            value: business.address,
          },
        ]}
      />

      {business.description ? (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewCardTitle}>
            Description
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 19,
            }}
          >
            {business.description}
          </Text>
        </View>
      ) : null}

      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>
          Uploaded Images
        </Text>

        <View style={styles.galleryRow}>
          <UploadImageCard
            label="Profile Image"
            imageUri={gallery.profileImageUri}
          />

          <UploadImageCard
            label="Cover Image"
            imageUri={gallery.coverImageUri}
          />
        </View>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.badgeHeadingRow}>
          <MaterialIcons name="verified-user" size={22} color="#E4005A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewCardTitle}>Choose Your Vendor Badge</Text>
            <Text style={styles.badgeSubtitle}>Start free with Bronze or choose a paid plan for more monthly bookings.</Text>
          </View>
        </View>

        <View style={styles.billingToggle}>
          {(["monthly", "yearly"] as const).map((cycle) => (
            <TouchableOpacity
              key={cycle}
              disabled={submitting}
              onPress={() => setBadgeBillingCycle(cycle)}
              style={[
                styles.billingOption,
                badgeBillingCycle === cycle && styles.billingOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  badgeBillingCycle === cycle && styles.billingOptionTextActive,
                ]}
              >
                {cycle === "monthly" ? "Monthly" : "Yearly · 2 months free"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.badgeGrid}>
          {badgePlans.map((plan) => {
            const active = selectedBadge === plan.badge;
            const price = badgeBillingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <TouchableOpacity
                key={plan.badge}
                disabled={submitting}
                onPress={() => setSelectedBadge(plan.badge)}
                style={[
                  styles.badgePlan,
                  { backgroundColor: plan.background, borderColor: active ? "#E4005A" : plan.color },
                  active && styles.badgePlanActive,
                ]}
              >
                <View style={styles.badgePlanHeader}>
                  <Text style={[styles.badgePlanName, { color: plan.color }]}>{plan.label} Badge</Text>
                  {active && <MaterialIcons name="check-circle" size={20} color="#E4005A" />}
                </View>
                <Text style={styles.badgePrice}>{price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}</Text>
                {price > 0 && (
                  <Text style={styles.badgePeriod}>per {badgeBillingCycle === "monthly" ? "month" : "year"}</Text>
                )}
                <Text style={styles.badgeLimit}>Up to {plan.limit} bookings per month</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <NavigationButtons
        onPrevious={prevStep}
        onNext={handleSubmit}
        nextLabel={
          submitting
            ? "Submitting..."
            : selectedBadge === "bronze"
              ? "Submit Registration"
              : "Pay & Submit Registration"
        }
        nextDisabled={submitting}
      />
      {selectedBadge !== "bronze" && (
        <BadgePaymentModal
          visible={paymentOpen}
          badge={selectedBadge}
          billingCycle={badgeBillingCycle}
          registrationVerificationId={registrationVerificationId ?? ""}
          ownerName={account.ownerName}
          email={account.businessEmail}
          phone={account.phone}
          onClose={() => setPaymentOpen(false)}
          onPaid={async (payment) => {
            setCompletedPayment(payment);
            setSubmitting(true);
            try {
              await completeRegistration(payment);
            } catch (error) {
              setSubmitting(false);
              throw error;
            }
          }}
        />
      )}
    </ScrollView>
  );
}
