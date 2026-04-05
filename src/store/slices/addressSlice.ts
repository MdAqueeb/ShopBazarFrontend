import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressApi } from '../../api/addressApi';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../../types/address';

interface AddressState {
  addresses: Address[];
  currentAddress: Address | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  currentAddress: null,
  loading: false,
  error: null,
};

export const createNewAddress = createAsyncThunk(
  'address/create',
  async ({ userId, data }: { userId: number; data: CreateAddressRequest }, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(userId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create address');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'address/fetchAll',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await addressApi.getUserAddresses(userId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch addresses');
    }
  }
);

export const fetchAddressById = createAsyncThunk(
  'address/fetchById',
  async ({ userId, addressId }: { userId: number; addressId: number }, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddressById(userId, addressId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch address');
    }
  }
);

export const modifyAddress = createAsyncThunk(
  'address/update',
  async ({ userId, addressId, data }: { userId: number; addressId: number; data: UpdateAddressRequest }, { rejectWithValue }) => {
    try {
      const response = await addressApi.updateAddress(userId, addressId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update address');
    }
  }
);

export const removeAddress = createAsyncThunk(
  'address/delete',
  async ({ userId, addressId }: { userId: number; addressId: number }, { rejectWithValue }) => {
    try {
      const response = await addressApi.deleteAddress(userId, addressId);
      if (!response.success) throw new Error(response.message);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete address');
    }
  }
);

export const makeDefaultAddress = createAsyncThunk(
  'address/setDefault',
  async ({ userId, addressId }: { userId: number; addressId: number }, { rejectWithValue }) => {
    try {
      const response = await addressApi.setDefaultAddress(userId, addressId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to set default address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearCurrentAddress: (state) => {
      state.currentAddress = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createNewAddress
      .addCase(createNewAddress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNewAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isDefault) {
           state.addresses.forEach(addr => addr.isDefault = false);
        }
        state.addresses.push(action.payload);
      })
      .addCase(createNewAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchUserAddresses
      .addCase(fetchUserAddresses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.addresses = [];
      })

      // fetchAddressById
      .addCase(fetchAddressById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAddress = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // modifyAddress
      .addCase(modifyAddress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(modifyAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isDefault) {
           state.addresses.forEach(addr => addr.isDefault = false);
        }
        const index = state.addresses.findIndex(addr => addr.addressId === action.payload.addressId);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        if (state.currentAddress?.addressId === action.payload.addressId) {
          state.currentAddress = action.payload;
        }
      })
      .addCase(modifyAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // removeAddress
      .addCase(removeAddress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = Array.isArray(state.addresses) ? state.addresses.filter(addr => addr.addressId !== action.payload) : [];
        if (state.currentAddress?.addressId === action.payload) {
          state.currentAddress = null;
        }
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // makeDefaultAddress
      .addCase(makeDefaultAddress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(makeDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.forEach(addr => addr.isDefault = false);
        const index = state.addresses.findIndex(addr => addr.addressId === action.payload.addressId);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(makeDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentAddress, clearError } = addressSlice.actions;
export default addressSlice.reducer;
