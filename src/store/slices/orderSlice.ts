import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api/orderApi';
import type { 
  OrderResponse, 
  OrderItem, 
  OrderTransaction, 
  CreateOrderRequest, 
  CancelOrderRequest, 
  UpdateOrderStatusRequest 
} from '../../types/order';
import type { PageResponse } from '../../types/product';

interface OrderState {
  orders: PageResponse<OrderResponse> | null;
  userOrders: PageResponse<OrderResponse> | null;
  currentOrder: OrderResponse | null;
  currentOrderItems: OrderItem[];
  currentTransactions: OrderTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  userOrders: null,
  currentOrder: null,
  currentOrderItems: [],
  currentTransactions: [],
  loading: false,
  error: null,
};

export const createNewOrder = createAsyncThunk(
  'order/create',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create order');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrder(orderId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async ({ userId, params }: { userId: number; params: { status?: string; page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getUserOrders(userId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user orders');
    }
  }
);

export const cancelExistingOrder = createAsyncThunk(
  'order/cancel',
  async ({ orderId, data }: { orderId: number; data: CancelOrderRequest }, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelOrder(orderId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
  }
);

export const modifyOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, data }: { orderId: number; data: UpdateOrderStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update order status');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAll',
  async (params: { status?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch all orders');
    }
  }
);

export const fetchOrderItems = createAsyncThunk(
  'order/fetchItems',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderItems(orderId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch order items');
    }
  }
);

export const fetchOrderTransactions = createAsyncThunk(
  'order/fetchTransactions',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderTransactions(orderId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch order transactions');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderItems = [];
      state.currentTransactions = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const updateLocalOrder = (state: OrderState, order: OrderResponse) => {
      if (state.currentOrder?.orderId === order.orderId) {
        state.currentOrder = order;
      }
      if (state.orders && state.orders.content) {
        const index = state.orders.content.findIndex(o => o.orderId === order.orderId);
        if (index !== -1) {
          state.orders.content[index] = order;
        }
      }
      if (state.userOrders && state.userOrders.content) {
        const index = state.userOrders.content.findIndex(o => o.orderId === order.orderId);
        if (index !== -1) {
          state.userOrders.content[index] = order;
        }
      }
    };

    builder
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderItems = action.payload;
      })
      .addCase(fetchOrderTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransactions = action.payload;
      })
      .addMatcher(
        (action) => [
          createNewOrder.fulfilled.type,
          fetchOrderById.fulfilled.type,
          cancelExistingOrder.fulfilled.type,
          modifyOrderStatus.fulfilled.type
        ].includes(action.type),
        (state, action: any) => {
          state.loading = false;
          updateLocalOrder(state, action.payload as OrderResponse);
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('order/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('order/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
