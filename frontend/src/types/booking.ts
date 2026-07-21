
export type BookingStatus =
  | "pending"
  | "matching"
  | "waiting_primary_vendor"
  | "primary_accepted"
  | "waiting_payment"
  | "primary_rejected"
  | "promote_standby"
  | "standby_accepted"
  | "in_progress"
  | "advance_paid"
  | "accepted"
  | "event_completed"
  | "awaiting_admin_review"
  | "payment_approved"
  | "payment_held"
  | "completed"
  | "review_pending"
  | "rejected"
  | "cancelled"
  | "closed";


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
  noVendorAvailable?: boolean;


  customerName: string;
  customerEmail: string;
  customerPhone: string;

  partnerName?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  partnerOccupation?: string;

  vendorName: string;

  vendorImage?: string | null;

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

  lastPaymentAt?: string | null;
}
