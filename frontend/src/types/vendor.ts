import { VendorBadge } from "@/constants/vendor-badges";

export interface Vendor {
  id: number;

  backendId?: string;

  userId: string;   // ✅ add this

  name: string;

  category: string;

  city: string;

  rating: number;

  reviews: number;

  price: number;

  image: string;

  images: string[];

  featured: boolean;

  badge?: VendorBadge;

  monthlyBookingLimit?: number;

  currentMonthBookings?: number;

  description: string;

  amenities: string[];

  packages: {
    id: number;
    name: string;
    price: number;
  }[];
}
