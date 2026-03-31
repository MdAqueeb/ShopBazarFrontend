/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import AdminGuard from '../components/AdminGuard';
import Loader from '../../components/common/Loader';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UserListPage = lazy(() => import('../pages/users/UserListPage'));
const UserDetailPage = lazy(() => import('../pages/users/UserDetailPage'));
const SellerListPage = lazy(() => import('../pages/sellers/SellerListPage'));
const SellerDetailPage = lazy(() => import('../pages/sellers/SellerDetailPage'));
const ProductListPage = lazy(() => import('../pages/products/ProductListPage'));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const OrderListPage = lazy(() => import('../pages/orders/OrderListPage'));
const OrderDetailPage = lazy(() => import('../pages/orders/OrderDetailPage'));
const CategoryPage = lazy(() => import('../pages/categories/CategoryPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader fullPage text="Loading..." />}>{children}</Suspense>;
}

const adminRoutes: RouteObject = {
  path: 'admin',
  element: <AdminGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <LazyPage><DashboardPage /></LazyPage> },
        { path: 'users', element: <LazyPage><UserListPage /></LazyPage> },
        { path: 'users/:userId', element: <LazyPage><UserDetailPage /></LazyPage> },
        { path: 'sellers', element: <LazyPage><SellerListPage /></LazyPage> },
        { path: 'sellers/:sellerId', element: <LazyPage><SellerDetailPage /></LazyPage> },
        { path: 'products', element: <LazyPage><ProductListPage /></LazyPage> },
        { path: 'products/:productId', element: <LazyPage><ProductDetailPage /></LazyPage> },
        { path: 'orders', element: <LazyPage><OrderListPage /></LazyPage> },
        { path: 'orders/:orderId', element: <LazyPage><OrderDetailPage /></LazyPage> },
        { path: 'categories', element: <LazyPage><CategoryPage /></LazyPage> },
      ],
    },
  ],
};

export default adminRoutes;
