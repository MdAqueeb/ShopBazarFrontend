export interface Shipment {
  shipmentId: number;
  orderId: number;
  shipmentStatus: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface TrackingUpdate {
  status: string;
  location: string;
  description: string;
  time: string;
}

export interface TrackingHistoryResponse {
  shipmentId: number;
  tracking: TrackingUpdate[];
}

export interface TrackingUpdateResponse {
  trackingId: number;
  shipmentId: number;
  status: string;
  message: string;
}

export interface CreateShipmentRequest {
  orderId: number;
  carrier: string;
  estimatedDelivery: string;
}

export interface UpdateShipmentStatusRequest {
  status: string;
}

export interface AddTrackingUpdateRequest {
  status: string;
  location: string;
  description: string;
}
