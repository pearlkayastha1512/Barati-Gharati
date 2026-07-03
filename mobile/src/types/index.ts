export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "COUPLE" | "VENDOR" | "ADMIN";
  avatar?: string;
  isVerified: boolean;
}

export interface Vendor {
  id: string;
  businessName: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image?: string;
}
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
}
export interface VendorCategory {
  id: string;
  name: string;
  packages: Package[];
}
export interface Vendor {
  id: string;
  businessName: string;
  description: string;
  address: string;
  phone: string;
  email: string;

  categories: VendorCategory[];
}
export interface Booking {
  id: string;

  vendorId: string;

  packageId: string;

  bookingDate: string;

  status:
    | "PENDING"
    | "ACCEPTED"
    | "CONFIRMED"
    | "CANCELLED";

  paymentStatus:
    | "PENDING"
    | "ADVANCE_PAID"
    | "PARTIAL_PAID"
    | "PAID"
    | "REFUNDED"
    | "FAILED";
}
export interface Budget {
  totalBudget: number;

  spent: number;

  remaining: number;
}
export interface Guest {
  id: string;

  name: string;

  phone: string;

  rsvpStatus: "PENDING" | "ACCEPTED" | "DECLINED";
}