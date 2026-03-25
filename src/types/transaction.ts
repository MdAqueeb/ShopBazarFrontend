export interface Transaction {
  transactionId: number;
  orderId: number;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}
