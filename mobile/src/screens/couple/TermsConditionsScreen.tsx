import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function TermsConditionsScreen() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="15 July 2026"
      intro="By creating an account and using Barati Gharati, you agree to the following terms and conditions."
      sections={[
        {
          heading: "Use of the Platform",
          body: "Barati Gharati connects couples with independent wedding vendors. We facilitate discovery, booking, and payment, but each vendor is solely responsible for the quality and delivery of their services.",
        },
        {
          heading: "Account Responsibility",
          body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
        },
        {
          heading: "Bookings & Payments",
          body: "When you book a vendor through the app, you agree to pay any advance and remaining amounts as specified in the booking. Payment terms, cancellation, and refund conditions may vary by vendor and booking, subject to our Refund Policy.",
        },
        {
          heading: "Vendor Conduct",
          body: "Vendors listed on the platform undergo a verification process, but Barati Gharati does not guarantee the conduct, availability, or performance of any individual vendor.",
        },
        {
          heading: "Limitation of Liability",
          body: "Barati Gharati is not liable for any disputes, damages, or losses arising directly between couples and vendors, beyond facilitating the booking and payment process.",
        },
        {
          heading: "Changes to These Terms",
          body: "We may update these Terms & Conditions from time to time. Continued use of the app after changes are made constitutes acceptance of the updated terms.",
        },
      ]}
    />
  );
}