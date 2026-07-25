import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function TermsConditionsScreen() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="1 August 2026"
      intro={`Welcome to Barati Gharati ("Platform", "Website", "Application", "we", "our", or "us"). These Terms & Conditions ("Terms") govern your access to and use of the Barati Gharati website, mobile applications, APIs, and all related services operated by True Knock Industries Private Limited. By accessing, browsing, registering, or using Barati Gharati, you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions.`}
      sections={[
        {
          heading: "1. About Barati Gharati",
          body: "Barati Gharati is an online Wedding Marketplace and Wedding Technology (Wed-Tech) Platform that enables users to search, discover, compare, communicate with, and connect with independent wedding vendors including wedding venues, banquet halls, wedding planners, photographers, videographers, makeup artists, mehendi artists, decorators, caterers, DJs, live bands, sufi bands, celebrity artists, choreographers, bridal wear designers, groom wear designers, jewellery vendors, invitation designers, travel services, wedding transportation, wedding website services, budget planning tools, guest management tools, and other wedding-related service providers. Barati Gharati is solely a technology platform and marketplace that connects users with independent vendors.",
        },
        {
          heading: "2. Platform Nature",
          body: "Barati Gharati does not own, operate, manage, employ, supervise, endorse, or control any vendor listed on the Platform. Each vendor operates as an independent business entity. The Platform only facilitates discovery and communication between users and vendors.",
        },
        {
          heading: "3. Eligibility",
          body: "You must be at least 18 years of age, have legal capacity to enter into contracts, provide accurate information, and use the Platform only for lawful purposes.",
        },
        {
          heading: "4. User Accounts",
          body: "Users may create accounts as a couple, bride, groom, family member, wedding planner, vendor, business, or organization. Users are responsible for maintaining password confidentiality, all activities performed under their account, and updating information whenever necessary.",
        },
        {
          heading: "5. Vendor Listings",
          body: "Vendor information displayed on the Platform may include business name, contact details, portfolio, pricing, reviews, ratings, availability, service areas, and business description. Although Barati Gharati may verify certain information, such verification does not guarantee the vendor's identity, capability, quality of work, licensing status, legal compliance, reliability, or future performance. Users are solely responsible for conducting their own due diligence before hiring any vendor.",
        },
        {
          heading: "6. Direct Communication with Vendors",
          body: "Barati Gharati provides vendor contact details solely for facilitating communication. Once a user obtains or is provided with any vendor's mobile number, WhatsApp number, email address, website, social media profile, office address, or any other contact information, all future communications, negotiations, quotations, agreements, bookings, modifications, cancellations, and transactions shall be solely between the user and the respective vendor. Barati Gharati shall have no responsibility, obligation, or liability in relation to such communications or agreements.",
        },
        {
          heading: "7. Direct Payments to Vendors",
          body: "If a user chooses to make any payment directly to a vendor — including advance payment, token amount, booking amount, security deposit, full payment, cash, UPI, bank transfer, credit card, debit card, wallet, QR code payment, or any other payment method — such payment is made entirely at the user's own discretion and risk. Barati Gharati is not a party to such payment transactions.",
        },
        {
          heading: "7A. Lead Generation & Vendor Acknowledgement",
          body: "Barati Gharati provides a technology platform that enables vendors to receive inquiries and potential business opportunities from registered users, couples, families, wedding planners, administrators, marketing campaigns, referrals, or other lawful sources. The Platform does not guarantee a minimum number of leads, conversion of leads into bookings, revenue generation, business growth, lead quality or authenticity, accuracy of information submitted by users, or that every lead will result in a successful transaction. Each vendor understands and agrees that every inquiry is only a potential lead and that conversion into a confirmed booking depends entirely upon the vendor's own communication, pricing, service quality, availability, and negotiations with the customer.",
        },
        {
          heading: "7B. Vendor Lead Refund Policy",
          body: "Whether a lead is received directly from a user or couple, through Barati Gharati's website or mobile application, through Barati Gharati's sales or support team, through advertisements, marketing campaigns, referrals, promotional activities, or administrative assignment, or through WhatsApp, telephone, email, social media, or any other communication channel, all such leads shall be considered successfully delivered once the vendor receives the customer's inquiry or contact details. Under no circumstances shall Barati Gharati or True Knock Industries Private Limited be obligated to refund any amount paid by a vendor for subscription plans, premium memberships, featured listings, lead packages, lead credits, promotional services, advertising campaigns, profile verification, profile boosting, sponsored listings, or any other paid service offered by the Platform. Lead conversion remains solely the responsibility of the vendor.",
        },
        {
          heading: "7C. No Guarantee of Business",
          body: "Barati Gharati makes no representation or warranty that any vendor will receive bookings, earn any specific income, recover subscription costs, achieve any particular business results, or obtain any minimum number of customers. Any business generated through the Platform depends upon multiple independent factors beyond the control of Barati Gharati.",
        },
        {
          heading: "7D. Vendor Subscription & Premium Plans",
          body: "Barati Gharati may offer various paid services including premium vendor plans, featured listings, verified vendor badges, promotional campaigns, homepage placement, advertising packages, white-label services, CRM services, and additional premium features. The features, pricing, benefits, duration, limitations, eligibility criteria, and availability of such plans may be modified, upgraded, downgraded, suspended, or discontinued at any time at the sole discretion of Barati Gharati.",
        },
        {
          heading: "7E. Premium Plans Subject to Change",
          body: "All premium plans, memberships, pricing, features, benefits, commissions, lead allocation policies, subscription fees, service inclusions, platform functionality, promotional offers, and commercial terms are subject to change, modification, suspension, replacement, or discontinuation at any time without prior notice. Such changes shall become effective upon publication on the Platform or otherwise communicated by Barati Gharati, unless stated otherwise. Continued use of the Platform after any such change constitutes acceptance of the revised terms.",
        },
        {
          heading: "7F. No Refund for Vendor Subscriptions",
          body: "Except where expressly required by applicable law, all payments made by vendors towards subscriptions, memberships, premium plans, featured listings, advertising services, lead packages, verification services, promotional services, or any other paid offering are final and non-refundable. No refunds, credits, or adjustments shall be provided on the grounds of unsatisfactory lead conversion, fewer inquiries than expected, business performance, customer cancellation, customer non-response, customer misconduct, changes in market conditions, vendor dissatisfaction, temporary suspension due to policy violations, or any other commercial reason.",
        },
        {
          heading: "8. No Refund for Direct Vendor Payments",
          body: "If users directly contact or transact with vendors, Barati Gharati shall not refund any amount, recover any payment, mediate financial disputes, compensate users, or guarantee vendor refunds. All refund requests must be resolved directly with the concerned vendor.",
        },
        {
          heading: "9. Marketplace Disclaimer",
          body: "Barati Gharati only provides vendor listings, search features, marketplace technology, budget planning tools, wedding planning tools, a wedding website builder, vendor discovery, lead generation, and communication features. Barati Gharati does not provide the actual wedding services.",
        },
        {
          heading: "10. Booking Disclaimer",
          body: "Any booking made with a vendor is an independent agreement between the user and the vendor. Barati Gharati shall not be responsible for vendor cancellation, vendor delay, poor service, misconduct, non-performance, event cancellation, pricing disputes, quality disputes, misrepresentation, fraud, overbooking, or unavailability.",
        },
        {
          heading: "11. Reviews & Ratings",
          body: "Users may submit reviews based on genuine experiences. Barati Gharati reserves the right to remove reviews that are false, misleading, offensive, defamatory, spam, promotional, or illegal. The Platform does not guarantee the accuracy of user-generated reviews.",
        },
        {
          heading: "12. Vendor Responsibilities",
          body: "Each vendor is solely responsible for licenses, registrations, taxes, GST compliance, employees, contracts, deliverables, pricing, safety standards, insurance, and professional conduct.",
        },
        {
          heading: "13. User Responsibilities",
          body: "Users agree to provide accurate booking information, respect vendors, avoid fraudulent activities, not misuse the Platform, and comply with applicable laws.",
        },
        {
          heading: "14. Prohibited Activities",
          body: "Users shall not post false information, upload illegal content, harass vendors, spam users, scrape data, copy website content, use bots without authorization, attempt unauthorized access, or interfere with Platform operations.",
        },
        {
          heading: "15. Intellectual Property",
          body: "All content including logos, brand names, software, source code, graphics, icons, layouts, databases, images, designs, videos, and documents are owned by Barati Gharati, True Knock Industries Private Limited, or their respective owners. No content may be copied, reproduced, or redistributed without prior written permission.",
        },
        {
          heading: "16. Privacy",
          body: "Your use of the Platform is also governed by our Privacy Policy.",
        },
        {
          heading: "17. Cookies",
          body: "By using Barati Gharati, you consent to the use of cookies in accordance with our Cookies Policy.",
        },
        {
          heading: "18. Third-Party Services",
          body: "The Platform may integrate with third-party services such as Google Maps, payment gateways, WhatsApp, YouTube, Vimeo, social media platforms, and analytics providers. Barati Gharati is not responsible for third-party services or their availability.",
        },
        {
          heading: "19. Force Majeure",
          body: "Barati Gharati shall not be liable for delays or failures resulting from events beyond reasonable control including natural disasters, fire, flood, pandemic, government orders, war, terrorism, internet failures, power outages, cyber attacks, and technical failures.",
        },
        {
          heading: "20. Limitation of Liability",
          body: "To the fullest extent permitted by applicable law, Barati Gharati, its parent company, affiliates, directors, officers, employees, partners, licensors, and agents shall not be liable for any direct, indirect, consequential, incidental, special, or punitive damages, financial loss, property damage, personal injury, emotional distress, loss of opportunity, or business interruption arising from vendor services, third-party actions, user conduct, Platform usage, or technical errors. If any liability is established despite the foregoing, Barati Gharati's total aggregate liability shall not exceed the amount, if any, actually paid by the user directly to Barati Gharati for using the Platform during the twelve (12) months immediately preceding the event giving rise to the claim.",
        },
        {
          heading: "21. Indemnification",
          body: "Users and vendors agree to indemnify and hold harmless Barati Gharati, True Knock Industries Private Limited, its directors, officers, employees, affiliates, agents, licensors, and partners from and against any claims, liabilities, damages, losses, costs, and legal expenses arising from violation of these Terms, misuse of the Platform, disputes between users and vendors, infringement of third-party rights, or unlawful conduct.",
        },
        {
          heading: "22. Suspension & Termination",
          body: "Barati Gharati reserves the right to suspend or terminate any account, listing, or access without prior notice if a user or vendor violates these Terms, engages in fraudulent or unlawful activities, misuses the Platform, harasses other users, uploads prohibited content, or attempts to compromise the security or integrity of the Platform.",
        },
        {
          heading: "23. Changes to These Terms",
          body: "Barati Gharati may modify these Terms at any time. Updated Terms will be published on the Platform with a revised \"Last Updated\" date. Continued use of the Platform after such changes constitutes acceptance of the revised Terms.",
        },
        {
          heading: "23A. Changes to Platform Services",
          body: "Barati Gharati continuously improves and updates its platform. Accordingly, we reserve the right to add or remove features, introduce new services, modify existing functionality, change pricing, update subscription plans, alter eligibility criteria, revise lead allocation methods, introduce or discontinue promotional programs, modify user interfaces, and update operational policies, at any time without prior notice, unless otherwise required by applicable law.",
        },
        {
          heading: "23B. Responsibility to Review Policies",
          body: "Users and vendors are responsible for periodically reviewing the Terms & Conditions, Terms of Use, Privacy Policy, Refund Policy, Cancellation Policy, Community Guidelines, Vendor Policy, Payment Policy, and any other applicable legal documents published on the Platform before registering, subscribing, making payments, or continuing to use the Platform. Continued access to or use of the Platform shall constitute acceptance of the latest versions of all applicable policies.",
        },
        {
          heading: "24. Governing Law & Jurisdiction",
          body: "These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or relating to these Terms shall first be attempted to be resolved amicably. Failing such resolution, disputes shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. Subject to applicable law, the courts having jurisdiction over the registered office of True Knock Industries Private Limited shall have exclusive jurisdiction.",
        },
        {
          heading: "25. Contact Information",
          body: "For questions regarding these Terms & Conditions, please contact Barati Gharati (a brand of True Knock Industries Private Limited).\n\nRegistered Office: Office No. 2, Chamber 4, Udaigiri Tower, Kaushambi, Ghaziabad, Uttar Pradesh – 201010, India\n\nWebsite: www.baratigharati.com\nEmail: legal@baratigharati.com / support@baratigharati.com",
        },
        {
          heading: "Note – No Agency Relationship",
          body: "Nothing contained on the Platform or in these Terms shall be construed as creating any partnership, joint venture, employment, franchise, agency, fiduciary, or representative relationship between Barati Gharati (or True Knock Industries Private Limited) and any vendor, user, couple, advertiser, or third party. Each vendor operates independently and is solely responsible for its own business activities, services, contracts, representations, tax obligations, statutory compliances, employees, and dealings with customers.",
        },
      ]}
    />
  );
}