import axiosInstance from './axiosInstance';
import type { 
  ApiResponse, 
  PageResponse, 
  ProductResponse, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductImageResponse 
} from '../types/product';

const API = 'http://localhost:8080/api/products';

export const productApi = {
  createProduct: async (data: CreateProductRequest) => {
    const res = await axiosInstance.post<ApiResponse<ProductResponse>>(API, data);
    return res.data;
  },

  getAllProducts: async (params: { categoryId?: number; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<ProductResponse>>>(API, { params });
    return res.data;
  },

  getProductById: async (productId: number) => {
    const res = await axiosInstance.get<ApiResponse<ProductResponse>>(`${API}/${productId}`);
    return res.data;
  },

  updateProduct: async (productId: number, data: UpdateProductRequest) => {
    const res = await axiosInstance.put<ApiResponse<ProductResponse>>(`${API}/${productId}`, data);
    return res.data;
  },

  deleteProduct: async (productId: number) => {
    const res = await axiosInstance.delete<ApiResponse<void>>(`${API}/${productId}`);
    return res.data;
  },

  searchProducts: async (params: { keyword?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<ProductResponse>>>(`${API}/search`, { params });
    return res.data;
  },

  getProductsByCategory: async (categoryId: number, params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<ProductResponse>>>(`${API}/category/${categoryId}`, { params });
    return res.data;
  },

  uploadProductImage: async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post<ApiResponse<ProductImageResponse>>(`${API}/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getProductImages: async (productId: number) => {
    const res = await axiosInstance.get<ApiResponse<ProductImageResponse[]>>(`${API}/${productId}/images`);
    return res.data;
  },

  deleteProductImage: async (productId: number, imageId: number) => {
    const res = await axiosInstance.delete<ApiResponse<void>>(`${API}/${productId}/images/${imageId}`);
    return res.data;
  }
};