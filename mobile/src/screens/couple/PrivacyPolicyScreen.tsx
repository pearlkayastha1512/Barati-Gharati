import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function PrivacyPolicyScreen() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="15 July 2026"
      intro="This Privacy Policy explains how Barati Gharati collects, uses, and protects your personal information when you use our app."
      sections={[
        {
          heading: "Information We Collect",
          body: "We collect information you provide directly, such as your name, email, phone number, and wedding details, as well as information generated through your use of the app, such as bookings, wishlist items, and messages with vendors.",
        },
        {
          heading: "How We Use Your Information",
          body: "Your information is used to create and manage your account, process bookings and payments, connect you with vendors, send booking and payment notifications, and improve our services.",
        },
        {
          heading: "Sharing With Vendors",
          body: "When you make a booking or send an inquiry, relevant contact and event details are shared with the vendor to allow them to fulfil your booking.",
        },
        {
          heading: "Data Security",
          body: "We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, or disclosure.",
        },
        {
          heading: "Your Choices",
          body: "You can review and update your profile information at any time from Settings. You may also contact us to request deletion of your account and associated data, subject to any legal or contractual retention requirements.",
        },
        {
          heading: "Contact Us",
          body: "If you have any questions about this Privacy Policy, please reach out via the Help & Support section of the app.",
        },
      ]}
    />
  );
}