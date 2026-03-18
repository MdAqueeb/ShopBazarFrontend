import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/auth.types';
import type { User } from '../types/user.types';

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<ApiResponse<User>>('/api/auth/register', data),

  logout: (data: RefreshTokenRequest) =>
    axiosInstance.post<ApiResponse<void>>('/api/auth/logout', data),

  refreshToken: (data: RefreshTokenRequest) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/refresh-token', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosInstance.post<ApiResponse<void>>('/api/auth/forgot-password', data),

  resetPassword: (token: string, data: ResetPasswordRequest) =>
    axiosInstance.post<ApiResponse<void>>('/api/auth/reset-password', data, { params: { token } }),

  verifyEmail: (token: string) =>
    axiosInstance.post<ApiResponse<void>>('/api/auth/verify-email', null, { params: { token } }),
};
