import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';
import type { User, UpdateUserRequest, UserStatus } from '../../types/user';
import type { PageResponse } from '../../types/product';

interface UserState {
  users: PageResponse<User> | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: null,
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserProfile(userId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user profile');
    }
  }
);

export const modifyUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }: { userId: number; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserProfile(userId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update user profile');
    }
  }
);

export const removeUserProfile = createAsyncThunk(
  'user/deleteProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUserProfile(userId);
      if (!response.success) throw new Error(response.message);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete user profile');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAll',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsers(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  }
);

export const modifyUserStatus = createAsyncThunk(
  'user/updateStatus',
  async ({ userId, status }: { userId: number; status: UserStatus }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserStatus(userId, status);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update user status');
    }
  }
);

export const modifyUserRole = createAsyncThunk(
  'user/updateRole',
  async ({ userId, roleId }: { userId: number; roleId: number }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserRole(userId, roleId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update user role');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // modifyUserProfile
      .addCase(modifyUserProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(modifyUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        if (state.users && state.users.content) {
          const index = state.users.content.findIndex(u => u.userId === action.payload.userId);
          if (index !== -1) {
            state.users.content[index] = action.payload;
          }
        }
      })
      .addCase(modifyUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // removeUserProfile
      .addCase(removeUserProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser?.userId === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(removeUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // modifyUserStatus
      .addCase(modifyUserStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(modifyUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser?.userId === action.payload.userId) {
          state.currentUser = action.payload;
        }
        if (state.users && state.users.content) {
          const index = state.users.content.findIndex(u => u.userId === action.payload.userId);
          if (index !== -1) {
            state.users.content[index] = action.payload;
          }
        }
      })
      .addCase(modifyUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // modifyUserRole
      .addCase(modifyUserRole.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(modifyUserRole.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser?.userId === action.payload.userId) {
          state.currentUser = action.payload;
        }
        if (state.users && state.users.content) {
          const index = state.users.content.findIndex(u => u.userId === action.payload.userId);
          if (index !== -1) {
            state.users.content[index] = action.payload;
          }
        }
      })
      .addCase(modifyUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
