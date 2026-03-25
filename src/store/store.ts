import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import productReducer from "./slices/productSlice";
import searchReducer from './slices/searchSlice';
import categoryReducer from './slices/categorySlice';
import addressReducer from './slices/addressSlice';
import inventoryReducer from './slices/inventorySlice';
import sellerReducer from './slices/sellerSlice';
import adminReducer from './slices/adminSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import shipmentReducer from './slices/shipmentSlice';
import transactionReducer from './slices/transactionSlice';
import paymentReducer from './slices/paymentSlice';
import notificationReducer from './slices/notificationSlice';
import reviewReducer from './slices/reviewSlice';
import homeReducer from './slices/homeSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productReducer,
    home: homeReducer,
    search: searchReducer,
    category: categoryReducer,
    address: addressReducer,
    inventory: inventoryReducer,
    seller: sellerReducer,
    admin: adminReducer,
    cart: cartReducer,
    order: orderReducer,
    shipment: shipmentReducer,
    transaction: transactionReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
