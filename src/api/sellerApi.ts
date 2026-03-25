import axiosInstance from './axiosInstance';
import type { ApiResponse, PageResponse, ProductResponse } from '../types/product';
import type { 
  Seller, 
  SellerAnalytics, 
  SellerDashboard, 
  OrderItem, 
  ApplySellerRequest, 
  UpdateSellerRequest 
} from '../types/seller';

const API = 'http://localhost:8080/api/sellers';

export const sellerApi = {
  getSellerProfile: async (sellerId: number) => {
    const res = await axiosInstance.get<ApiResponse<Seller>>(`${API}/${sellerId}`);
    return res.data;
  },

  updateSellerProfile: async (sellerId: number, data: UpdateSellerRequest) => {
    const res = await axiosInstance.put<ApiResponse<Seller>>(`${API}/${sellerId}`, data);
    return res.data;
  },

  getSellerProducts: async (sellerId: number, params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<ProductResponse>>>(`${API}/${sellerId}/products`, { params });
    return res.data;
  },

  getSellerOrders: async (sellerId: number, params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<OrderItem>>>(`${API}/${sellerId}/orders`, { params });
    return res.data;
  },

  getSellerAnalytics: async (sellerId: number, params: { startDate: string; endDate: string }) => {
    const res = await axiosInstance.get<ApiResponse<SellerAnalytics>>(`${API}/${sellerId}/analytics`, { params });
    return res.data;
  },

  applyForSeller: async (data: ApplySellerRequest) => {
    const res = await axiosInstance.post<ApiResponse<Seller>>(`${API}/apply`, data);
    return res.data;
  },

  getSellerDashboard: async (sellerId: number) => {
    const res = await axiosInstance.get<ApiResponse<SellerDashboard>>(`${API}/${sellerId}/dashboard`);
    return res.data;
  },

  deactivateSeller: async (sellerId: number) => {
    const res = await axiosInstance.put<ApiResponse<Seller>>(`${API}/${sellerId}/deactivate`);
    return res.data;
  }
};
