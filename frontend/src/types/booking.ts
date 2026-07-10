
export type BookingStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "rejected"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "partial"
  | "paid"
  | "refunded";

export interface Booking {
  id: string;

  bookingNumber: string;

  customerId: string;
  vendorId: number;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  partnerName?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  partnerOccupation?: string;

  vendorName: string;

  category: string;

  packageName: string;

  eventType: string;

  eventDate: string;

  eventTime: string;

  venue: string;

  city: string;

  contactAddress?: string;
  contactState?: string;
  contactCountry?: string;
  weddingTheme?: string;

  guests: number;

  brideName?: string;

  groomName?: string;

  eventTitle?: string;

  primaryPersonName?: string;

  primaryPersonAge?: number;

  eventTheme?: string;

  specialRequirements: string;

  amount: number;

  advancePaid: number;

  remainingAmount: number;

  paymentStatus: PaymentStatus;

  adminApproved?: boolean;

  adminApprovedAt?: string;

  bookingStatus: BookingStatus;

  createdAt: string;

  updatedAt: string;
}
