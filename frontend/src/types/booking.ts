
export type BookingStatus =
  | "pending"
  | "advance_paid"
  | "accepted"
  | "event_completed"
  | "awaiting_admin_review"
  | "payment_approved"
  | "payment_held"
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

  platformCommission?: number;

  vendorNetAmount?: number;

  payoutStatus?:
    | "held_for_admin_review"
    | "release_processing"
    | "released"
    | "settled"
    | "failed"
    | "refunded"
    | null;

  payoutSimulated?: boolean;

  payoutReleasedAt?: string | null;

  vendorAcknowledgedAt?: string | null;

  remainingAmount: number;

  paymentStatus: PaymentStatus;

  adminApproved?: boolean;

  adminApprovedAt?: string;

  review?: {
    id: string;
    rating: number;
    comment: string;
    complaint?: string;
    proofImages?: string[];
    vendorDispute?: string;
    createdAt: string;
  } | null;

  settlement?: {
    totalAmount: number;
    platformCommissionRate: number;
    platformCommission: number;
    vendorReceives: number;
  } | null;

  bookingStatus: BookingStatus;

  createdAt: string;

  updatedAt: string;
}
