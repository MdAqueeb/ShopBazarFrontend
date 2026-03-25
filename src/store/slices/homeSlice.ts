import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import type { ProductResponse, PageResponse } from '../../types/product';
import type { Category } from '../../types/category';

interface HomeState {
  featuredProducts: ProductResponse[];
  trendingProducts: ProductResponse[];
  newArrivals: ProductResponse[];
  categories: Category[];
  featuredLoading: boolean;
  trendingLoading: boolean;
  newArrivalsLoading: boolean;
  categoriesLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  featuredProducts: [],
  trendingProducts: [],
  newArrivals: [],
  categories: [],
  featuredLoading: false,
  trendingLoading: false,
  newArrivalsLoading: false,
  categoriesLoading: false,
  error: null,
};

export const fetchFeaturedProducts = createAsyncThunk(
  'home/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts({ page: 0, size: 8 });
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  'home/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts({ page: 1, size: 8 });
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch trending products');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'home/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts({ page: 2, size: 8 });
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchHomeCategories = createAsyncThunk(
  'home/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Featured
      .addCase(fetchFeaturedProducts.pending, (state) => { state.featuredLoading = true; state.error = null; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = (action.payload as PageResponse<ProductResponse>).content ?? [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload as string;
      })

      // Trending
      .addCase(fetchTrendingProducts.pending, (state) => { state.trendingLoading = true; state.error = null; })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trendingProducts = (action.payload as PageResponse<ProductResponse>).content ?? [];
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload as string;
      })

      // New Arrivals
      .addCase(fetchNewArrivals.pending, (state) => { state.newArrivalsLoading = true; state.error = null; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivals = (action.payload as PageResponse<ProductResponse>).content ?? [];
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.newArrivalsLoading = false;
        state.error = action.payload as string;
      })

      // Categories
      .addCase(fetchHomeCategories.pending, (state) => { state.categoriesLoading = true; state.error = null; })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHomeError } = homeSlice.actions;
export default homeSlice.reducer;
