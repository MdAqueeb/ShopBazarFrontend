import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';
import type { Cart, AddItemToCartRequest, UpdateCartItemQuantityRequest } from '../../types/cart';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart(userId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ userId, data }: { userId: number; data: AddItemToCartRequest }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addItemToCart(userId, data);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ userId, cartItemId, data }: { userId: number; cartItemId: number; data: UpdateCartItemQuantityRequest }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItemQuantity(userId, cartItemId, data);
      if (!response.success) throw new Error(response.message);
      return { cartItemId, quantity: data.quantity };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update item quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, cartItemId }: { userId: number; cartItemId: number }, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeCartItem(userId, cartItemId);
      if (!response.success) throw new Error(response.message);
      return cartItemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clear',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart(userId);
      if (!response.success) throw new Error(response.message);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          const existingItem = state.cart.items.find(i => i.productId === action.payload.productId);
          if (existingItem) {
            existingItem.quantity += action.payload.quantity;
          } else {
            state.cart.items.push(action.payload);
          }
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          const existingItem = state.cart.items.find(i => i.cartItemId === action.payload.cartItemId);
          if (existingItem) {
            existingItem.quantity = action.payload.quantity;
          }
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          state.cart.items = state.cart.items.filter(i => i.cartItemId !== action.payload);
        }
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.loading = false;
        if (state.cart) {
          state.cart.items = [];
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
