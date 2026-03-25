import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewApi } from '../../api/reviewApi';
import type { 
  RatingSummary, 
  AddReviewRequest, 
  UpdateReviewRequest, 
  ReviewPageResponse 
} from '../../types/review';

interface ReviewState {
  reviews: ReviewPageResponse | null;
  ratingSummary: RatingSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: null,
  ratingSummary: null,
  loading: false,
  error: null,
};

export const submitProductReview = createAsyncThunk(
  'review/addReview',
  async ({ productId, data }: { productId: number; data: AddReviewRequest }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.addReview(productId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to submit review');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'review/fetchReviews',
  async ({ productId, params }: { productId: number; params: { page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getProductReviews(productId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchRatingSummary = createAsyncThunk(
  'review/fetchSummary',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getRatingSummary(productId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch rating summary');
    }
  }
);

export const modifyReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, data }: { reviewId: number; data: UpdateReviewRequest }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.updateReview(reviewId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update review');
    }
  }
);

export const removeReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingSummary = action.payload;
      })
      .addCase(submitProductReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.reviews && state.reviews.content) {
          state.reviews.content.unshift(action.payload);
        }
      })
      .addCase(modifyReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.reviews && state.reviews.content) {
          const index = state.reviews.content.findIndex(r => r.reviewId === action.payload.reviewId);
          if (index !== -1) {
            state.reviews.content[index] = action.payload;
          }
        }
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.reviews && state.reviews.content) {
          state.reviews.content = state.reviews.content.filter(r => r.reviewId !== action.payload);
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('review/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('review/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
