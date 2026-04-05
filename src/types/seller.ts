export interface Seller {
  sellerId: number;
  storeName: string;
  status: string;
}

export interface SellerAnalytics {
  sellerId: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface SellerDashboard {
  sellerId: number;
  storeName: string;
  status: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface OrderItem {
  orderItemId: number;
  productId: number;
  quantity: number;
}

export interface ApplySellerRequest {
  userId: number;
  storeName: string;
  storeDescription: string;
  phone: string;
  gstNumber: string;
}

export interface UpdateSellerRequest {
  storeName?: string;
  description?: string;
}
