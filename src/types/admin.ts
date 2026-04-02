import type { UserStatus, RoleName } from './user.types';

// ── Admin User ──────────────────────────────────────────────────────────────
export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: { roleId: number; roleName: RoleName; description: string };
  status: UserStatus;
  emailVerified: boolean;
  blockReason?: string;
  createdAt: string;
}

// ── Admin Seller ────────────────────────────────────────────────────────────
export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminSeller {
  sellerId: number;
  userId?: number;
  storeName: string;
  description?: string;
  gstNumber?: string;
  email: string;
  phone?: string;
  status: SellerStatus;
  rejectionReason?: string;
}

// ── Admin Product ───────────────────────────────────────────────────────────
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface AdminProduct {
  productId: number;
  name: string;
  description: string;
  price: number;
  categoryName?: string;
  sellerName?: string;
  sellerId?: number;
  status: ProductStatus;
  blockReason?: string;
  createdAt?: string;
  imageUrls?: string[];
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
}

// ── Admin Order ─────────────────────────────────────────────────────────────
export interface AdminOrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  orderId: number;
  userId: number;
  addressId?: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  orderItems?: AdminOrderItem[];
}

// ── Platform Analytics ──────────────────────────────────────────────────────
export interface PlatformAnalytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts?: number;
  totalSellers?: number;
  pendingSellers?: number;
  pendingProducts?: number;
  recentOrders?: number;
}

// ── Request types ───────────────────────────────────────────────────────────
export interface BlockRequest {
  reason: string;
}

export interface RejectRequest {
  reason: string;
}
