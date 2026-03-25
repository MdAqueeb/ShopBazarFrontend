import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '../../api/categoryApi';
import type { Category, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/category';
import type { PageResponse, ProductResponse } from '../../types/product';

interface CategoryState {
  categories: Category[];
  categoryTree: CategoryTree[];
  currentCategory: Category | null;
  categoryProducts: PageResponse<ProductResponse> | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  categoryProducts: null,
  loading: false,
  error: null,
};

export const createNewCategory = createAsyncThunk(
  'category/create',
  async (data: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await categoryApi.createCategory(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create category');
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'category/fetchAll',
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

export const fetchCategoryTree = createAsyncThunk(
  'category/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategoryTree();
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch category tree');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchById',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategoryById(categoryId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch category');
    }
  }
);

export const modifyCategory = createAsyncThunk(
  'category/update',
  async ({ categoryId, data }: { categoryId: number; data: UpdateCategoryRequest }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.updateCategory(categoryId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update category');
    }
  }
);

export const removeCategory = createAsyncThunk(
  'category/delete',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await categoryApi.deleteCategory(categoryId);
      if (!response.success) throw new Error(response.message);
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete category');
    }
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  'category/fetchProducts',
  async ({ categoryId, params }: { categoryId: number; params: { page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategoryProducts(categoryId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch category products');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createNewCategory
      .addCase(createNewCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchAllCategories
      .addCase(fetchAllCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchCategoryTree
      .addCase(fetchCategoryTree.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTree = action.payload;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // modifyCategory
      .addCase(modifyCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(modifyCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.categoryId === action.payload.categoryId);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.categoryId === action.payload.categoryId) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(modifyCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // removeCategory
      .addCase(removeCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(c => c.categoryId !== action.payload);
        if (state.currentCategory?.categoryId === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchCategoryProducts
      .addCase(fetchCategoryProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;
