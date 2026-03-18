import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Auth pages
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// User pages
import ProfilePage from "../pages/user/ProfilePage";

// Product pages
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductListPage from "../pages/product/ProductListPage";

// Cart pages
import CartPage from "../pages/cart/CartPage";

// Order pages
import OrderDetailPage from "../pages/order/OrderDetailPage";
import OrderListPage from "../pages/order/OrderListPage";

// Misc
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // ── Public auth routes ───────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  // ── Protected app routes ─────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Root redirect
          { index: true, element: <Navigate to="/products" replace /> },

          // User
          { path: "/profile", element: <ProfilePage /> },

          // Product
          { path: "/products", element: <ProductListPage /> },
          { path: "/products/:id", element: <ProductDetailPage /> },

          // Cart
          { path: "/cart", element: <CartPage /> },

          // Orders + order items
          { path: "/orders", element: <OrderListPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
        ],
      },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
