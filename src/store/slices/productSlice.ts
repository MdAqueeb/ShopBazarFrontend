import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api/productApi';
import type {
  ProductResponse,
  PageResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductImageResponse
} from '../../types/product';

interface ProductState {
  products: PageResponse<ProductResponse> | null;
  currentProduct: ProductResponse | null;
  productImages: ProductImageResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  currentProduct: null,
  productImages: [],
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAll',
  async (params: { categoryId?: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllProducts(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(productId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product');
    }
  }
);

export const createNewProduct = createAsyncThunk(
  'product/create',
  async (data: CreateProductRequest, { rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create product');
    }
  }
);

export const updateExistingProduct = createAsyncThunk(
  'product/update',
  async ({ productId, data }: { productId: number; data: UpdateProductRequest }, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(productId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update product');
    }
  }
);

export const removeProduct = createAsyncThunk(
  'product/delete',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productApi.deleteProduct(productId);
      if (!response.success) throw new Error(response.message);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/search',
  async (params: { keyword?: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchByCategory',
  async ({ categoryId, params }: { categoryId: number; params: { page?: number; size?: number } }, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductsByCategory(categoryId, params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products by category');
    }
  }
);

export const uploadProductImages = createAsyncThunk(
  'product/uploadImage',
  async ({ productId, file }: { productId: number; file: File }, { rejectWithValue }) => {
    try {
      const response = await productApi.uploadProductImage(productId, file);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to upload image');
    }
  }
);

export const fetchProductImages = createAsyncThunk(
  'product/fetchImages',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductImages(productId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch images');
    }
  }
);

export const removeProductImage = createAsyncThunk(
  'product/deleteImage',
  async ({ productId, imageId }: { productId: number; imageId: number }, { rejectWithValue }) => {
    try {
      const response = await productApi.deleteProductImage(productId, imageId);
      if (!response.success) throw new Error(response.message);
      return imageId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete image');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
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

      // fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createNewProduct
      .addCase(createNewProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateExistingProduct
      .addCase(updateExistingProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // removeProduct
      .addCase(removeProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct?.productId === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchProductImages
      .addCase(fetchProductImages.pending, (state) => { state.error = null; })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        state.productImages = action.payload;
      })
      .addCase(fetchProductImages.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // uploadProductImages
      .addCase(uploadProductImages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false;
        state.productImages.push(action.payload);
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // removeProductImage
      .addCase(removeProductImage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.productImages = state.productImages.filter(img => img.imageId !== action.payload);
      })
      .addCase(removeProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
