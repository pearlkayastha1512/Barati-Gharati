export enum PaymentStatus {
  PENDING = "PENDING",
  ADVANCE_PAID = "ADVANCE_PAID",
  PARTIAL_PAID = "PARTIAL_PAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Booking {
  id: string;
  vendorId: string;
  userId: string;
  packageId: string;

  eventDate: string;

  totalAmount: number;

  paymentStatus: PaymentStatus;

  bookingStatus: BookingStatus;
}