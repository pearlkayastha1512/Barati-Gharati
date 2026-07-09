export type VendorCategory =
  | "Venue"
  | "Photographer"
  | "Decorator"
  | "Caterer"
  | "DJ"
  | "Makeup Artist"
  | "Mehendi Artist"
  | "Band";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  "Venue",
  "Photographer",
  "Decorator",
  "Caterer",
  "DJ",
  "Makeup Artist",
  "Mehendi Artist",
  "Band",
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