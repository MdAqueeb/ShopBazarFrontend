import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sellerApi } from '../../api/sellerApi';
import type { 
  Seller, 
  SellerAnalytics, 
  SellerDashboard, 
  OrderItem, 
  ApplySellerRequest, 
  UpdateSellerRequest 
} from '../../types/seller';
import type { PageResponse, ProductResponse } from '../../types/product';

interface SellerState {
  currentSeller: Seller | null;
  dashboard: SellerDashboard | null;
  analytics: SellerAnalytics | null;
  products: PageResponse<ProductResponse> | null;
  orders: PageResponse<OrderItem> | null;
  loading: boolean;
  error: string | null;
}

const initialState: SellerState = {
  currentSeller: null,
  dashboard: null,
  analytics: null,
  products: null,
  orders: null,
  loading: false,
  error: null,
};

export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async (sellerId: number, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerProfile(sellerId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch seller profile');
    }
  }
);

export const modifySellerProfile = createAsyncThunk(
  'seller/updateProfile',
  async ({ sellerId, data }: { sellerId: number; data: UpdateSellerRequest }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.updateSellerProfile(sellerId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update seller profile');
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async ({ sellerId, params }: { sellerId: number; params: { status?: string; page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerProducts(sellerId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch seller products');
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchOrders',
  async ({ sellerId, params }: { sellerId: number; params: { page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerOrders(sellerId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch seller orders');
    }
  }
);

export const fetchSellerAnalytics = createAsyncThunk(
  'seller/fetchAnalytics',
  async ({ sellerId, params }: { sellerId: number; params: { startDate: string; endDate: string } }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerAnalytics(sellerId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch seller analytics');
    }
  }
);

export const applyForSeller = createAsyncThunk(
  'seller/apply',
  async (data: ApplySellerRequest, { rejectWithValue }) => {
    try {
      const response = await sellerApi.applyForSeller(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to apply for seller');
    }
  }
);

export const fetchSellerDashboard = createAsyncThunk(
  'seller/fetchDashboard',
  async (sellerId: number, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerDashboard(sellerId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch seller dashboard');
    }
  }
);

export const deactivateSeller = createAsyncThunk(
  'seller/deactivate',
  async (sellerId: number, { rejectWithValue }) => {
    try {
      const response = await sellerApi.deactivateSeller(sellerId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to deactivate seller');
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearCurrentSeller: (state) => {
      state.currentSeller = null;
      state.dashboard = null;
      state.analytics = null;
      state.products = null;
      state.orders = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(modifySellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(applyForSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(deactivateSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(fetchSellerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith('seller/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('seller/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearCurrentSeller, clearError } = sellerSlice.actions;
export default sellerSlice.reducer;
