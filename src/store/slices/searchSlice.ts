import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchApi } from '../../api/searchApi';
import type { ProductResponse } from '../../types/product';
import type { SearchQueryParams } from '../../types/search';

interface SearchState {
  products: ProductResponse[];
  suggestions: string[];
  trendingProducts: ProductResponse[];
  popularProducts: ProductResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  products: [],
  suggestions: [],
  trendingProducts: [],
  popularProducts: [],
  loading: false,
  error: null,
};

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (params: { keyword?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await searchApi.searchProducts(params);
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search products');
    }
  }
);

export const searchByCategory = createAsyncThunk(
  'search/searchByCategory',
  async ({ categoryId, params }: { categoryId: number; params: { page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await searchApi.searchByCategory(categoryId, params);
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search by category');
    }
  }
);

export const filterProducts = createAsyncThunk(
  'search/filterProducts',
  async (params: SearchQueryParams, { rejectWithValue }) => {
    try {
      const response = await searchApi.filterProducts(params);
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to filter products');
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'search/getSuggestions',
  async (keyword: string, { rejectWithValue }) => {
    try {
      const response = await searchApi.getSuggestions(keyword);
      if (!response.success) throw new Error(response.message);
      return response.data.suggestions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  'search/getTrending',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const response = await searchApi.getTrendingProducts(limit);
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch trending products');
    }
  }
);

export const fetchPopularProducts = createAsyncThunk(
  'search/getPopular',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await searchApi.getPopularProducts(params);
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch popular products');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.products = [];
      state.suggestions = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // searchProducts
      .addCase(searchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // searchByCategory
      .addCase(searchByCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // filterProducts
      .addCase(filterProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchSuggestions
      .addCase(fetchSuggestions.pending, (state) => { state.error = null; })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // fetchTrendingProducts
      .addCase(fetchTrendingProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingProducts = action.payload;
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchPopularProducts
      .addCase(fetchPopularProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.popularProducts = action.payload;
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearSearch, clearError } = searchSlice.actions;
export default searchSlice.reducer;
