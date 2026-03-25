
export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  addressId: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderTransaction {
  transactionId: number;
  amount: number;
  status: string;
}

export interface CreateOrderRequest {
  userId: number;
  addressId: number;
  paymentMethod: string;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}
