export interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  gatewayTransaction: string;
}

export interface InitiatePaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: string;
}

export interface VerifyPaymentRequest {
  paymentId: number;
  gatewayTransaction: string;
}

export interface RefundPaymentRequest {
  paymentId: number;
  amount: number;
  reason: string;
}
