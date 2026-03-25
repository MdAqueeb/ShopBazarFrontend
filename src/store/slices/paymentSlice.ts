import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../api/paymentApi';
import type { 
  Payment,
  InitiatePaymentRequest,
  VerifyPaymentRequest,
  RefundPaymentRequest
} from '../../types/payment';

interface PaymentState {
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  currentPayment: null,
  loading: false,
  error: null,
};

export const initiateNewPayment = createAsyncThunk(
  'payment/initiate',
  async (data: InitiatePaymentRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.initiatePayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to initiate payment');
    }
  }
);

export const fetchPayment = createAsyncThunk(
  'payment/fetch',
  async (paymentId: number, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPayment(paymentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch payment');
    }
  }
);

export const verifyExistingPayment = createAsyncThunk(
  'payment/verify',
  async (data: VerifyPaymentRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.verifyPayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to verify payment');
    }
  }
);

export const refundExistingPayment = createAsyncThunk(
  'payment/refund',
  async (data: RefundPaymentRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.refundPayment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to refund payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => [
          initiateNewPayment.fulfilled.type,
          fetchPayment.fulfilled.type,
          verifyExistingPayment.fulfilled.type,
          refundExistingPayment.fulfilled.type
        ].includes(action.type),
        (state, action: any) => {
          state.loading = false;
          state.currentPayment = action.payload as Payment;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('payment/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('payment/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearCurrentPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
