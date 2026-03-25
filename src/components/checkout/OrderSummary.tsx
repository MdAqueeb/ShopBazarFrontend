import { ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  loading: boolean;
}

export default function OrderSummary({ items, loading }: OrderSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Since CartItem only has productId/quantity (no price), we show quantity info.
  // In a real app, you'd join with product data for prices.

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
        <ShoppingBag size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Order Summary
      </h2>

      {/* Item list */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Product #{item.productId}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Items</span>
          <span className="font-medium text-gray-900">{itemCount}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium text-emerald-600">FREE</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 my-4" />

      <p className="text-xs text-gray-400 text-center">
        Final total will be calculated after placing the order
      </p>
    </div>
  );
}
