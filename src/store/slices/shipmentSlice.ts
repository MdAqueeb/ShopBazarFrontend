import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shipmentApi } from '../../api/shipmentApi';
import type { 
  Shipment, 
  TrackingHistoryResponse, 
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
  AddTrackingUpdateRequest
} from '../../types/shipment';

interface ShipmentState {
  currentShipment: Shipment | null;
  trackingHistory: TrackingHistoryResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShipmentState = {
  currentShipment: null,
  trackingHistory: null,
  loading: false,
  error: null,
};

export const createNewShipment = createAsyncThunk(
  'shipment/create',
  async (data: CreateShipmentRequest, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.createShipment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create shipment');
    }
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipment/fetchById',
  async (shipmentId: number, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.getShipmentById(shipmentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch shipment');
    }
  }
);

export const fetchShipmentByOrderId = createAsyncThunk(
  'shipment/fetchByOrderId',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.getShipmentByOrderId(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch shipment by order');
    }
  }
);

export const modifyShipmentStatus = createAsyncThunk(
  'shipment/updateStatus',
  async ({ shipmentId, data }: { shipmentId: number; data: UpdateShipmentStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.updateShipmentStatus(shipmentId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update shipment status');
    }
  }
);

export const submitTrackingUpdate = createAsyncThunk(
  'shipment/addTracking',
  async ({ shipmentId, data }: { shipmentId: number; data: AddTrackingUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.addTrackingUpdate(shipmentId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add tracking update');
    }
  }
);

export const fetchTrackingHistory = createAsyncThunk(
  'shipment/fetchTrackingHistory',
  async (shipmentId: number, { rejectWithValue }) => {
    try {
      const response = await shipmentApi.getTrackingHistory(shipmentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch tracking history');
    }
  }
);

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
      state.trackingHistory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingHistory = action.payload;
      })
      .addMatcher(
        (action) => [
          createNewShipment.fulfilled.type,
          fetchShipmentById.fulfilled.type,
          fetchShipmentByOrderId.fulfilled.type,
          modifyShipmentStatus.fulfilled.type
        ].includes(action.type),
        (state, action: any) => {
          state.loading = false;
          state.currentShipment = action.payload as Shipment;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('shipment/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('shipment/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearCurrentShipment, clearError } = shipmentSlice.actions;
export default shipmentSlice.reducer;
