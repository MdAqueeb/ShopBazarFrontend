import type { PageResponse } from './product';

export interface Review {
  reviewId: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RatingBreakdown {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface RatingSummary {
  productId: number;
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: RatingBreakdown;
}

export interface AddReviewRequest {
  userId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export type ReviewPageResponse = PageResponse<Review>;
