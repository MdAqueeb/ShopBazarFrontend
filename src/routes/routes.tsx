import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Auth pages
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Public pages
import CategoryPage from "../pages/CategoryPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProductListPage from "../pages/product/ProductListPage";

// Protected pages
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderDetailPage from "../pages/order/OrderDetailPage";
import OrderListPage from "../pages/order/OrderListPage";
import OrderSuccessPage from "../pages/order/OrderSuccessPage";
import ProfilePage from "../pages/user/ProfilePage";
import WishlistPage from "../pages/WishlistPage";

// Misc
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // ── Auth routes (public, uses AuthLayout) ──────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  // ── App routes (uses AppLayout with Navbar) ────────────────────────────────
  {
    element: <AppLayout />,
    // element: <ProtectedRoute />,
    children: [
      // Public browsing routes
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductListPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
      { path: "/category/:id", element: <CategoryPage /> },

      // Protected routes (require auth)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/wishlist", element: <WishlistPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/order-success", element: <OrderSuccessPage /> },
          { path: "/orders", element: <OrderListPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
        ],
      },
    ],
  },

  // ── Catch-all ──────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
