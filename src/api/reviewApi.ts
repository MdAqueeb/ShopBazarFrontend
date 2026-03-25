import axiosInstance from './axiosInstance';
import type { 
  Review, 
  RatingSummary, 
  AddReviewRequest, 
  UpdateReviewRequest, 
  ReviewPageResponse 
} from '../types/review';

const API = 'http://localhost:8080/api';

const unwrap = <T>(res: any): T => (res.data?.data !== undefined ? res.data.data : res.data);

export const reviewApi = {
  addReview: async (productId: number, data: AddReviewRequest) => {
    const res = await axiosInstance.post<any>(`${API}/products/${productId}/reviews`, data);
    return unwrap<Review>(res);
  },

  getProductReviews: async (productId: number, params: { page?: number; size?: number }) => {
    const res = await axiosInstance.get<any>(`${API}/products/${productId}/reviews`, { params });
    return unwrap<ReviewPageResponse>(res);
  },

  getRatingSummary: async (productId: number) => {
    const res = await axiosInstance.get<any>(`${API}/products/${productId}/ratings`);
    return unwrap<RatingSummary>(res);
  },

  updateReview: async (reviewId: number, data: UpdateReviewRequest) => {
    const res = await axiosInstance.put<any>(`${API}/reviews/${reviewId}`, data);
    return unwrap<Review>(res);
  },

  deleteReview: async (reviewId: number) => {
    const res = await axiosInstance.delete<any>(`${API}/reviews/${reviewId}`);
    return unwrap<any>(res);
  }
};
