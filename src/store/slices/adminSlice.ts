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
  usersLoading: boolean;
  sellersLoading: boolean;
  productsLoading: boolean;
  ordersLoading: boolean;
  analyticsLoading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: null,
  sellers: null,
  products: null,
  orders: null,
  analytics: null,
  usersLoading: false,
  sellersLoading: false,
  productsLoading: false,
  ordersLoading: false,
  analyticsLoading: false,
  actionLoading: false,
  error: null,
};

// ── Fetch thunks ────────────────────────────────────────────────────────────
export const fetchAllAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try { return await adminApi.getAllUsers(params); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const fetchAllAdminSellers = createAsyncThunk(
  'admin/fetchSellers',
  async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try { return await adminApi.getAllSellers(params); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const fetchAllAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try { return await adminApi.getAllProducts(params); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const fetchAllAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try { return await adminApi.getAllOrders(params); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const fetchPlatformAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try { return await adminApi.getPlatformAnalytics(params); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

// ── Action thunks ───────────────────────────────────────────────────────────
export const blockAdminUser = createAsyncThunk(
  'admin/blockUser',
  async ({ userId, reason }: { userId: number; reason: string }, { rejectWithValue }) => {
    try { return await adminApi.blockUser(userId, reason); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const unblockAdminUser = createAsyncThunk(
  'admin/unblockUser',
  async (userId: number, { rejectWithValue }) => {
    try { return await adminApi.unblockUser(userId); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const approveAdminSeller = createAsyncThunk(
  'admin/approveSeller',
  async (sellerId: number, { rejectWithValue }) => {
    try { return await adminApi.approveSeller(sellerId); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const rejectAdminSeller = createAsyncThunk(
  'admin/rejectSeller',
  async ({ sellerId, reason }: { sellerId: number; reason: string }, { rejectWithValue }) => {
    try { return await adminApi.rejectSeller(sellerId, reason); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const approveAdminProduct = createAsyncThunk(
  'admin/approveProduct',
  async (productId: number, { rejectWithValue }) => {
    try { return await adminApi.approveProduct(productId); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

export const blockAdminProduct = createAsyncThunk(
  'admin/blockProduct',
  async ({ productId, reason }: { productId: number; reason: string }, { rejectWithValue }) => {
    try { return await adminApi.blockProduct(productId, reason); } catch (e: any) { return rejectWithValue(e.message); }
  },
);

// ── Helpers ─────────────────────────────────────────────────────────────────
const updateInList = (list: PageResponse<any> | null, item: any, idKey: string) => {
  if (list?.content) {
    const index = list.content.findIndex((x: any) => x[idKey] === item[idKey]);
    if (index !== -1) list.content[index] = item;
  }
};

// ── Slice ───────────────────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ── Users ─────────────────────────────────────
    builder.addCase(fetchAllAdminUsers.pending, (state) => { state.usersLoading = true; state.error = null; });
    builder.addCase(fetchAllAdminUsers.fulfilled, (state, action) => { state.usersLoading = false; state.users = action.payload; });
    builder.addCase(fetchAllAdminUsers.rejected, (state, action) => { state.usersLoading = false; state.error = action.payload as string; });

    // ── Sellers ───────────────────────────────────
    builder.addCase(fetchAllAdminSellers.pending, (state) => { state.sellersLoading = true; state.error = null; });
    builder.addCase(fetchAllAdminSellers.fulfilled, (state, action) => { state.sellersLoading = false; state.sellers = action.payload; });
    builder.addCase(fetchAllAdminSellers.rejected, (state, action) => { state.sellersLoading = false; state.error = action.payload as string; });

    // ── Products ──────────────────────────────────
    builder.addCase(fetchAllAdminProducts.pending, (state) => { state.productsLoading = true; state.error = null; });
    builder.addCase(fetchAllAdminProducts.fulfilled, (state, action) => { state.productsLoading = false; state.products = action.payload; });
    builder.addCase(fetchAllAdminProducts.rejected, (state, action) => { state.productsLoading = false; state.error = action.payload as string; });

    // ── Orders ────────────────────────────────────
    builder.addCase(fetchAllAdminOrders.pending, (state) => { state.ordersLoading = true; state.error = null; });
    builder.addCase(fetchAllAdminOrders.fulfilled, (state, action) => { state.ordersLoading = false; state.orders = action.payload; });
    builder.addCase(fetchAllAdminOrders.rejected, (state, action) => { state.ordersLoading = false; state.error = action.payload as string; });

    // ── Analytics ─────────────────────────────────
    builder.addCase(fetchPlatformAnalytics.pending, (state) => { state.analyticsLoading = true; state.error = null; });
    builder.addCase(fetchPlatformAnalytics.fulfilled, (state, action) => { state.analyticsLoading = false; state.analytics = action.payload; });
    builder.addCase(fetchPlatformAnalytics.rejected, (state, action) => { state.analyticsLoading = false; state.error = action.payload as string; });

    // ── Actions (block/unblock/approve/reject) ────
    builder.addCase(blockAdminUser.pending, (state) => { state.actionLoading = true; });
    builder.addCase(blockAdminUser.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.users, action.payload, 'userId'); });
    builder.addCase(blockAdminUser.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(unblockAdminUser.pending, (state) => { state.actionLoading = true; });
    builder.addCase(unblockAdminUser.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.users, action.payload, 'userId'); });
    builder.addCase(unblockAdminUser.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(approveAdminSeller.pending, (state) => { state.actionLoading = true; });
    builder.addCase(approveAdminSeller.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.sellers, action.payload, 'sellerId'); });
    builder.addCase(approveAdminSeller.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(rejectAdminSeller.pending, (state) => { state.actionLoading = true; });
    builder.addCase(rejectAdminSeller.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.sellers, action.payload, 'sellerId'); });
    builder.addCase(rejectAdminSeller.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(approveAdminProduct.pending, (state) => { state.actionLoading = true; });
    builder.addCase(approveAdminProduct.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.products, action.payload, 'productId'); });
    builder.addCase(approveAdminProduct.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(blockAdminProduct.pending, (state) => { state.actionLoading = true; });
    builder.addCase(blockAdminProduct.fulfilled, (state, action) => { state.actionLoading = false; updateInList(state.products, action.payload, 'productId'); });
    builder.addCase(blockAdminProduct.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
