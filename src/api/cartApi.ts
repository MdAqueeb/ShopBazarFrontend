import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/product';
import type { Cart, CartItem, AddItemToCartRequest, UpdateCartItemQuantityRequest } from '../types/cart';

const getBaseUrl = (userId: number) => `http://localhost:8080/api/users/${userId}/cart`;

export const cartApi = {
  addItemToCart: async (userId: number, data: AddItemToCartRequest) => {
    const res = await axiosInstance.post<ApiResponse<CartItem>>(`${getBaseUrl(userId)}/items`, data);
    return res.data;
  },

  getCart: async (userId: number) => {
    const res = await axiosInstance.get<ApiResponse<Cart>>(getBaseUrl(userId));
    return res.data;
  },

  updateCartItemQuantity: async (userId: number, cartItemId: number, data: UpdateCartItemQuantityRequest) => {
    const res = await axiosInstance.put<ApiResponse<any>>(`${getBaseUrl(userId)}/items/${cartItemId}`, data);
    return res.data;
  },

  removeCartItem: async (userId: number, cartItemId: number) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`${getBaseUrl(userId)}/items/${cartItemId}`);
    return res.data;
  },

  clearCart: async (userId: number) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`${getBaseUrl(userId)}/clear`);
    return res.data;
  }
};
