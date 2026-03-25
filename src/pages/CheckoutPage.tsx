import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, clearUserCart } from '../store/slices/cartSlice';
import { fetchUserAddresses } from '../store/slices/addressSlice';
import { createNewOrder } from '../store/slices/orderSlice';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { cart, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { addresses, loading: addressLoading } = useAppSelector((state) => state.address);
  const { loading: orderLoading, error: orderError } = useAppSelector((state) => state.order);

  const userId = user?.userId;

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchCart(userId));
    dispatch(fetchUserAddresses(userId));
  }, [dispatch, userId]);

  const cartItems = cart?.items ?? [];

  const handlePlaceOrder = async (addressId: number, paymentMethod: string) => {
    if (!userId) return;
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const result = await dispatch(
      createNewOrder({ userId, addressId, paymentMethod })
    );

    if (createNewOrder.fulfilled.match(result)) {
      dispatch(clearUserCart(userId));
      toast.success('Order placed successfully!');
      navigate('/order-success', {
        state: {
          order: {
            orderId: result.payload.orderId,
            totalAmount: result.payload.totalAmount,
            paymentMethod,
            orderStatus: result.payload.orderStatus,
            itemCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
          },
        },
      });
    } else {
      toast.error(orderError ?? 'Failed to place order');
    }
  };

  // Loading state
  if (cartLoading && !cart) {
    return <Loader fullPage size="lg" text="Loading checkout..." />;
  }

  // Empty cart
  if (cartItems.length === 0 && !cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          title="Your cart is empty"
          message="Add some products to your cart before checking out."
        />
        <div className="text-center mt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft size={14} /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your order
          </p>
        </div>
      </div>

      {/* Error banner */}
      {orderError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {orderError}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Checkout form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <CheckoutForm
              addresses={addresses}
              addressLoading={addressLoading}
              userId={userId ?? 0}
              onPlaceOrder={handlePlaceOrder}
              placingOrder={orderLoading}
            />
          </div>
        </div>

        {/* Right — Order summary */}
        <div>
          <OrderSummary items={cartItems} loading={cartLoading} />
        </div>
      </div>
    </div>
  );
}
