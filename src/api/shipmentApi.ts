import axiosInstance from './axiosInstance';
import type { 
  Shipment, 
  TrackingHistoryResponse, 
  TrackingUpdateResponse,
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
  AddTrackingUpdateRequest
} from '../types/shipment';

const API = 'http://localhost:8080/api';

// Handle mixed outputs gracefully if there's ever a generic wrapper inside 'data' or directly natively parsed
const unwrap = <T>(res: any): T => (res.data?.data !== undefined ? res.data.data : res.data);

export const shipmentApi = {
  createShipment: async (data: CreateShipmentRequest) => {
    const res = await axiosInstance.post<any>(`${API}/shipments`, data);
    return unwrap<Shipment>(res);
  },

  getShipmentById: async (shipmentId: number) => {
    const res = await axiosInstance.get<any>(`${API}/shipments/${shipmentId}`);
    return unwrap<Shipment>(res);
  },

  updateShipmentStatus: async (shipmentId: number, data: UpdateShipmentStatusRequest) => {
    const res = await axiosInstance.put<any>(`${API}/shipments/${shipmentId}/status`, data);
    return unwrap<Shipment>(res);
  },

  getShipmentByOrderId: async (orderId: number) => {
    const res = await axiosInstance.get<any>(`${API}/orders/${orderId}/shipment`);
    return unwrap<Shipment>(res);
  },

  addTrackingUpdate: async (shipmentId: number, data: AddTrackingUpdateRequest) => {
    const res = await axiosInstance.post<any>(`${API}/shipments/${shipmentId}/tracking`, data);
    return unwrap<TrackingUpdateResponse>(res);
  },

  getTrackingHistory: async (shipmentId: number) => {
    const res = await axiosInstance.get<any>(`${API}/shipments/${shipmentId}/tracking`);
    return unwrap<TrackingHistoryResponse>(res);
  }
};
