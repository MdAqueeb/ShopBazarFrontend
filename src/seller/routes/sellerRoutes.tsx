/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import SellerLayout from '../layout/SellerLayout';
import SellerGuard from '../components/SellerGuard';
import Loader from '../../components/common/Loader';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductListPage = lazy(() => import('../pages/products/ProductListPage'));
const ProductCreatePage = lazy(() => import('../pages/products/ProductCreatePage'));
const ProductEditPage = lazy(() => import('../pages/products/ProductEditPage'));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const OrderListPage = lazy(() => import('../pages/orders/OrderListPage'));
const OrderDetailPage = lazy(() => import('../pages/orders/OrderDetailPage'));
const InventoryPage = lazy(() => import('../pages/inventory/InventoryPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader fullPage text="Loading..." />}>{children}</Suspense>;
}

const sellerRoutes: RouteObject = {
  path: 'seller',
  element: <SellerGuard />,
  children: [
    {
      element: <SellerLayout />,
      children: [
        { index: true, element: <LazyPage><DashboardPage /></LazyPage> },
        { path: 'products', element: <LazyPage><ProductListPage /></LazyPage> },
        { path: 'products/new', element: <LazyPage><ProductCreatePage /></LazyPage> },
        { path: 'products/:productId', element: <LazyPage><ProductDetailPage /></LazyPage> },
        { path: 'products/:productId/edit', element: <LazyPage><ProductEditPage /></LazyPage> },
        { path: 'orders', element: <LazyPage><OrderListPage /></LazyPage> },
        { path: 'orders/:orderItemId', element: <LazyPage><OrderDetailPage /></LazyPage> },
        { path: 'inventory', element: <LazyPage><InventoryPage /></LazyPage> },
        { path: 'settings', element: <LazyPage><SettingsPage /></LazyPage> },
      ],
    },
  ],
};

export default sellerRoutes;
