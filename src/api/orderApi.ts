import axiosInstance from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/product';
import type { 
  OrderResponse, 
  OrderItem, 
  OrderTransaction, 
  CreateOrderRequest, 
  CancelOrderRequest, 
  UpdateOrderStatusRequest 
} from '../types/order';

const API = 'http://localhost:8080/api/orders';

export const orderApi = {
  createOrder: async (data: CreateOrderRequest) => {
    const res = await axiosInstance.post<ApiResponse<OrderResponse>>(API, data);
    return res.data;
  },

  getOrder: async (orderId: number) => {
    const res = await axiosInstance.get<ApiResponse<OrderResponse>>(`${API}/${orderId}`);
    return res.data;
  },

  getUserOrders: async (userId: number, params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<OrderResponse>>>(`${API}/user/${userId}`, { params });
    return res.data;
  },

  cancelOrder: async (orderId: number, data: CancelOrderRequest) => {
    const res = await axiosInstance.put<ApiResponse<OrderResponse>>(`${API}/${orderId}/cancel`, data);
    return res.data;
  },

  updateOrderStatus: async (orderId: number, data: UpdateOrderStatusRequest) => {
    const res = await axiosInstance.put<ApiResponse<OrderResponse>>(`${API}/${orderId}/status`, data);
    return res.data;
  },

  getAllOrders: async (params: { status?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<OrderResponse>>>(API, { params });
    return res.data;
  },

  getOrderItems: async (orderId: number) => {
    const res = await axiosInstance.get<ApiResponse<OrderItem[]>>(`${API}/${orderId}/items`);
    return res.data;
  },

  getOrderItem: async (orderId: number, orderItemId: number) => {
    const res = await axiosInstance.get<ApiResponse<OrderItem>>(`${API}/${orderId}/items/${orderItemId}`);
    return res.data;
  },

  getOrderTransactions: async (orderId: number) => {
    const res = await axiosInstance.get<ApiResponse<OrderTransaction[]>>(`${API}/${orderId}/transactions`);
    return res.data;
  }
};
