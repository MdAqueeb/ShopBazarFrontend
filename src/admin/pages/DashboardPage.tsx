import { useEffect, useState } from 'react';
import { Users, Store, Package, ShoppingCart, DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlatformAnalytics } from '../../store/slices/adminSlice';
import StatCard from '../components/StatCard';
import Loader from '../../components/common/Loader';

function formatDate(date: Date): string {
  return date.toISOString();
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { analytics, analyticsLoading } = useAppSelector((state) => state.admin);

  const [range] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  });

  useEffect(() => {
    dispatch(fetchPlatformAnalytics(range));
  }, [dispatch, range]);

  if (analyticsLoading) {
    return <Loader fullPage text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${(analytics?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={analytics?.totalOrders ?? 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers ?? 0}
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={analytics?.totalProducts ?? 0}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sellers"
          value={analytics?.totalSellers ?? 0}
          icon={Store}
        />
        <StatCard
          title="Pending Sellers"
          value={analytics?.pendingSellers ?? 0}
          icon={Clock}
        />
        <StatCard
          title="Pending Products"
          value={analytics?.pendingProducts ?? 0}
          icon={AlertTriangle}
        />
        <StatCard
          title="Recent Orders"
          value={analytics?.recentOrders ?? 0}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
