import api from "./axios";
import {
  PaymentOrder,
  RazorpaySuccess,
  CustomerPremiumOrder,
  CustomerPremiumUpgradeOrder,
  VendorBadgeOrder,
} from "../types/payment";

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

// ==========================
// BOOKING PAYMENTS
// ==========================

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

// ==========================
// VENDOR REGISTRATION BADGE (signup-time, unauthenticated)
// ==========================

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

// ==========================
// VENDOR BADGE UPGRADE (existing vendor, authenticated)
// ==========================

export const createVendorBadgeOrder = async (
  badge: "SILVER" | "GOLD",
  billingCycle: "MONTHLY" | "YEARLY",
) => {
  const response = await api.post<{ success: boolean; data: VendorBadgeOrder }>(
    "/payment/vendor-badge/create-order",
    { badge, billingCycle },
  );
  return response.data.data;
};

export const verifyVendorBadgePayment = async (
  badge: "SILVER" | "GOLD",
  billingCycle: "MONTHLY" | "YEARLY",
  payment: RazorpaySuccess,
) => {
  const response = await api.post("/payment/vendor-badge/verify", {
    badge,
    billingCycle,
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  });
  return response.data;
};

// ==========================
// CUSTOMER PREMIUM — REGISTRATION TIME (unauthenticated)
// ==========================

export const createCustomerPremiumRegistrationOrder = async () => {
  const response = await api.post<{
    success: boolean;
    data: CustomerPremiumOrder;
  }>("/payment/customer-premium-registration/create-order");
  return response.data.data;
};

// ==========================
// CUSTOMER PREMIUM — UPGRADE (existing user, authenticated)
// ==========================

export const createCustomerPremiumUpgradeOrder = async () => {
  const response = await api.post<{
    success: boolean;
    data: CustomerPremiumUpgradeOrder;
  }>("/payment/customer-premium-upgrade/create-order");
  return response.data.data;
};

export const verifyCustomerPremiumUpgrade = async (payment: RazorpaySuccess) => {
  const response = await api.post("/payment/customer-premium/verify", {
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  });
  return response.data;
};