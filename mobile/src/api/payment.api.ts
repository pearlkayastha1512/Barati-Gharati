import api from "./axios";
import { PaymentOrder, RazorpaySuccess } from "../types/payment";

type OrderResponse = { success: boolean; data: PaymentOrder; message?: string };

export type VendorRegistrationBadgeOrder = {
  badge: "silver" | "gold";
  billingCycle: "monthly" | "yearly";
  orderId: string;
  keyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  monthlyBookingLimit: number;
};

export const createAdvanceOrder = async (bookingId: string) => {
  const response = await api.post<OrderResponse>("/payment/create-order", { bookingId });
  return response.data.data;
};

export const verifyAdvancePayment = async (
  bookingId: string,
  payment: RazorpaySuccess,
) => {
  const response = await api.post(`/payment/verify/${bookingId}`, {
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  });
  return response.data;
};

export const createRemainingOrder = async (bookingId: string) => {
  const response = await api.post<OrderResponse>("/payment/remaining/create-order", { bookingId });
  return response.data.data;
};

export const verifyRemainingPayment = async (
  bookingId: string,
  payment: RazorpaySuccess,
) => {
  const response = await api.post(`/payment/remaining/verify/${bookingId}`, {
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  });
  return response.data;
};

export const createVendorRegistrationBadgeOrder = async (
  badge: "silver" | "gold",
  billingCycle: "monthly" | "yearly",
  registrationVerificationId: string,
) => {
  const response = await api.post<{
    success: boolean;
    data: VendorRegistrationBadgeOrder;
  }>("/payment/vendor-registration-badge/create-order", {
    badge: badge.toUpperCase(),
    billingCycle: billingCycle.toUpperCase(),
    registrationVerificationId,
  });
  return response.data.data;
};
