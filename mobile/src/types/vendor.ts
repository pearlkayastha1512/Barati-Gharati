export type VendorCategory =
  | "Venue"
  | "Photographer"
  | "Videographer"
  | "Decorator"
  | "Caterer"
  | "DJ"
  | "Makeup Artist"
  | "Mehendi Artist"
  | "Band"
  | "Live Band"
  | "Cake Designer"
  | "Entertainment"
  | "Wedding Planner"
  | "Transportation"
  | "Accommodation"
  | "Invitation Designer"
  | "Bridal Wear"
  | "Groom Wear"
  | "Jewellery"
  | "Florist"
  | "Pandit / Priest"
  | "Event Planner"
  | "Birthday Planner"
  | "Kids Party Planner"
  | "Balloon Decorator"
  | "Theme Decorator"
  | "Kids Entertainer"
  | "Magician"
  | "Anchor / Emcee"
  | "Choreographer"
  | "Party Supplies"
  | "Return Gifts"
  | "Gift Hampers"
  | "Sound and Lighting"
  | "Photo Booth"
  | "Event Security";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  "Venue",
  "Photographer",
  "Videographer",
  "Decorator",
  "Caterer",
  "DJ",
  "Makeup Artist",
  "Mehendi Artist",
  "Band",
  "Live Band",
  "Cake Designer",
  "Entertainment",
  "Wedding Planner",
  "Transportation",
  "Accommodation",
  "Invitation Designer",
  "Bridal Wear",
  "Groom Wear",
  "Jewellery",
  "Florist",
  "Pandit / Priest",
  "Event Planner",
  "Birthday Planner",
  "Kids Party Planner",
  "Balloon Decorator",
  "Theme Decorator",
  "Kids Entertainer",
  "Magician",
  "Anchor / Emcee",
  "Choreographer",
  "Party Supplies",
  "Return Gifts",
  "Gift Hampers",
  "Sound and Lighting",
  "Photo Booth",
  "Event Security",
];

export type VendorAccountInfo = {
  ownerName: string;
  businessEmail: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type VendorBusinessInfo = {
  businessName: string;
  category: string;
  city: string;
  address: string;
  description: string;
};

export type VendorGalleryInfo = {
  profileImageUri: string | null;
  coverImageUri: string | null;
};