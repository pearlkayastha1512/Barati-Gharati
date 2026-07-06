import api from "@/lib/axios";
import { Booking, BookingStatus } from "@/types/booking";

export async function createBookingApi(
  booking: Booking
) {
  try {
    const payload = {
      bookingNumber: booking.bookingNumber,

      vendorId: booking.vendorId,
      vendorName: booking.vendorName,

      category: booking.category,

      packageName: booking.packageName,

      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,

      eventType: booking.eventType,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,

      venue: booking.venue,
      city: booking.city,

      guests: booking.guests,

      brideName: booking.brideName,
      groomName: booking.groomName,

      specialRequirements:
        booking.specialRequirements,

      amount: booking.amount,

      advancePaid: booking.advancePaid,

      remainingAmount:
        booking.remainingAmount,

      paymentStatus: "PENDING",

      bookingStatus: "PENDING",
    };

    const { data } = await api.post(
      "/bookings",
      payload
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to create booking.",
    };
  }
}

export async function getCustomerBookingsApi() {
  try {
    const { data } = await api.get(
      "/bookings"
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load bookings.",
    };
  }
}

export async function getVendorBookingsApi() {
  try {
    const { data } = await api.get(
      "/bookings"
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load vendor bookings.",
    };
  }
}

export async function getBookingByIdApi(
  id: string
) {
  try {
    const { data } = await api.get(
      `/bookings/${id}`
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load booking.",
    };
  }
}

export async function updateBookingStatusApi(
  id: string,
  status: BookingStatus,
  cancellationReason?: string
) {
  try {
    let endpoint = "";
    let body = {};

    switch (status) {
      case "accepted":
        endpoint = `/bookings/${id}/accept`;
        break;

      case "completed":
        endpoint = `/bookings/${id}/confirm`;
        break;

      case "cancelled":
        endpoint = `/bookings/${id}/cancel`;
        body = {
          cancellationReason:
            cancellationReason ??
            "Cancelled by customer",
        };
        break;

      default:
        endpoint = `/bookings/${id}/reject`;
        body = {
          cancellationReason:
            cancellationReason ??
            "Rejected by vendor",
        };
    }

    const { data } = await api.patch(
      endpoint,
      body
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to update booking.",
    };
  }
}