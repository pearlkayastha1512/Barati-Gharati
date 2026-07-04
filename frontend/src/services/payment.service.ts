interface PaymentRequest {
  amount: number;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

class PaymentService {
  processPayment({
    amount,
  }: PaymentRequest): PaymentResponse {
    console.log(
      "Mock Payment Successful:",
      amount
    );

    return {
      success: true,

      transactionId:
        "TXN-" + Date.now(),

      message:
        "Payment completed successfully.",
    };
  }
}

export const paymentService =
  new PaymentService();