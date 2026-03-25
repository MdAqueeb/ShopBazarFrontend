import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi } from '../../api/notificationApi';
import type { NotificationPageResponse } from '../../types/notification';

interface NotificationState {
  notifications: NotificationPageResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: null,
  loading: false,
  error: null,
};

export const fetchUserNotifications = createAsyncThunk(
  'notification/fetchUserNotifications',
  async ({ userId, params }: { userId: number; params: { unreadOnly?: boolean; page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUserNotifications(userId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await notificationApi.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to mark notification as read');
    }
  }
);

export const removeNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        if (state.notifications && state.notifications.content) {
          const notification = state.notifications.content.find(n => n.notificationId === action.payload);
          if (notification) {
            notification.isRead = true;
          }
        }
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.loading = false;
        if (state.notifications && state.notifications.content) {
          state.notifications.content = state.notifications.content.filter(n => n.notificationId !== action.payload);
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('notification/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('notification/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
