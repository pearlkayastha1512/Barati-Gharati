import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function AboutUsScreen() {
  return (
    <LegalPageLayout
      title="About Us"
      lastUpdated="15 July 2026"
      intro="Barati Gharati is an end-to-end wedding planning platform connecting couples with trusted vendors, and helping them manage bookings, budgets, and every detail of their big day in one place."
      sections={[
        {
          heading: "Our Mission",
          body: "We built Barati Gharati to take the stress out of wedding planning — from discovering verified vendors across categories like photography, catering, decor, and venues, to tracking bookings and payments, all from a single app.",
        },
        {
          heading: "What We Offer",
          body: "Couples can browse and compare vendors by city and category, save favorites to a wishlist, book packages directly, track payments and booking status, and manage a personalized wedding planning checklist and budget tracker.",
        },
        {
          heading: "For Vendors",
          body: "We also empower wedding vendors with tools to showcase their work, manage bookings and availability, communicate with couples, and grow their business through our platform.",
        },
        {
          heading: "Get In Touch",
          body: "Have questions or feedback? Reach out to us anytime through the Help & Support section — our team is always happy to help.",
        },
      ]}
    />
  );
}