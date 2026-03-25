import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowLeft,
  ChevronRight,
  Shield,
  Truck,
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  qty: number;
  gradient: string;
  icon: string;
}

const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 79.99, qty: 1, gradient: 'from-blue-400 to-indigo-600',   icon: '🎧' },
  { id: 5, name: 'Running Shoes Pro',                    category: 'Sports',      price: 94.99, qty: 2, gradient: 'from-violet-400 to-purple-600', icon: '👟' },
  { id: 8, name: 'Organic Face Serum',                   category: 'Beauty',      price: 38.99, qty: 1, gradient: 'from-fuchsia-400 to-pink-600',  icon: '✨' },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const updateQty = (id: number, delta: number) =>
    setItems((prev) => prev
      .map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    );

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal   = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount   = couponApplied ? subtotal * 0.1 : 0;
  const shipping   = subtotal > 50 ? 0 : 4.99;
  const tax        = (subtotal - discount) * 0.08;
  const total      = subtotal - discount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-scale-in">
        <div className="inline-flex w-24 h-24 bg-violet-100 rounded-full items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-violet-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Browse our products and add items you love.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <button onClick={() => navigate('/products')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Items list ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Product image */}
              <div className={`shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-inner`}>
                <span className="text-3xl">{item.icon}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">{item.category}</p>
                <h3 className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-2">{item.name}</h3>
                <p className="mt-2 text-base font-extrabold text-gray-900">${item.price.toFixed(2)}</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>

                <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden mt-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-900">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, +1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <p className="text-sm font-bold text-violet-700 mt-1">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium mt-2 transition-colors"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* ── Order summary ──────────────────────────────────────────────────── */}
        <div className="animate-slide-up delay-200">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <button
                onClick={() => { if (coupon.trim()) setCouponApplied(true); }}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-xs text-emerald-600 font-medium mb-4 flex items-center gap-1">
                ✓ Coupon applied — 10% off
              </p>
            )}

            {/* Line items */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-gray-900'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 my-4" />

            <div className="flex justify-between text-base font-extrabold text-gray-900 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-200"
            >
              Proceed to Checkout
              <ChevronRight size={16} />
            </button>

            {/* Trust */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield size={13} /> Secure checkout
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Truck size={13} /> Fast delivery
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-center text-gray-400 mt-3">
                Add <span className="font-semibold text-violet-600">${(50 - subtotal).toFixed(2)}</span> more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
