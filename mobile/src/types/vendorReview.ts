export type VendorReviewRecord = {
  id: string;
  bookingId: string;
  customerId: string;
  vendorId: number;
  customerName: string;
  vendorName: string;
  packageName: string;
  rating: number;
  comment: string;
  reply?: string | null;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
};