import axiosInstance from './axiosInstance';
import type { ApiResponse, PageResponse, ProductResponse } from '../types/product';
import type { Category, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

const API = 'http://localhost:8080/api/categories';

export const categoryApi = {
  createCategory: async (data: CreateCategoryRequest) => {
    const res = await axiosInstance.post<ApiResponse<Category>>(API, data);
    return res.data;
  },

  getAllCategories: async () => {
    const res = await axiosInstance.get<ApiResponse<Category[]>>(API);
    return res.data;
  },

  getCategoryTree: async () => {
    const res = await axiosInstance.get<ApiResponse<CategoryTree[]>>(`${API}/tree`);
    return res.data;
  },

  getCategoryById: async (categoryId: number) => {
    const res = await axiosInstance.get<ApiResponse<Category>>(`${API}/${categoryId}`);
    return res.data;
  },

  updateCategory: async (categoryId: number, data: UpdateCategoryRequest) => {
    const res = await axiosInstance.put<ApiResponse<Category>>(`${API}/${categoryId}`, data);
    return res.data;
  },

  deleteCategory: async (categoryId: number) => {
    const res = await axiosInstance.delete<ApiResponse<void>>(`${API}/${categoryId}`);
    return res.data;
  },

  getCategoryProducts: async (categoryId: number, params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<ProductResponse>>>(`${API}/${categoryId}/products`, { params });
    return res.data;
  }
};
