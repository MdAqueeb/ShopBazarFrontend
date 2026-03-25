import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';
import type { PageResponse } from '../../types/product';
import type { AdminUser, AdminSeller, AdminProduct, AdminOrder, PlatformAnalytics } from '../../types/admin';

interface AdminState {
  users: PageResponse<AdminUser> | null;
  sellers: PageResponse<AdminSeller> | null;
  products: PageResponse<AdminProduct> | null;
  orders: PageResponse<AdminOrder> | null;
  analytics: PlatformAnalytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: null,
  sellers: null,
  products: null,
  orders: null,
  analytics: null,
  loading: false,
  error: null,
};

export const fetchAllAdminUsers = createAsyncThunk('admin/fetchUsers', async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
  try { return await adminApi.getAllUsers(params); } catch (e: any) { return rejectWithValue(e.message); }
});
export const blockAdminUser = createAsyncThunk('admin/blockUser', async ({ userId, reason }: { userId: number; reason: string }, { rejectWithValue }) => {
  try { return await adminApi.blockUser(userId, reason); } catch (e: any) { return rejectWithValue(e.message); }
});
export const unblockAdminUser = createAsyncThunk('admin/unblockUser', async (userId: number, { rejectWithValue }) => {
  try { return await adminApi.unblockUser(userId); } catch (e: any) { return rejectWithValue(e.message); }
});

export const fetchAllAdminSellers = createAsyncThunk('admin/fetchSellers', async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
  try { return await adminApi.getAllSellers(params); } catch (e: any) { return rejectWithValue(e.message); }
});
export const approveAdminSeller = createAsyncThunk('admin/approveSeller', async (sellerId: number, { rejectWithValue }) => {
  try { return await adminApi.approveSeller(sellerId); } catch (e: any) { return rejectWithValue(e.message); }
});
export const rejectAdminSeller = createAsyncThunk('admin/rejectSeller', async ({ sellerId, reason }: { sellerId: number; reason: string }, { rejectWithValue }) => {
  try { return await adminApi.rejectSeller(sellerId, reason); } catch (e: any) { return rejectWithValue(e.message); }
});

export const fetchAllAdminProducts = createAsyncThunk('admin/fetchProducts', async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
  try { return await adminApi.getAllProducts(params); } catch (e: any) { return rejectWithValue(e.message); }
});
export const approveAdminProduct = createAsyncThunk('admin/approveProduct', async (productId: number, { rejectWithValue }) => {
  try { return await adminApi.approveProduct(productId); } catch (e: any) { return rejectWithValue(e.message); }
});
export const blockAdminProduct = createAsyncThunk('admin/blockProduct', async ({ productId, reason }: { productId: number; reason: string }, { rejectWithValue }) => {
  try { return await adminApi.blockProduct(productId, reason); } catch (e: any) { return rejectWithValue(e.message); }
});

export const fetchAllAdminOrders = createAsyncThunk('admin/fetchOrders', async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
  try { return await adminApi.getAllOrders(params); } catch (e: any) { return rejectWithValue(e.message); }
});

export const fetchPlatformAnalytics = createAsyncThunk('admin/fetchAnalytics', async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
  try { return await adminApi.getPlatformAnalytics(params); } catch (e: any) { return rejectWithValue(e.message); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    // Fulfilled updates
    builder.addCase(fetchAllAdminUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; });
    builder.addCase(fetchAllAdminSellers.fulfilled, (state, action) => { state.loading = false; state.sellers = action.payload; });
    builder.addCase(fetchAllAdminProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; });
    builder.addCase(fetchAllAdminOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; });
    builder.addCase(fetchPlatformAnalytics.fulfilled, (state, action) => { state.loading = false; state.analytics = action.payload; });

    const updateInList = (list: PageResponse<any> | null, item: any, idKey: string) => {
      if (list && list.content) {
        const index = list.content.findIndex((x: any) => x[idKey] === item[idKey]);
        if (index !== -1) list.content[index] = item;
      }
    };

    builder.addCase(blockAdminUser.fulfilled, (state, action) => { state.loading = false; updateInList(state.users, action.payload, 'userId'); });
    builder.addCase(unblockAdminUser.fulfilled, (state, action) => { state.loading = false; updateInList(state.users, action.payload, 'userId'); });
    builder.addCase(approveAdminSeller.fulfilled, (state, action) => { state.loading = false; updateInList(state.sellers, action.payload, 'sellerId'); });
    builder.addCase(rejectAdminSeller.fulfilled, (state, action) => { state.loading = false; updateInList(state.sellers, action.payload, 'sellerId'); });
    builder.addCase(approveAdminProduct.fulfilled, (state, action) => { state.loading = false; updateInList(state.products, action.payload, 'productId'); });
    builder.addCase(blockAdminProduct.fulfilled, (state, action) => { state.loading = false; updateInList(state.products, action.payload, 'productId'); });

    // Matchers for loading/error
    builder.addMatcher(
      (action) => action.type.startsWith('admin/') && action.type.endsWith('/pending'),
      (state) => { state.loading = true; state.error = null; }
    );
    builder.addMatcher(
      (action) => action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
      (state, action: any) => { state.loading = false; state.error = action.payload as string; }
    );
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
