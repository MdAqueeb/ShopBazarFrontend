import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/product';
import type { Cart, CartItem, AddItemToCartRequest, UpdateCartItemQuantityRequest } from '../types/cart';

const getBaseUrl = (userId: number) => `http://localhost:8080/api/users/${userId}/cart`;

// The API returns CartItem with a nested `product` object and Cart with `cartItems`.
// We flatten these to match local types.
function flattenCartItem(raw: any, fallbackProductId?: number): CartItem {
  // If product is nested, extract it; otherwise handle direct properties
  const product = raw.product || {};
  return {
    cartItemId: raw.cartItemId,
    productId: product.productId ?? raw.productId ?? fallbackProductId ?? 0,
    productName: product.name ?? raw.productName,
    productPrice: product.price ?? raw.productPrice,
    imageUrl: (product.imageUrls && product.imageUrls[0]) ?? raw.imageUrl,
    quantity: raw.quantity ?? raw.qty ?? 1,
  };
}

function flattenCart(raw: any = {}): Cart {
  // Check if raw is an array directly, or check cartItems and items for flexibility
  const items = Array.isArray(raw) ? raw : (raw?.cartItems || raw?.items || []);
  return {
    cartId: raw?.cartId ?? 0,
    items: items.map((item: any) => flattenCartItem(item)),
  };
}

export const cartApi = {
  addItemToCart: async (userId: number, data: AddItemToCartRequest): Promise<ApiResponse<CartItem>> => {
    const res = await axiosInstance.post<ApiResponse<any>>(`${getBaseUrl(userId)}/items`, data);
    return { ...res.data, data: flattenCartItem(res.data.data, data.productId) };
  },

  getCart: async (userId: number): Promise<ApiResponse<Cart>> => {
    const res = await axiosInstance.get<ApiResponse<any>>(getBaseUrl(userId));
    return { ...res.data, data: flattenCart(res.data.data) };
  },

  updateCartItemQuantity: async (userId: number, cartItemId: number, data: UpdateCartItemQuantityRequest): Promise<ApiResponse<any>> => {
    const res = await axiosInstance.put<ApiResponse<any>>(`${getBaseUrl(userId)}/items/${cartItemId}`, data);
    return res.data;
  },

  removeCartItem: async (userId: number, cartItemId: number): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`${getBaseUrl(userId)}/items/${cartItemId}`);
    return res.data;
  },

  clearCart: async (userId: number): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`${getBaseUrl(userId)}/clear`);
    return res.data;
  }
};
