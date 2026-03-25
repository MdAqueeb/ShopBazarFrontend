import axiosInstance from './axiosInstance';
import type { PageResponse } from '../types/product';
import type { AdminUser, AdminSeller, AdminProduct, AdminOrder, PlatformAnalytics } from '../types/admin';

const API = 'http://localhost:8080/api/admin';

// Helper to reliably unwrap mixed payloads smoothly
const unwrap = (res: any) => (res.data && res.data.data !== undefined) ? res.data.data : res.data;

export const adminApi = {
  getAllUsers: async (params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/users`, { params });
    return unwrap(res) as PageResponse<AdminUser>;
  },

  blockUser: async (userId: number, reason: string) => {
    const res = await axiosInstance.put<any>(`${API}/users/${userId}/block`, { reason });
    return unwrap(res) as AdminUser;
  },

  unblockUser: async (userId: number) => {
    const res = await axiosInstance.put<any>(`${API}/users/${userId}/unblock`);
    return unwrap(res) as AdminUser;
  },

  getAllSellers: async (params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/sellers`, { params });
    return unwrap(res) as PageResponse<AdminSeller>;
  },

  approveSeller: async (sellerId: number) => {
    const res = await axiosInstance.put<any>(`${API}/sellers/${sellerId}/approve`);
    return unwrap(res) as AdminSeller;
  },

  rejectSeller: async (sellerId: number, reason: string) => {
    const res = await axiosInstance.put<any>(`${API}/sellers/${sellerId}/reject`, { reason });
    return unwrap(res) as AdminSeller;
  },

  getAllProducts: async (params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/products`, { params });
    return unwrap(res) as PageResponse<AdminProduct>;
  },

  approveProduct: async (productId: number) => {
    const res = await axiosInstance.put<any>(`${API}/products/${productId}/approve`);
    return unwrap(res) as AdminProduct;
  },

  blockProduct: async (productId: number, reason: string) => {
    const res = await axiosInstance.put<any>(`${API}/products/${productId}/block`, { reason });
    return unwrap(res) as AdminProduct;
  },

  getAllOrders: async (params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/orders`, { params });
    return unwrap(res) as PageResponse<AdminOrder>;
  },

  getPlatformAnalytics: async (params: { startDate: string; endDate: string }) => {
    const res = await axiosInstance.get<any>(`${API}/analytics`, { params });
    return unwrap(res) as PlatformAnalytics;
  }
};
