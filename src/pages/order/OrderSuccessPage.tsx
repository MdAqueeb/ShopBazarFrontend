import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Home,
} from 'lucide-react';

interface OrderSuccessState {
  order: {
    orderId: number;
    totalAmount: number;
    paymentMethod: string;
    orderStatus: string;
    itemCount: number;
  };
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as OrderSuccessState | null;
  const order = state?.order;

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const paymentLabel =
    order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Success banner */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-10 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
            <CheckCircle size={44} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order details card */}
        <div className="p-6 sm:p-8">
          {/* Order ID highlight */}
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Order ID
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              #{order.orderId}
            </p>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Total amount */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                <Package size={20} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-sm font-bold text-gray-900">
                  {order.totalAmount != null
                    ? `$${order.totalAmount.toFixed(2)}`
                    : 'Calculating...'}
                </p>
              </div>
            </div>

            {/* Payment method */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <CreditCard size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment</p>
                <p className="text-sm font-bold text-gray-900">
                  {paymentLabel}
                </p>
              </div>
            </div>

            {/* Items count */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Items</p>
                <p className="text-sm font-bold text-gray-900">
                  {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {order.orderStatus ?? 'Processing'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={`/orders/${order.orderId}`}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-200"
            >
              Go to Orders
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
            >
              <Home size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle footer note */}
      <p className="text-center text-xs text-gray-400 mt-6">
        A confirmation email will be sent to your registered email address.
      </p>
    </div>
  );
}
