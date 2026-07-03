export interface Review {
  id: string;

  bookingId: string;

  customerId: string;

  vendorId: number;

  customerName: string;

  customerImage?: string;

  vendorName: string;

  rating: number;

  comment: string;

  reply?: string;

  repliedAt?: string;

  createdAt: string;

  updatedAt: string;
}