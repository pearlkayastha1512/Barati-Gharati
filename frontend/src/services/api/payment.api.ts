import api from "@/lib/axios";
import { AxiosError } from "axios";

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

export type PaymentOrderResponse = {
  orderId: string;
  keyId: string;
  amount: number;
  advancePercentage?: number;
  amountInPaise: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
};

export async function createPaymentOrderApi(
  bookingId: string
) {
  try {
    const { data } = await api.post(
      "/payment/create-order",
      {
        bookingId,
      }
    );

    return {
      ok: true,
      data: data?.data as PaymentOrderResponse,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create payment order."
      ),
    };
  }
}

export async function verifyPaymentApi(
  payload: {
    bookingId: string;
    orderId: string;
    paymentId: string;
    signature: string;
  }
) {
  try {
    const { data } = await api.post(
      `/payment/verify/${payload.bookingId}`,
      {
        orderId: payload.orderId,
        paymentId: payload.paymentId,
        signature: payload.signature,
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
        "Unable to verify payment."
      ),
    };
  }
}

export async function createRemainingPaymentOrderApi(
  bookingId: string
) {
  try {
    const { data } = await api.post(
      "/payment/remaining/create-order",
      {
        bookingId,
      }
    );

    return {
      ok: true,
      data: data?.data as PaymentOrderResponse,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create remaining payment order."
      ),
    };
  }
}

export async function verifyRemainingPaymentApi(
  payload: {
    bookingId: string;
    orderId: string;
    paymentId: string;
    signature: string;
  }
) {
  try {
    const { data } = await api.post(
      `/payment/remaining/verify/${payload.bookingId}`,
      {
        orderId: payload.orderId,
        paymentId: payload.paymentId,
        signature: payload.signature,
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
        "Unable to verify remaining payment."
      ),
    };
  }
}

export type VendorBadgeOrderResponse = {
  vendorId: string;
  badge: "bronze" | "silver" | "gold";
  billingCycle: "monthly" | "yearly";
  orderId: string;
  keyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  monthlyBookingLimit: number;
};

export async function createVendorBadgeOrderApi(
  badge: "silver" | "gold",
  billingCycle: "monthly" | "yearly"
) {
  try {
    const { data } = await api.post(
      "/payment/vendor-badge/create-order",
      {
        badge: badge.toUpperCase(),
        billingCycle: billingCycle.toUpperCase(),
      }
    );

    return {
      ok: true,
      data: data?.data as VendorBadgeOrderResponse,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create badge payment order."
      ),
    };
  }
}

export async function createVendorRegistrationBadgeOrderApi(
  badge: "silver" | "gold",
  billingCycle: "monthly" | "yearly",
  registrationVerificationId: string,
) {
  try {
    const { data } = await api.post(
      "/payment/vendor-registration-badge/create-order",
      {
        badge: badge.toUpperCase(),
        billingCycle: billingCycle.toUpperCase(),
        registrationVerificationId,
      }
    );

    return {
      ok: true,
      data: data?.data as Omit<
        VendorBadgeOrderResponse,
        "vendorId"
      >,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(
        error,
        "Unable to create badge payment order."
      ),
    };
  }
}

export type CustomerPremiumOrderResponse = {
  membership: "PREMIUM";
  orderId: string;
  keyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
};

export async function createCustomerPremiumRegistrationOrderApi() {
  try {
    const { data } = await api.post(
      "/payment/customer-premium-registration/create-order"
    );
    return {
      ok: true,
      data: data?.data as CustomerPremiumOrderResponse,
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(error, "Unable to start premium membership payment."),
    };
  }
}

export async function verifyVendorBadgePaymentApi(
  payload: {
    badge: "silver" | "gold";
    billingCycle: "monthly" | "yearly";
    orderId: string;
    paymentId: string;
    signature: string;
  }
) {
  try {
    const { data } = await api.post(
      "/payment/vendor-badge/verify",
      {
        badge: payload.badge.toUpperCase(),
        billingCycle: payload.billingCycle.toUpperCase(),
        orderId: payload.orderId,
        paymentId: payload.paymentId,
        signature: payload.signature,
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
        "Unable to verify badge payment."
      ),
    };
  }
}
