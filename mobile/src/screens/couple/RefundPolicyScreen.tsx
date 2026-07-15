import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function RefundPolicyScreen() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="15 July 2026"
      intro="This Refund Policy outlines how cancellations and refunds are handled for bookings made through Barati Gharati."
      sections={[
        {
          heading: "Cancellations by Couples",
          body: "You may cancel a booking from the Booking Details screen, subject to the individual vendor's cancellation policy shared at the time of booking. Refund eligibility for any advance or partial payment depends on how far in advance the cancellation is made.",
        },
        {
          heading: "Advance Payments",
          body: "Advance payments made to secure a booking are generally non-refundable once a vendor has accepted the booking, unless the vendor's specific policy states otherwise or the cancellation is initiated by the vendor.",
        },
        {
          heading: "Vendor-Initiated Cancellations",
          body: "If a vendor cancels or is unable to fulfil a confirmed booking, any amount paid will be eligible for a full refund, processed to your original payment method.",
        },
        {
          heading: "Refund Processing Time",
          body: "Approved refunds are typically processed within 7–10 business days, though actual credit to your account may depend on your bank or payment provider.",
        },
        {
          heading: "Disputes",
          body: "If you believe you are entitled to a refund that has not been issued, please contact us through Help & Support with your booking details, and our team will review the case with the vendor.",
        },
      ]}
    />
  );
}