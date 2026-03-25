import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../api/inventoryApi';
import type { Inventory, CreateInventoryRequest, StockOperationRequest, UpdateInventoryRequest } from '../../types/inventory';
import type { PageResponse } from '../../types/product';

interface InventoryState {
  inventories: PageResponse<Inventory> | null;
  currentInventory: Inventory | null;
  lowStockInventories: PageResponse<Inventory> | null;
  outOfStockInventories: PageResponse<Inventory> | null;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventories: null,
  currentInventory: null,
  lowStockInventories: null,
  outOfStockInventories: null,
  loading: false,
  error: null,
};

export const createNewInventory = createAsyncThunk(
  'inventory/create',
  async (data: CreateInventoryRequest, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createInventory(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create inventory');
    }
  }
);

export const fetchInventoryByProductId = createAsyncThunk(
  'inventory/fetchById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getInventoryByProductId(productId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch inventory');
    }
  }
);

export const modifyInventoryStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ productId, data }: { productId: number; data: UpdateInventoryRequest }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateInventoryStock(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update inventory stock');
    }
  }
);

export const fetchInventories = createAsyncThunk(
  'inventory/fetchAll',
  async (params: { sellerId?: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getInventories(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch inventories');
    }
  }
);

export const increaseProductStock = createAsyncThunk(
  'inventory/increase',
  async ({ productId, data }: { productId: number; data: StockOperationRequest }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.increaseStock(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to increase stock');
    }
  }
);

export const decreaseProductStock = createAsyncThunk(
  'inventory/decrease',
  async ({ productId, data }: { productId: number; data: StockOperationRequest }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.decreaseStock(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to decrease stock');
    }
  }
);

export const reserveProductStock = createAsyncThunk(
  'inventory/reserve',
  async ({ productId, data }: { productId: number; data: StockOperationRequest }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.reserveStock(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to reserve stock');
    }
  }
);

export const releaseProductStock = createAsyncThunk(
  'inventory/release',
  async ({ productId, data }: { productId: number; data: StockOperationRequest }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.releaseStock(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to release stock');
    }
  }
);

export const fetchLowStockInventories = createAsyncThunk(
  'inventory/fetchLow',
  async (params: { threshold?: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getLowStockInventories(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch low stock inventories');
    }
  }
);

export const fetchOutOfStockInventories = createAsyncThunk(
  'inventory/fetchOutOfStock',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getOutOfStockInventories(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch out of stock inventories');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearCurrentInventory: (state) => {
      state.currentInventory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const updateLocalInventory = (state: InventoryState, inventory: Inventory) => {
      if (state.currentInventory?.productId === inventory.productId) {
        state.currentInventory = inventory;
      }
      if (state.inventories && state.inventories.content) {
        const index = state.inventories.content.findIndex(i => i.productId === inventory.productId);
        if (index !== -1) {
          state.inventories.content[index] = inventory;
        }
      }
      if (state.lowStockInventories && state.lowStockInventories.content) {
        const index = state.lowStockInventories.content.findIndex(i => i.productId === inventory.productId);
        if (index !== -1) {
          state.lowStockInventories.content[index] = inventory;
        }
      }
      if (state.outOfStockInventories && state.outOfStockInventories.content) {
        const index = state.outOfStockInventories.content.findIndex(i => i.productId === inventory.productId);
        if (index !== -1) {
          state.outOfStockInventories.content[index] = inventory;
        }
      }
    };

    builder
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(fetchLowStockInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockInventories = action.payload;
      })
      .addCase(fetchOutOfStockInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.outOfStockInventories = action.payload;
      })
      .addMatcher(
        (action) => [
          createNewInventory.fulfilled.type,
          fetchInventoryByProductId.fulfilled.type,
          modifyInventoryStock.fulfilled.type,
          increaseProductStock.fulfilled.type,
          decreaseProductStock.fulfilled.type,
          reserveProductStock.fulfilled.type,
          releaseProductStock.fulfilled.type
        ].includes(action.type),
        (state, action: any) => {
          state.loading = false;
          updateLocalInventory(state, action.payload as Inventory);
        }
      )
      .addMatcher(
        (action) => [
          createNewInventory.pending.type,
          fetchInventoryByProductId.pending.type,
          modifyInventoryStock.pending.type,
          fetchInventories.pending.type,
          increaseProductStock.pending.type,
          decreaseProductStock.pending.type,
          reserveProductStock.pending.type,
          releaseProductStock.pending.type,
          fetchLowStockInventories.pending.type,
          fetchOutOfStockInventories.pending.type
        ].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [
          createNewInventory.rejected.type,
          fetchInventoryByProductId.rejected.type,
          modifyInventoryStock.rejected.type,
          fetchInventories.rejected.type,
          increaseProductStock.rejected.type,
          decreaseProductStock.rejected.type,
          reserveProductStock.rejected.type,
          releaseProductStock.rejected.type,
          fetchLowStockInventories.rejected.type,
          fetchOutOfStockInventories.rejected.type
        ].includes(action.type),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearCurrentInventory, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
