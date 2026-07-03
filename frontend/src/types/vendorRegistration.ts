export interface VendorRegistrationForm {
  // Account
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Business
  businessName: string;
  category: string;
  city: string;
  address: string;
  description: string;

  // Images
  profileImage: string;
  coverImage: string;
  portfolioImages: string[];

  // NEW
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;

  experience: string;

  gstNumber: string;

  bankVerified: boolean;

  

  businessVerified: boolean;
gstVerified: boolean;
documentsUploaded: boolean;
}