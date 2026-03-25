import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/product';
import type { SearchProductsResponse, SuggestionsResponse, SearchQueryParams } from '../types/search';

const API = '/api/search';

export const searchApi = {
  searchProducts: async (params: { keyword?: string; page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<SearchProductsResponse>>(API, { params });
    return res.data;
  },

  searchByCategory: async (categoryId: number, params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<SearchProductsResponse>>(`${API}/category/${categoryId}`, { params });
    return res.data;
  },

  filterProducts: async (params: SearchQueryParams) => {
    const res = await axiosInstance.get<ApiResponse<SearchProductsResponse>>(`${API}/filter`, { params });
    return res.data;
  },

  getSuggestions: async (keyword: string) => {
    const res = await axiosInstance.get<ApiResponse<SuggestionsResponse>>(`${API}/suggestions`, { params: { keyword } });
    return res.data;
  },

  getTrendingProducts: async (limit?: number) => {
    const res = await axiosInstance.get<ApiResponse<SearchProductsResponse>>(`${API}/trending`, { params: { limit } });
    return res.data;
  },

  getPopularProducts: async (params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<SearchProductsResponse>>(`${API}/popular`, { params });
    return res.data;
  }
};
