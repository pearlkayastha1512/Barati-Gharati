export type PaymentOrder = {
  bookingId: string;
  orderId: string;
  keyId: string;
  amount: number;
  advancePercentage?: number;
  amountInPaise: number;
  totalAmount: number;
  paymentStatus: string;
  currency: string;
};

export type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type CustomerPremiumOrder = {
  orderId: string;
  keyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
};

export type CustomerPremiumUpgradeOrder = CustomerPremiumOrder;

export type VendorBadgeOrder = {
  vendorId: string;
  badge: string;
  billingCycle: string;
  orderId: string;
  keyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  monthlyBookingLimit: number;
};