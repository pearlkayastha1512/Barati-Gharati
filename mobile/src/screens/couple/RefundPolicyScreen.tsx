import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function RefundPolicyScreen() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      lastUpdated="1 August 2026"
      intro={`This Refund Policy governs all payments made on or through Barati Gharati ("Platform"), a brand owned and operated by True Knock Industries Private Limited. By accessing, registering, subscribing, purchasing, or using any services offered by Barati Gharati, you acknowledge that you have read, understood, and agreed to this Refund Policy.`}
      sections={[
        {
          heading: "1. Nature of the Platform",
          body: "Barati Gharati is a technology platform and wedding marketplace that connects users, couples, families, and event organizers with independent wedding vendors. Barati Gharati does not provide wedding services directly and is not a party to any agreement entered into between a user and a vendor unless expressly stated otherwise.",
        },
        {
          heading: "2. General Refund Policy",
          body: "Unless otherwise expressly stated in writing by Barati Gharati, all payments made to Barati Gharati are non-refundable. Refunds shall only be provided where required under applicable law or where Barati Gharati, at its sole discretion, approves a refund.",
        },
        {
          heading: "3. No Refund for Direct Vendor Payments",
          body: "If a user or couple makes any payment directly to a vendor — including advance payment, token amount, booking amount, security deposit, partial payment, full payment, cash, UPI, bank transfer, cheque, debit card, credit card, QR code payment, wallet payment, or any other payment method — Barati Gharati shall not refund any amount, recover any payment, mediate financial disputes, guarantee refunds, compensate users, or assume responsibility for such payments. Any refund request relating to payments made directly to a vendor must be resolved solely between the user and the respective vendor.",
        },
        {
          heading: "4. Direct Communication Disclaimer",
          body: "Once a user obtains a vendor's mobile number, WhatsApp number, email address, website, social media profile, office address, or any other contact information and communicates directly with the vendor, all negotiations, quotations, contracts, bookings, payments, cancellations, modifications, disputes, and refund matters become solely the responsibility of the user and the vendor. Barati Gharati shall not be liable for any loss, damage, dispute, or refund arising from such direct interactions.",
        },
        {
          heading: "5. Vendor Subscription & Premium Plan Refunds",
          body: "All payments made by vendors for premium memberships, subscription plans, featured listings, sponsored listings, advertisements, vendor verification, lead packages, promotional campaigns, profile boost services, white-label services, CRM services, or additional premium features are final and non-refundable, except where required by applicable law.",
        },
        {
          heading: "6. Lead-Based Services",
          body: "Barati Gharati may provide business inquiries or leads to vendors through website inquiries, the mobile application, couples, families, event organizers, marketing campaigns, referrals, the sales team, administrative allocation, WhatsApp, email, telephone, or any other lawful communication channel. Once a lead has been delivered or the customer's contact details have been shared with the vendor, the service shall be deemed successfully provided. No refund shall be issued on the grounds that the lead did not convert into a booking, the customer did not respond or cancelled, the customer selected another vendor, the vendor was unavailable or dissatisfied with the lead, the vendor expected more inquiries, the lead was outside expectations, or business goals were not achieved. Lead conversion depends on multiple factors beyond the control of Barati Gharati.",
        },
        {
          heading: "7. No Refund for Business Performance",
          body: "Barati Gharati does not guarantee sales, bookings, revenue, profit, customer acquisition, business growth, or return on investment. Accordingly, subscription fees or promotional charges shall not be refunded due to business performance or commercial expectations.",
        },
        {
          heading: "8. Premium Plans & Pricing",
          body: "Barati Gharati may revise, modify, suspend, discontinue, or replace subscription plans, premium memberships, pricing, features, benefits, services, commercial terms, lead allocation methods, or promotional offers at any time without prior notice, unless otherwise required by applicable law. Such changes shall not entitle users or vendors to any refund for payments already made.",
        },
        {
          heading: "9. Duplicate Payments",
          body: "If a payment is successfully processed more than once due to a technical error, Barati Gharati may, after verification, refund or adjust the duplicate amount at its sole discretion.",
        },
        {
          heading: "10. Failed Transactions",
          body: "If an amount is debited from your account but the transaction is unsuccessful due to a technical failure, payment gateway issue, banking error, or network interruption, the amount may automatically be reversed by your bank or payment provider. If not reversed within the applicable banking timelines, you may contact our support team with the transaction details for verification.",
        },
        {
          heading: "11. Promotional Offers",
          body: "Payments made under discount campaigns, limited-time offers, promotional packages, coupon codes, special pricing, or festival offers shall remain subject to this Refund Policy unless expressly stated otherwise in the offer terms.",
        },
        {
          heading: "12. Chargebacks",
          body: "Users and vendors agree not to initiate fraudulent chargebacks or payment disputes after receiving services, subscriptions, leads, listings, or platform benefits. Barati Gharati reserves the right to suspend accounts, terminate subscriptions, recover outstanding amounts, contest fraudulent chargebacks, and initiate legal proceedings where appropriate.",
        },
        {
          heading: "13. Platform Suspension",
          body: "If an account is suspended or terminated due to violation of Terms & Conditions, fraudulent activity, misuse of the Platform, abuse, illegal conduct, spam, fake reviews, or other policy violations, no refund shall be payable for any remaining subscription period or unused services.",
        },
        {
          heading: "14. Events Beyond Our Control",
          body: "No refund shall be payable due to natural disasters, flood, fire, pandemic, government restrictions, war, civil unrest, internet outages, power failures, technical failures, or other force majeure events.",
        },
        {
          heading: "15. Refund Exceptions",
          body: "Barati Gharati may consider refunds only where required by applicable law, a duplicate payment has been verified, a billing error attributable solely to Barati Gharati has been confirmed, or another exceptional circumstance exists that Barati Gharati, in its sole discretion, determines warrants a refund. Approval of one refund request does not create any obligation to approve future requests.",
        },
        {
          heading: "16. Responsibility to Read Policies",
          body: "Users and vendors are responsible for reviewing the Terms & Conditions, Terms of Use, Privacy Policy, Cancellation Policy, Community Guidelines, Vendor Policy, Payment Policy, this Refund Policy, and any other policies published on the Platform before making any payment or using the Platform. Failure to review these policies shall not be a ground for claiming a refund.",
        },
        {
          heading: "17. Limitation of Liability",
          body: "Barati Gharati and True Knock Industries Private Limited shall not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages arising from vendor services, direct dealings between users and vendors, payment disputes, booking cancellations, business losses, or any third-party actions.",
        },
        {
          heading: "18. Changes to this Refund Policy",
          body: "Barati Gharati reserves the right to modify, amend, or update this Refund Policy at any time without prior notice. The latest version will be published on the Platform, and continued use of the Platform constitutes acceptance of the revised policy.",
        },
        {
          heading: "19. Governing Law",
          body: "This Refund Policy shall be governed by the laws of India. Any dispute relating to refunds shall be subject to the dispute resolution provisions contained in the Terms & Conditions and the exclusive jurisdiction of the courts having jurisdiction over the registered office of True Knock Industries Private Limited, subject to applicable law.",
        },
        {
          heading: "20. Contact Us",
          body: "For refund-related queries, please contact Barati Gharati (a brand of True Knock Industries Private Limited).\n\nRegistered Office: Office No. 2, Chamber 4, Udaigiri Tower, Kaushambi, Ghaziabad, Uttar Pradesh – 201010, India\n\nWebsite: www.baratigharati.com\nEmail: billing@baratigharati.com | support@baratigharati.com",
        },
        {
          heading: "Important Notice",
          body: "Barati Gharati is a marketplace and technology platform, not a wedding service provider. All agreements entered into directly between users and vendors are solely their responsibility. No refund shall be provided by Barati Gharati for payments, advances, token amounts, deposits, or other sums paid directly to vendors. Vendor subscriptions, premium plans, featured listings, lead packages, and promotional services are non-refundable, except where required by applicable law. Users and vendors are advised to carefully read all applicable policies, including the Terms & Conditions and Terms of Use, before registering, subscribing, or making any payment on the Platform.",
        },
      ]}
    />
  );
}