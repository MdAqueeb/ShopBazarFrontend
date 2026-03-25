import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../types/product';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../types/address';

const getBaseUrl = (userId: number) => `http://localhost:8080/api/users/${userId}/addresses`;

export const addressApi = {
  createAddress: async (userId: number, data: CreateAddressRequest) => {
    const res = await axiosInstance.post<ApiResponse<Address>>(getBaseUrl(userId), data);
    return res.data;
  },

  getUserAddresses: async (userId: number) => {
    const res = await axiosInstance.get<ApiResponse<Address[]>>(getBaseUrl(userId));
    return res.data;
  },

  getAddressById: async (userId: number, addressId: number) => {
    const res = await axiosInstance.get<ApiResponse<Address>>(`${getBaseUrl(userId)}/${addressId}`);
    return res.data;
  },

  updateAddress: async (userId: number, addressId: number, data: UpdateAddressRequest) => {
    const res = await axiosInstance.put<ApiResponse<Address>>(`${getBaseUrl(userId)}/${addressId}`, data);
    return res.data;
  },

  deleteAddress: async (userId: number, addressId: number) => {
    const res = await axiosInstance.delete<ApiResponse<void>>(`${getBaseUrl(userId)}/${addressId}`);
    return res.data;
  },

  setDefaultAddress: async (userId: number, addressId: number) => {
    const res = await axiosInstance.put<ApiResponse<Address>>(`${getBaseUrl(userId)}/${addressId}/default`);
    return res.data;
  }
};
