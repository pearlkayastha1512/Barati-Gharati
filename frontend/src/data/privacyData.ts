export interface PrivacySection {
  id: string;
  title: string;
  content: string[];
}

export const privacySections: PrivacySection[] = [
  {
    id: "about",
    title: "1. About Us",
    content: [
      "Barati Gharati is a Wedding Marketplace and Wedding Technology (Wed-Tech) Platform that connects couples, families, wedding planners, and users with independent wedding vendors and service providers.",
      "We are a technology platform and do not provide wedding services directly.",
    ],
  },

  {
    id: "information-collection",
    title: "2. Information We Collect",
    content: [
      "Personal information such as name, email address, phone number, and address.",
      "Wedding information including dates, guest count, budget, and preferences.",
      "Vendor information such as business details, pricing, portfolios, and verification documents.",
      "Technical information including IP address, browser, cookies, and device identifiers.",
      "Payment information processed through secure third-party payment gateways.",
    ],
  },

  {
    id: "information-usage",
    title: "3. How We Use Your Information",
    content: [
      "Create and manage accounts.",
      "Connect users with vendors.",
      "Display vendor profiles.",
      "Facilitate communication.",
      "Provide customer support.",
      "Verify vendors.",
      "Process subscriptions.",
      "Improve platform functionality.",
      "Personalize user experience.",
      "Generate analytics.",
      "Send notifications.",
      "Prevent fraud.",
      "Maintain security.",
      "Comply with legal obligations.",
    ],
  },

  {
    id: "vendor-contact",
    title: "4. Vendor Contact Information",
    content: [
      "Vendor contact details may include mobile numbers, email addresses, office addresses, websites, and social media links.",
      "These details are displayed solely to facilitate communication between users and vendors.",
      "Once a user obtains vendor contact information, all future communications occur directly between the user and the vendor.",
      "Barati Gharati does not monitor such communications.",
    ],
  },

  {
    id: "sharing",
    title: "5. Sharing of Information",
    content: [
      "We may share information with vendors and couples using the platform.",
      "Information may be shared with service providers and payment gateways.",
      "Cloud hosting, SMS, email, and analytics providers may process information on our behalf.",
      "Government authorities and law enforcement agencies may receive information when legally required.",
      "We do not sell personal information for third-party marketing purposes.",
    ],
  },

  {
    id: "third-party-services",
    title: "6. Third-Party Services",
    content: [
      "The platform may integrate with Google Maps and Google Analytics.",
      "Payments may be processed through Razorpay and PayU.",
      "Communication services may include WhatsApp Business API.",
      "Content integrations may include YouTube and Vimeo.",
      "Social integrations may include Facebook, Instagram, and LinkedIn.",
      "Each third-party service has its own privacy policy.",
    ],
  },

  {
    id: "communication",
    title: "7. User-to-Vendor Communication",
    content: [
      "Users may contact vendors using phone numbers, WhatsApp, email, websites, and social media.",
      "Barati Gharati does not control or monitor communications after users contact vendors directly.",
      "Users voluntarily sharing information with vendors do so at their own discretion and risk.",
    ],
  },

  {
    id: "security",
    title: "8. Data Security",
    content: [
      "Secure authentication mechanisms.",
      "Encrypted data transmission using HTTPS and SSL.",
      "Access controls and role-based permissions.",
      "Firewall protection and security monitoring.",
      "Industry-standard server and application security practices.",
      "No method of transmission over the internet is completely secure.",
    ],
  },

  {
    id: "cookies",
    title: "9. Cookies & Tracking Technologies",
    content: [
      "Cookies help remember login sessions.",
      "Cookies store user preferences.",
      "Cookies improve website performance and analytics.",
      "Cookies enhance platform security.",
      "Users may disable cookies through browser settings.",
    ],
  },

  {
    id: "marketing",
    title: "10. Marketing Communications",
    content: [
      "We may send service notifications and transactional emails.",
      "Users may receive promotional offers and newsletters.",
      "Event announcements and product updates may be shared.",
      "Users can opt out of promotional communications at any time.",
    ],
  },

  {
    id: "retention",
    title: "11. Data Retention",
    content: [
      "We retain information only as long as necessary to provide services.",
      "Data may be retained to comply with legal obligations.",
      "Information may be kept to resolve disputes and enforce agreements.",
      "Some records may remain after account closure where required by law.",
    ],
  },

  {
    id: "children",
    title: "12. Children's Privacy",
    content: [
      "The platform is not intended for individuals under 18 years of age.",
      "We do not knowingly collect personal information from minors.",
      "If such information is identified, reasonable steps will be taken to delete it.",
    ],
  },

  {
    id: "international",
    title: "13. International Data Processing",
    content: [
      "Users accessing the platform from outside India acknowledge that data may be processed in India.",
      "Information may also be processed in jurisdictions where our service providers operate.",
    ],
  },

  {
    id: "rights",
    title: "14. User Rights",
    content: [
      "Access personal information.",
      "Correct inaccurate information.",
      "Update profile details.",
      "Delete certain information.",
      "Withdraw consent where applicable.",
      "Close their account.",
    ],
  },

  {
    id: "vendor-privacy",
    title: "15. Vendor Privacy",
    content: [
      "Vendor information is voluntarily submitted for business promotion.",
      "Vendors consent to the publication of business information.",
      "Published information may include contact details, pricing, portfolios, and service locations.",
    ],
  },

  {
    id: "ai",
    title: "16. Artificial Intelligence & Recommendations",
    content: [
      "Barati Gharati may use AI and automated systems to recommend vendors.",
      "Algorithms may rank search results and suggest services.",
      "Automated systems may generate budget estimates.",
      "Recommendations are informational only and do not constitute endorsements.",
    ],
  },

  {
    id: "business-transfers",
    title: "17. Business Transfers",
    content: [
      "User information may be transferred during mergers or acquisitions.",
      "Data may be transferred during restructuring or investment transactions.",
      "Any transfer will remain subject to applicable laws.",
    ],
  },

  {
    id: "changes",
    title: "18. Changes to this Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      "The latest version will always be published on the platform.",
      "Continued use of the platform constitutes acceptance of the updated policy.",
    ],
  },

  {
    id: "governing-law",
    title: "19. Governing Law",
    content: [
      "This Privacy Policy is governed by the laws of India.",
      "Privacy disputes are subject to applicable Indian laws.",
      "Jurisdiction shall be determined according to our Terms & Conditions.",
    ],
  },

  {
    id: "contact",
    title: "20. Contact Us",
    content: [
      "Barati Gharati",
      "A Brand of True Knock Industries Private Limited",
      "OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH – 201010, India",
      "Website: www.baratigharati.com",
      "Email: privacy@baratigharati.com",
      "Email: support@baratigharati.com",
    ],
  },

  {
    id: "disclaimer",
    title: "21. Important Privacy Disclaimer",
    content: [
      "Barati Gharati acts solely as a technology platform connecting users with vendors.",
      "We do not supervise or monitor communications after users contact vendors directly.",
      "Users should share only the information necessary for bookings and inquiries.",
      "Users are advised to exercise caution while sharing personal information.",
    ],
  },
];