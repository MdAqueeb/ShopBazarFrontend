import axiosInstance from './axiosInstance';
import type { 
  Payment,
  InitiatePaymentRequest,
  VerifyPaymentRequest,
  RefundPaymentRequest
} from '../types/payment';

const API = 'http://localhost:8080/api/payments';

const unwrap = <T>(res: any): T => (res.data?.data !== undefined ? res.data.data : res.data);

export const paymentApi = {
  initiatePayment: async (data: InitiatePaymentRequest) => {
    const res = await axiosInstance.post<any>(`${API}/`, data);
    return unwrap<Payment>(res);
  },

  getPayment: async (paymentId: number) => {
    const res = await axiosInstance.get<any>(`${API}/${paymentId}`);
    return unwrap<Payment>(res);
  },

  verifyPayment: async (data: VerifyPaymentRequest) => {
    const res = await axiosInstance.post<any>(`${API}/verify`, data);
    return unwrap<Payment>(res);
  },

  refundPayment: async (data: RefundPaymentRequest) => {
    const res = await axiosInstance.post<any>(`${API}/refund`, data);
    return unwrap<Payment>(res);
  }
};
