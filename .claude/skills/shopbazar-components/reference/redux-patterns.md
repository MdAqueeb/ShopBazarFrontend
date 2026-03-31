# Redux Patterns for E-Commerce

Scalable, type-safe Redux architecture for ShopBazar.

## Normalized State Design

Keep state normalized: store entities by ID, maintain separate indices for relationships.

```tsx
// store/productSlice.ts
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  // ...
}

interface ProductsState {
  // Normalized data
  byId: Record<string, Product>;
  allIds: string[];

  // Filtering & pagination
  filters: {
    category?: string;
    priceRange?: [number, number];
    search?: string;
  };
  sort: "newest" | "price-low" | "price-high" | "rating";
  currentPage: number;
  pageSize: number;

  // Loading state
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  byId: {},
  allIds: [],
  filters: {},
  sort: "newest",
  currentPage: 1,
  pageSize: 20,
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (
    {
      page = 1,
      filters = {},
      sort = "newest",
    }: {
      page?: number;
      filters?: Record<string, any>;
      sort?: string;
    } = {}
  ) => {
    const res = await api.get("/products", {
      params: { page, ...filters, sort },
    });
    return res.data; // { products: [...], total: number }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to page 1 when filtering
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Normalize products
        const productMap = action.payload.products.reduce(
          (acc: Record<string, Product>, product: Product) => {
            acc[product.id] = product;
            return acc;
          },
          {}
        );
        state.byId = productMap;
        state.allIds = Object.keys(productMap);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});
```

## Selectors (Memoized)

```tsx
// store/productSlice.ts (continued)
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Base selectors
const selectProductsState = (state: RootState) => state.products;
const selectByIdMap = (state: RootState) => state.products.byId;
const selectAllIds = (state: RootState) => state.products.allIds;
const selectFilters = (state: RootState) => state.products.filters;
const selectSort = (state: RootState) => state.products.sort;

// Derived selectors (memoized, only recompute if dependencies change)
export const selectAllProducts = createSelector([selectByIdMap, selectAllIds], (byId, allIds) =>
  allIds.map((id) => byId[id])
);

export const selectProductById = (id: string) =>
  createSelector([selectByIdMap], (byId) => byId[id]);

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters, selectSort],
  (products, filters, sort) => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
      );
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return 0;
      }
    });

    return sorted;
  }
);

export const selectProductCount = createSelector([selectAllProducts], (products) => products.length);
```

## Cart Slice Pattern

```tsx
// store/cartSlice.ts
interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string; // For size/color selection
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  lastUpdated: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  lastUpdated: 0,
  isLoading: false,
};

// Async thunks
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity, variantId }: { productId: string; quantity: number; variantId?: string }) => {
    // Optimistic UI update happens immediately
    // API call validates server-side
    const res = await api.post("/cart/items", { productId, quantity, variantId });
    return res.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, variantId }: { productId: string; variantId?: string }) => {
    await api.delete("/cart/items", { data: { productId, variantId } });
    return { productId, variantId };
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity, variantId }: { productId: string; quantity: number; variantId?: string }) => {
    const res = await api.patch("/cart/items", {
      productId,
      quantity,
      variantId,
    });
    return res.data;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optimistic updates (happen before async thunk resolves)
    addToCartOptimistic: (state, action) => {
      const { productId, quantity, variantId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId,
          quantity,
          variantId,
          addedAt: Date.now(),
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        // Rollback optimistic update if needed
        console.error("Add to cart failed:", action.error);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.variantId === action.payload.variantId
            )
        );
        state.lastUpdated = Date.now();
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const item = state.items.find(
          (i) =>
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId
        );
        if (item) {
          item.quantity = action.payload.quantity;
        }
        state.lastUpdated = Date.now();
      });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartItemsWithProducts = createSelector(
  [selectCartItems, (state) => state.products.byId],
  (items, productsById) =>
    items.map((item) => ({
      ...item,
      product: productsById[item.productId],
    }))
);

export const selectCartSubtotal = createSelector(
  [selectCartItemsWithProducts],
  (items) =>
    items.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0)
);
```

## Async Thunk Error Handling

```tsx
// Example: Proper error handling in async thunk
export const submitOrder = createAsyncThunk(
  "checkout/submit",
  async (data: CheckoutData, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders", data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // API error (4xx, 5xx)
        return rejectWithValue({
          message: error.response?.data?.message || "Order failed",
          code: error.response?.status,
        });
      }
      // Network or other error
      return rejectWithValue({
        message: "Network error. Please try again.",
        code: null,
      });
    }
  }
);

export const checkoutSlice = createSlice({
  // ...
  extraReducers: (builder) => {
    builder.addCase(submitOrder.rejected, (state, action) => {
      state.error = (action.payload as any)?.message || "Order failed";
      // Show error toast with message
    });
  },
});
```

## Hooks

```tsx
// hooks/redux.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage
function MyComponent() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const isLoading = useAppSelector((state) => state.products.isLoading);
}
```

## Store Configuration

```tsx
// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import authSlice from "./authSlice";
import checkoutSlice from "./checkoutSlice";
import wishlistSlice from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    auth: authSlice,
    checkout: checkoutSlice,
    wishlist: wishlistSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["cart/addToCart/fulfilled"], // Ignore if returning non-serializable data
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Performance Optimization Tips

1. **Selectors prevent unnecessary renders**
   ```tsx
   // ❌ Bad: Creates new array on every render
   const items = useAppSelector((state) => state.cart.items.filter(i => i.quantity > 0));

   // ✅ Good: Memoized, only recomputes if items change
   export const selectActiveCartItems = createSelector(
     [selectCartItems],
     (items) => items.filter(i => i.quantity > 0)
   );
   ```

2. **Async thunks with abort handling**
   ```tsx
   export const fetchProducts = createAsyncThunk(
     "products/fetch",
     async (params, { signal }) => {
       // signal automatically aborts when component unmounts
       const res = await api.get("/products", { signal });
       return res.data;
     }
   );
   ```

3. **Entity adapters** (for large lists)
   ```tsx
   import { createEntityAdapter } from "@reduxjs/toolkit";

   const productsAdapter = createEntityAdapter<Product>({
     selectId: (product) => product.id,
   });

   export const {
     selectById,
     selectAll,
     selectIds,
   } = productsAdapter.getSelectors((state) => state.products);
   ```
