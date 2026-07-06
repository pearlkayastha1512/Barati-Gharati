// import { Booking, BookingStatus } from "@/types/booking";
// import {
 
//   PaymentStatus
// } from "@/types/booking";

// const STORAGE_KEY = "bookings";

// export function getBookings(): Booking[] {
//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return [];
//   }

//   return JSON.parse(data);
// }

// export function saveBookings(
//   bookings: Booking[]
// ): void {
//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(bookings)
//   );
// }

// export function createBooking(
//   booking: Booking
// ): void {
//   const bookings = getBookings();

//   bookings.push(booking);

//   saveBookings(bookings);
// }

// export function getBookingById(
//   id: string
// ): Booking | undefined {
//   return getBookings().find(
//     (booking) => booking.id === id
//   );
// }

// export function getCustomerBookings(
//   customerId: string
// ): Booking[] {
//   return getBookings().filter(
//     (booking) =>
//       booking.customerId === customerId
//   );
// }

// export function getVendorBookings(
//   vendorId: number
// ): Booking[] {
//   return getBookings().filter(
//     (booking) =>
//       booking.vendorId === vendorId
//   );
// }


// export function getAllBookings(): Booking[] {
//   return getBookings();
// }

// export function updateBookingStatus(
//   bookingId: string,
//   status: BookingStatus
// ): void {
//   const bookings = getBookings();

//   const booking = bookings.find(
//     (item) => item.id === bookingId
//   );

//   if (!booking) {
//     return;
//   }

//   booking.bookingStatus = status;

//   booking.updatedAt =
//     new Date().toISOString();

//   saveBookings(bookings);
// }




// export function payAdvance(
//   bookingId: string,
//   amount: number
// ): void {
//   const bookings = getBookings();

//   const booking = bookings.find(
//     (item) => item.id === bookingId
//   );

//   if (!booking) {
//     return;
//   }

//   const advancePaid = Math.min(
//     booking.advancePaid + amount,
//     booking.amount
//   );

//   booking.advancePaid = advancePaid;

//   booking.remainingAmount =
//     booking.amount - advancePaid;

//   let paymentStatus: PaymentStatus =
//     "pending";

//   if (booking.remainingAmount === 0) {
//     paymentStatus = "paid";
//   } else if (advancePaid > 0) {
//     paymentStatus = "partial";
//   }

//   booking.paymentStatus =
//     paymentStatus;

//   booking.updatedAt =
//     new Date().toISOString();

//   saveBookings(bookings);
// }

// export function deleteBooking(
//   bookingId: string
// ): void {
//   const bookings = getBookings();

//   saveBookings(
//     bookings.filter(
//       (booking) =>
//         booking.id !== bookingId
//     )
//   );
// }

import { Booking } from "@/types/booking";

import {
  createBookingApi,
  getBookingByIdApi,
  getCustomerBookingsApi,
  getVendorBookingsApi,
  updateBookingStatusApi,
} from "@/services/api/booking.api";

export async function createBooking(
  booking: Booking
): Promise<boolean> {
  const result =
    await createBookingApi(booking);

  return result.ok;
}

export async function getCustomerBookings() {
  const result =
    await getCustomerBookingsApi();

  if (!result.ok) {
    return [];
  }

  return result.data.data;
}

export async function getVendorBookings() {
  const result =
    await getVendorBookingsApi();

  if (!result.ok) {
    return [];
  }

  return result.data.data;
}

export async function getBookingById(
  id: string
) {
  const result =
    await getBookingByIdApi(id);

  if (!result.ok) {
    return undefined;
  }

  return result.data.data;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["bookingStatus"]
) {
  const result =
    await updateBookingStatusApi(
      id,
      status
    );

  return result.ok;
}