import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductResponse } from '../../types/product';
import type { RootState } from '../store';

interface WishlistState {
  items: ProductResponse[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<ProductResponse>) {
      const exists = state.items.some(
        (item) => item.productId === action.payload.productId
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
  },
});

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;
export const selectIsWishlisted = (productId: number) => (state: RootState) =>
  state.wishlist.items.some((item) => item.productId === productId);

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
