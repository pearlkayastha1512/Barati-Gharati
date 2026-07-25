import React from "react";
import { LegalPageLayout } from "../../components/users/legal/LegalPageLayout";

export default function PrivacyPolicyScreen() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="1 August 2026"
      intro={`Barati Gharati ("Platform", "Website", "Application", "we", "our", or "us"), a brand owned and operated by True Knock Industries Private Limited, values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, process, store, disclose, and protect your information when you access or use our website, mobile applications, APIs, products, and services. By accessing or using Barati Gharati, you consent to this Privacy Policy.`}
      sections={[
        {
          heading: "1. About Us",
          body: "Barati Gharati is a Wedding Marketplace and Wedding Technology (Wed-Tech) Platform that connects couples, families, wedding planners, and other users with independent wedding vendors and service providers. We are a technology platform and do not provide wedding services directly.",
        },
        {
          heading: "2. Information We Collect",
          body: "Depending on how you use the Platform, we may collect: Personal Information (full name, bride name, groom name, business name, email address, mobile number, alternate contact number, date of birth where applicable, gender, address, city, state, country, postal code, profile photograph); Wedding Information (wedding date, engagement date, reception date, guest count, budget, wedding location, wedding preferences, shortlisted vendors, wedding checklist data, guest list information, wedding website content, event timeline); Vendor Information if you register as a vendor (business name, business category, business registration details, GST number, PAN, bank details, office address, service areas, pricing, portfolio, business description, website, social media links, verification documents); Technical Information collected automatically (IP address, browser type, device information, operating system, session data, cookies, referring URL, clickstream data, search history, device identifiers, mobile app information); and Payment Information — where payments are processed through the Platform, transactions are generally handled by third-party payment gateways, and we do not store complete debit card, credit card, CVV, UPI PIN, net banking passwords, or other sensitive payment credentials on our servers.",
        },
        {
          heading: "3. How We Use Your Information",
          body: "We use your information to create and manage accounts, connect users with vendors, display vendor profiles, facilitate communication, provide customer support, verify vendors, process subscriptions, improve platform functionality, personalize user experience, generate analytics, send notifications, send transactional emails and SMS, improve search results, prevent fraud, maintain security, and comply with legal obligations.",
        },
        {
          heading: "4. Vendor Contact Information",
          body: "Barati Gharati may display vendor contact information including mobile numbers, email addresses, office addresses, websites, and social media links, solely to facilitate communication between users and vendors. Once a user obtains vendor contact information, all future communications and transactions occur directly between the user and the vendor. Barati Gharati does not monitor such communications.",
        },
        {
          heading: "5. Sharing of Information",
          body: "We may share information with vendors, couples, service providers, payment gateways, cloud hosting providers, SMS providers, email providers, analytics providers, government authorities where legally required, and law enforcement agencies where legally required. We do not sell your personal information to third parties for their independent marketing purposes.",
        },
        {
          heading: "6. Third-Party Services",
          body: "Our Platform may integrate with third-party services such as Google Maps, Google Analytics, Razorpay, PayU, WhatsApp Business API, YouTube, Vimeo, Facebook, Instagram, LinkedIn, and cloud storage providers. Each third-party service is governed by its own privacy policy. Barati Gharati is not responsible for the privacy practices of such third parties.",
        },
        {
          heading: "7. User-to-Vendor Communication",
          body: "Once users contact vendors directly using a mobile number, WhatsApp, email, website, social media, or office address, Barati Gharati no longer controls or monitors such communication. Users acknowledge that any personal information voluntarily shared with vendors is at their own discretion and risk.",
        },
        {
          heading: "8. Data Security",
          body: "We implement commercially reasonable administrative, technical, and organizational measures to safeguard personal information, including secure authentication mechanisms, encrypted data transmission (HTTPS/SSL), access controls, role-based permissions, firewall protection, routine security monitoring, and server and application security practices. While we strive to protect your information, no method of transmission over the Internet or electronic storage is completely secure. Accordingly, we cannot guarantee absolute security.",
        },
        {
          heading: "9. Cookies & Tracking Technologies",
          body: "Barati Gharati uses cookies and similar technologies to remember login sessions, save user preferences, improve website performance, analyze traffic, enhance security, and deliver a better user experience. You may disable cookies through your browser settings; however, certain features of the Platform may not function properly.",
        },
        {
          heading: "10. Marketing Communications",
          body: "We may send service notifications, transactional emails, promotional offers, product updates, newsletters, and event announcements. You may opt out of promotional communications at any time using the unsubscribe link or by contacting us. Service-related communications may still be sent where necessary for account administration.",
        },
        {
          heading: "11. Data Retention",
          body: "We retain personal information only for as long as necessary to provide services, comply with legal obligations, resolve disputes, enforce agreements, prevent fraud, and maintain business records. Some information may be retained even after account closure where required by applicable law or for legitimate business purposes.",
        },
        {
          heading: "12. Children's Privacy",
          body: "The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that such information has been collected without appropriate authorization, we will take reasonable steps to delete it.",
        },
        {
          heading: "13. International Data Processing",
          body: "If users access the Platform from outside India, they acknowledge that their information may be processed and stored in India or other jurisdictions where our service providers operate, subject to applicable law.",
        },
        {
          heading: "14. User Rights",
          body: "Subject to applicable law, users may request to access personal information, correct inaccurate information, update profile details, delete certain information, withdraw consent where applicable, and close their account. Certain information may continue to be retained where legally required or necessary for legitimate business purposes.",
        },
        {
          heading: "15. Vendor Privacy",
          body: "Vendor information published on the Platform is voluntarily submitted by vendors for business promotion. By registering on Barati Gharati, vendors consent to the publication of business information, including business name, contact details, service descriptions, pricing (where provided), portfolio, service locations, and other information intended for customer discovery.",
        },
        {
          heading: "16. Artificial Intelligence & Recommendations",
          body: "Barati Gharati may use automated systems, algorithms, or artificial intelligence to recommend vendors, rank search results, suggest services, generate budget estimates, and improve user experience. Such recommendations are informational only and do not constitute endorsements or guarantees.",
        },
        {
          heading: "17. Business Transfers",
          body: "In the event of a merger, acquisition, restructuring, investment, sale of assets, or corporate reorganization, user information may be transferred as part of the transaction, subject to applicable law.",
        },
        {
          heading: "18. Changes to this Privacy Policy",
          body: "We may revise this Privacy Policy from time to time. The latest version will always be published on the Platform with an updated \"Last Updated\" date. Continued use of the Platform after changes are posted constitutes acceptance of the revised Privacy Policy.",
        },
        {
          heading: "19. Governing Law",
          body: "This Privacy Policy shall be governed by the laws of India. Any disputes relating to privacy or data processing shall be subject to the applicable laws of India and the jurisdiction specified in our Terms & Conditions.",
        },
        {
          heading: "20. Contact Us",
          body: "If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact Barati Gharati (a brand of True Knock Industries Private Limited).\n\nRegistered Office: Office No. 2, Chamber 4, Udaigiri Tower, Kaushambi, Ghaziabad, Uttar Pradesh – 201010, India\n\nWebsite: www.baratigharati.com\nEmail: privacy@baratigharati.com or support@baratigharati.com",
        },
        {
          heading: "Important Privacy Disclaimer",
          body: "Barati Gharati acts solely as a technology platform that facilitates connections between users and independent wedding vendors. Once a user voluntarily shares personal information or contacts a vendor directly using any contact details available on the Platform, Barati Gharati does not control, supervise, or monitor the subsequent exchange of information. Users are advised to exercise appropriate caution and share only the information necessary to facilitate their intended booking or inquiry.",
        },
      ]}
    />
  );
}