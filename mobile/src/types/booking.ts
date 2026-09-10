export type BookingStatus =
  | "pending"
  | "matching"
  | "waiting_primary_vendor"
  | "primary_accepted"
  | "waiting_payment"
  | "primary_rejected"
  | "promote_standby"
  | "standby_accepted"
  | "advance_paid"
  | "accepted"
  | "in_progress"
  | "event_completed"
  | "awaiting_admin_review"
  | "payment_approved"
  | "payment_held"
  | "review_pending"
  | "completed"
  | "closed"
  | "rejected"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "partial"
  | "paid"
  | "failed"
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
  eventDates?: string[];
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
  primaryPersonAge?: number | null;
  eventTheme?: string;
  specialRequirements: string;
  amount: number;
  advancePaid: number;
  platformCommission?: number;
  vendorNetAmount?: number;
  payoutStatus?: string | null;
  payoutSimulated?: boolean;
  payoutReleasedAt?: string | null;
  vendorAcknowledgedAt?: string | null;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  adminApproved?: boolean;
  adminApprovedAt?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
  updatedAt: string;
  lastPaymentAt?: string | null;
}

export type CreateBookingInput = Omit<Booking, "id" | "createdAt" | "updatedAt">;

export interface BookingResponse {
  success: boolean;
  data: Booking;
  message?: string;
}

export interface BookingListResponse {
  success: boolean;
  data: Booking[];
}
