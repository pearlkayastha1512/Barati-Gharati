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
