import axiosInstance from './axiosInstance';
import type { NotificationPageResponse } from '../types/notification';

const API = 'http://localhost:8080/api';

const unwrap = <T>(res: any): T => (res.data?.data !== undefined ? res.data.data : res.data);

export const notificationApi = {
  getUserNotifications: async (userId: number, params: { unreadOnly?: boolean; page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/users/${userId}/notifications`, { params });
    return unwrap<NotificationPageResponse>(res);
  },

  markAsRead: async (notificationId: number) => {
    const res = await axiosInstance.put<any>(`${API}/notifications/${notificationId}/read`);
    return unwrap<any>(res);
  },

  deleteNotification: async (notificationId: number) => {
    const res = await axiosInstance.delete<any>(`${API}/notifications/${notificationId}`);
    return unwrap<any>(res);
  }
};
