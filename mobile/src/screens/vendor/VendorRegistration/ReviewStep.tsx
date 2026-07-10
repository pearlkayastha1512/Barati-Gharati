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
} from "react-native";

import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";

import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";
import { ReviewCard } from "../../../components/vendors/vendorRegistration/ReviewCard";
import { UploadImageCard } from "../../../components/vendors/vendorRegistration/UploadImageCard";

import { styles } from "./styles";

export default function ReviewStep() {
  const {
  account,
  business,
  gallery,
  prevStep,
  submitRegistration,
} = useVendorRegistrationStore();

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

     const response = await submitRegistration();

console.log(
  "Vendor registration response:",
  response,
);

      Alert.alert(
        "Success",
        "Vendor registration submitted successfully.",
      );
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

      <NavigationButtons
        onPrevious={prevStep}
        onNext={handleSubmit}
        nextLabel={
          submitting
            ? "Submitting..."
            : "Submit Registration"
        }
        nextDisabled={submitting}
      />
    </ScrollView>
  );
}