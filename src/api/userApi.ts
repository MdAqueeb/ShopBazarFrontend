import axiosInstance from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/product';
import type { User, UpdateUserRequest, UserStatus } from '../types/user';

const API = 'http://localhost:8080/api/users';

export const userApi = {
  getUserProfile: async (userId: number) => {
    const res = await axiosInstance.get<ApiResponse<User>>(`${API}/${userId}`);
    return res.data;
  },

  updateUserProfile: async (userId: number, data: UpdateUserRequest) => {
    const res = await axiosInstance.put<ApiResponse<User>>(`${API}/${userId}`, data);
    return res.data;
  },

  deleteUserProfile: async (userId: number) => {
    const res = await axiosInstance.delete<ApiResponse<void>>(`${API}/${userId}`);
    return res.data;
  },

  getAllUsers: async (params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<ApiResponse<PageResponse<User>>>(API, { params });
    return res.data;
  },

  updateUserStatus: async (userId: number, status: UserStatus) => {
    const res = await axiosInstance.patch<ApiResponse<User>>(`${API}/${userId}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  updateUserRole: async (userId: number, roleId: number) => {
    const res = await axiosInstance.put<ApiResponse<User>>(`${API}/${userId}/role`, null, {
      params: { roleId }
    });
    return res.data;
  }
};
