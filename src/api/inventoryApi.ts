import axiosInstance from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/product';
import type { Inventory, CreateInventoryRequest, StockOperationRequest, UpdateInventoryRequest } from '../types/inventory';

const API = 'http://localhost:8080/api/inventory';

export const inventoryApi = {
  createInventory: async (data: CreateInventoryRequest) => {
    const res = await axiosInstance.post<ApiResponse<Inventory>>(API, data);
    return res.data;
  },

  getInventoryByProductId: async (productId: number) => {
    const res = await axiosInstance.get<ApiResponse<Inventory>>(`${API}/${productId}`);
    return res.data;
  },

  updateInventoryStock: async (productId: number, data: UpdateInventoryRequest) => {
    const res = await axiosInstance.put<ApiResponse<Inventory>>(`${API}/${productId}`, data);
    return res.data;
  },

  getInventories: async (params: { sellerId?: number; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Inventory>>>(API, { params });
    return res.data;
  },

  increaseStock: async (productId: number, data: StockOperationRequest) => {
    const res = await axiosInstance.put<ApiResponse<Inventory>>(`${API}/${productId}/increase`, data);
    return res.data;
  },

  decreaseStock: async (productId: number, data: StockOperationRequest) => {
    const res = await axiosInstance.put<ApiResponse<Inventory>>(`${API}/${productId}/decrease`, data);
    return res.data;
  },

  reserveStock: async (productId: number, data: StockOperationRequest) => {
    const res = await axiosInstance.put<ApiResponse<Inventory>>(`${API}/${productId}/reserve`, data);
    return res.data;
  },

  releaseStock: async (productId: number, data: StockOperationRequest) => {
    const res = await axiosInstance.put<ApiResponse<Inventory>>(`${API}/${productId}/release`, data);
    return res.data;
  },

  getLowStockInventories: async (params: { threshold?: number; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Inventory>>>(`${API}/low-stock`, { params });
    return res.data;
  },

  getOutOfStockInventories: async (params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<Inventory>>>(`${API}/out-of-stock`, { params });
    return res.data;
  }
};
