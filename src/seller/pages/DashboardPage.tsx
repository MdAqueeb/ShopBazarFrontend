import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Warehouse, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSellerDashboard } from '../../store/slices/sellerSlice';
import StatCard from '../../admin/components/StatCard';
import StatusBadge from '../../admin/components/StatusBadge';
import Loader from '../../components/common/Loader';
import useSellerAuth from '../hooks/useSellerAuth';

const quickLinks = [
  { to: '/seller/products', icon: Package, label: 'Products', description: 'Manage your listings' },
  { to: '/seller/orders', icon: ShoppingCart, label: 'Orders', description: 'View customer orders' },
  { to: '/seller/inventory', icon: Warehouse, label: 'Inventory', description: 'Track stock levels' },
  { to: '/seller/settings', icon: Settings, label: 'Settings', description: 'Store profile & config' },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { sellerId, seller } = useSellerAuth();
  const { dashboard, loading } = useAppSelector((state) => state.seller);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerDashboard(sellerId));
    }
  }, [dispatch, sellerId]);

  if (loading && !dashboard) {
    return <Loader fullPage text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {seller?.storeName ?? 'Your Store'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Here's how your store is performing</p>
        </div>
        {seller?.status && <StatusBadge status={seller.status} />}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={dashboard?.totalProducts ?? 0}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={dashboard?.totalOrders ?? 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(dashboard?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Store Status"
          value={dashboard?.status ?? seller?.status ?? '—'}
          icon={Warehouse}
        />
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, description }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                <Icon size={20} className="text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
