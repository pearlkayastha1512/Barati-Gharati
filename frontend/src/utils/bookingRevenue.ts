import { Booking } from "@/types/booking";

export function getBookingRevenueDate(booking: Booking) {
  return new Date(
    booking.lastPaymentAt ??
      booking.updatedAt ??
      booking.createdAt
  );
}
