import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  ChevronRight,
  Download,
  RotateCcw,
} from 'lucide-react';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem {
  id: number;
  name: string;
  category: string;
  icon: string;
  gradient: string;
  qty: number;
  unitPrice: number;
}

interface OrderData {
  id: string;
  date: string;
  status: OrderStatus;
  trackingNo?: string;
  estimatedDelivery?: string;
  address: string;
  items: OrderItem[];
}

const ORDERS: Record<string, OrderData> = {
  'SB-100423': {
    id: 'SB-100423',
    date: '18 Mar 2026',
    status: 'Shipped',
    trackingNo: 'SB-TRK-88234',
    estimatedDelivery: '21 Mar 2026',
    address: '42 Market Street, London, EC2A 4NE, UK',
    items: [
      { id: 1, name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', icon: '🎧', gradient: 'from-blue-400 to-indigo-600',   qty: 1, unitPrice: 79.99 },
      { id: 5, name: 'Running Shoes Pro',                    category: 'Sports',      icon: '👟', gradient: 'from-violet-400 to-purple-600', qty: 2, unitPrice: 94.99 },
    ],
  },
  'SB-100389': {
    id: 'SB-100389',
    date: '10 Mar 2026',
    status: 'Delivered',
    trackingNo: 'SB-TRK-72891',
    estimatedDelivery: '13 Mar 2026',
    address: '42 Market Street, London, EC2A 4NE, UK',
    items: [
      { id: 2, name: 'Premium Leather Wallet',  category: 'Fashion', icon: '👛', gradient: 'from-amber-400 to-orange-500',  qty: 1, unitPrice: 34.99 },
      { id: 8, name: 'Organic Face Serum',       category: 'Beauty',  icon: '✨', gradient: 'from-fuchsia-400 to-pink-600', qty: 1, unitPrice: 38.99 },
      { id: 6, name: 'Stainless Steel Water Bottle', category: 'Sports', icon: '🧴', gradient: 'from-cyan-400 to-sky-600', qty: 2, unitPrice: 19.99 },
    ],
  },
};

const FALLBACK_ORDER: OrderData = {
  id: 'N/A', date: '—', status: 'Processing', address: '—',
  items: [{ id: 0, name: 'Unknown product', category: '—', icon: '📦', gradient: 'from-gray-300 to-gray-500', qty: 1, unitPrice: 0 }],
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Processing: { label: 'Processing', color: 'text-amber-700',   bg: 'bg-amber-50  border-amber-200',   icon: <Clock       size={14} /> },
  Shipped:    { label: 'Shipped',    color: 'text-blue-700',    bg: 'bg-blue-50   border-blue-200',    icon: <Truck       size={14} /> },
  Delivered:  { label: 'Delivered',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle size={14} /> },
  Cancelled:  { label: 'Cancelled',  color: 'text-red-700',     bg: 'bg-red-50    border-red-200',     icon: <XCircle     size={14} /> },
};

const STEPS: Array<{ key: OrderStatus; label: string; icon: React.ReactNode }> = [
  { key: 'Processing', label: 'Order Placed',  icon: <Package   size={16} /> },
  { key: 'Shipped',    label: 'Shipped',       icon: <Truck     size={16} /> },
  { key: 'Delivered',  label: 'Delivered',     icon: <CheckCircle size={16} /> },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = (id && ORDERS[id]) ? ORDERS[id] : { ...FALLBACK_ORDER, id: id ?? 'N/A' };

  const cfg         = STATUS_CONFIG[order.status];
  const stepIndex   = STEPS.findIndex((s) => s.key === order.status);
  const subtotal    = order.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const shipping    = subtotal > 50 ? 0 : 4.99;
  const tax         = subtotal * 0.08;
  const total       = subtotal + shipping + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 mb-6 transition-colors animate-fade-in"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Order header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-gray-900">Order {order.id}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color} ${cfg.bg}`}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Placed on {order.date}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors">
              <Download size={14} /> Invoice
            </button>
            {order.status === 'Delivered' && (
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-rose-400 hover:text-rose-600 transition-colors">
                <RotateCcw size={14} /> Return
              </button>
            )}
          </div>
        </div>

        {/* Tracking number */}
        {order.trackingNo && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Package size={14} className="text-violet-500" />
            <span className="text-gray-500">Tracking:</span>
            <span className="font-semibold text-violet-600">{order.trackingNo}</span>
            {order.estimatedDelivery && (
              <span className="text-gray-400 ml-2">· Est. delivery {order.estimatedDelivery}</span>
            )}
          </div>
        )}
      </div>

      {/* Progress tracker */}
      {order.status !== 'Cancelled' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5 animate-slide-up delay-100">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Order Progress</h2>
          <div className="relative flex items-start justify-between">
            {/* Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 mx-16" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-violet-500 mx-16 transition-all duration-700"
              style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step, i) => {
              const done    = i <= stepIndex;
              const current = i === stepIndex;
              return (
                <div key={step.key} className="relative flex flex-col items-center gap-2 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                    done
                      ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200'
                      : 'bg-white border-gray-200 text-gray-400'
                  } ${current ? 'scale-110' : ''}`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs font-semibold text-center ${done ? 'text-violet-700' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* ── Order items ────────────────────────────────────────────────────── */}
        <div className="sm:col-span-2 animate-slide-up delay-200">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Order Items ({order.items.length})</h2>
            </div>

            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">{item.category}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-gray-900">${(item.unitPrice * item.qty).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-violet-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">Delivery Address</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Summary ────────────────────────────────────────────────────────── */}
        <div className="animate-slide-up delay-300">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-gray-900'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-1" />

              <div className="flex justify-between font-extrabold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {order.status === 'Shipped' && (
              <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-violet-200">
                Track Shipment <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
