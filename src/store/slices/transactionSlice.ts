import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionApi } from '../../api/transactionApi';
import type { Transaction } from '../../types/transaction';

interface TransactionState {
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
  loading: false,
  error: null,
};

export const fetchTransactionById = createAsyncThunk(
  'transaction/fetchById',
  async (transactionId: number, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactionById(transactionId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch transaction');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentTransaction, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
