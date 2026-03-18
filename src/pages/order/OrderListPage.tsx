import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
  items: { name: string; icon: string }[];
}

const ORDERS: Order[] = [
  {
    id: 'SB-100423',
    date: '18 Mar 2026',
    status: 'Shipped',
    itemCount: 2,
    total: 174.98,
    items: [{ name: 'Wireless Headphones', icon: '🎧' }, { name: 'Running Shoes Pro', icon: '👟' }],
  },
  {
    id: 'SB-100389',
    date: '10 Mar 2026',
    status: 'Delivered',
    itemCount: 3,
    total: 113.97,
    items: [{ name: 'Leather Wallet', icon: '👛' }, { name: 'Face Serum', icon: '✨' }, { name: 'Water Bottle', icon: '🧴' }],
  },
  {
    id: 'SB-100301',
    date: '28 Feb 2026',
    status: 'Delivered',
    itemCount: 1,
    total: 44.99,
    items: [{ name: 'Desk Lamp', icon: '💡' }],
  },
  {
    id: 'SB-100275',
    date: '15 Feb 2026',
    status: 'Processing',
    itemCount: 2,
    total: 84.98,
    items: [{ name: 'Candle Set', icon: '🕯️' }, { name: 'Fitness Tracker', icon: '⌚' }],
  },
  {
    id: 'SB-100220',
    date: '02 Feb 2026',
    status: 'Cancelled',
    itemCount: 1,
    total: 94.99,
    items: [{ name: 'Running Shoes Pro', icon: '👟' }],
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Processing: { label: 'Processing', color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  icon: <Clock      size={13} /> },
  Shipped:    { label: 'Shipped',    color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200',   icon: <Truck      size={13} /> },
  Delivered:  { label: 'Delivered',  color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200',icon: <CheckCircle size={13} /> },
  Cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    icon: <XCircle    size={13} /> },
};

const TABS: Array<OrderStatus | 'All'> = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderListPage() {
  const [activeTab, setActiveTab]   = useState<OrderStatus | 'All'>('All');
  const [search, setSearch]         = useState('');
  const navigate = useNavigate();

  const filtered = ORDERS.filter((o) => {
    const matchTab = activeTab === 'All' || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="animate-fade-in mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Track and manage all your orders in one place.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-slide-down">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or product name…"
          className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 shadow-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-6 animate-slide-up">
        {TABS.map((tab) => {
          const count = tab === 'All' ? ORDERS.length : ORDERS.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${
                activeTab === tab
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700'
              }`}
            >
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="inline-flex w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 70}ms` }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    {/* Icon cluster */}
                    <div className="relative flex shrink-0">
                      {order.items.slice(0, 2).map((item, j) => (
                        <div
                          key={item.name}
                          className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl shadow-sm border-2 border-white"
                          style={{ marginLeft: j > 0 ? '-12px' : '0', zIndex: j }}
                        >
                          {item.icon}
                        </div>
                      ))}
                      {order.itemCount > 2 && (
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white -ml-3">
                          +{order.itemCount - 2}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{order.date}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-lg font-extrabold text-gray-900">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</p>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>

                {/* Progress bar for non-cancelled orders */}
                {order.status !== 'Cancelled' && (
                  <div className="mt-4 flex items-center gap-2">
                    {(['Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map((step, idx) => {
                      const steps: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];
                      const currentIdx = steps.indexOf(order.status);
                      const done = idx <= currentIdx;
                      return (
                        <div key={step} className="flex items-center flex-1 gap-2">
                          <div className={`h-1.5 flex-1 rounded-full transition-all ${done ? 'bg-violet-500' : 'bg-gray-100'}`} />
                          {idx === 2 && (
                            <div className={`w-2 h-2 rounded-full ${done ? 'bg-violet-500' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 animate-slide-up delay-300">
        {[
          { label: 'Total Orders',     value: ORDERS.length,                                 icon: <Package size={18} />,      color: 'bg-violet-50 text-violet-600' },
          { label: 'Delivered',        value: ORDERS.filter(o => o.status === 'Delivered').length,  icon: <CheckCircle size={18} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'In Transit',       value: ORDERS.filter(o => o.status === 'Shipped').length,    icon: <Truck size={18} />,       color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Spent',      value: `$${ORDERS.filter(o => o.status !== 'Cancelled').reduce((s,o) => s+o.total, 0).toFixed(0)}`, icon: <ShoppingBag size={18} />, color: 'bg-amber-50 text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
