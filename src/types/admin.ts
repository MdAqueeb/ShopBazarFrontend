export interface AdminUser {
  userId: number;
  status: string;
  blockReason?: string;
}

export interface AdminSeller {
  sellerId: number;
  status: string;
}

export interface AdminProduct {
  productId: number;
  status: string;
}

export interface AdminOrder {
  orderId: number;
  status: string;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}
