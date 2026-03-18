import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type { User, UpdateUserRequest } from '../types/user.types';

export const userApi = {
  getUser: (userId: number) =>
    axiosInstance.get<ApiResponse<User>>(`/api/users/${userId}`),

  updateUser: (userId: number, data: UpdateUserRequest) =>
    axiosInstance.put<ApiResponse<User>>(`/api/users/${userId}`, data),

  deleteUser: (userId: number) =>
    axiosInstance.delete<ApiResponse<void>>(`/api/users/${userId}`),

  updateUserRole: (userId: number, roleId: number) =>
    axiosInstance.put<ApiResponse<User>>(`/api/users/${userId}/role`, null, {
      params: { roleId },
    }),
};
