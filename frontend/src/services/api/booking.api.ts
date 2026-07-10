import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Booking, BookingStatus } from "@/types/booking";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (error instanceof AxiosError) {
    const data = error.response
      ?.data as ApiErrorResponse | undefined;

    return data?.message ?? fallback;
  }

  return fallback;
}

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

      partnerName: booking.partnerName,
      partnerEmail: booking.partnerEmail,
      partnerPhone: booking.partnerPhone,
      partnerOccupation:
        booking.partnerOccupation,

      eventType: booking.eventType,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,

      venue: booking.venue,
      city: booking.city,

      contactAddress:
        booking.contactAddress,
      contactState: booking.contactState,
      contactCountry:
        booking.contactCountry,
      weddingTheme: booking.weddingTheme,

      guests: booking.guests,

      brideName: booking.brideName,
      groomName: booking.groomName,

      eventTitle: booking.eventTitle,
      primaryPersonName:
        booking.primaryPersonName,
      primaryPersonAge:
        booking.primaryPersonAge,
      eventTheme: booking.eventTheme,

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
      data: data?.success
        ? data
        : {
            success: true,
            data,
          },
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create booking."
      ),
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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load bookings."
      ),
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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load vendor bookings."
      ),
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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to load booking."
      ),
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
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update booking."
      ),
    };
  }
}

export async function updateBookingPaymentApi(
  id: string,
  amount: number
) {
  try {
    const { data } = await api.patch(
      `/bookings/${id}/payment`,
      {
        amount,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to update payment."
      ),
    };
  }
}
