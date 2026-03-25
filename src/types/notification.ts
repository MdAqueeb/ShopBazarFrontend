import type { PageResponse } from './product';

export interface Notification {
  notificationId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationPageResponse = PageResponse<Notification>;
