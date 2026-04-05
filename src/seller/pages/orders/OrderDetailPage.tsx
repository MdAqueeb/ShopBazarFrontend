import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Hash } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSellerOrders } from '../../../store/slices/sellerSlice';
import useSellerAuth from '../../hooks/useSellerAuth';
import Loader from '../../../components/common/Loader';

export default function OrderDetailPage() {
  const { orderItemId } = useParams<{ orderItemId: string }>();
  const dispatch = useAppDispatch();
  const { sellerId } = useSellerAuth();
  const { orders, loading } = useAppSelector((state) => state.seller);

  const parsedId = orderItemId !== undefined ? Number(orderItemId) : NaN;

  const orderItem = orders?.content.find((item) => item.orderItemId === parsedId);

  useEffect(() => {
    if (!orderItem && sellerId !== null) {
      dispatch(fetchSellerOrders({ sellerId, params: { page: 0, size: 100 } }));
    }
  }, [dispatch, sellerId, orderItem]);

  if (loading) {
    return <Loader fullPage text="Loading order..." />;
  }

  if (!orderItem) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-2">Order item not found. Go back to the</p>
        <Link to="/seller/orders" className="text-emerald-600 hover:underline">
          order list
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/seller/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Order Item #{orderItem.orderItemId}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Hash size={16} />
            </div>
            <div>
              <p className="text-gray-500">Order Item ID</p>
              <p className="font-medium text-gray-900">#{orderItem.orderItemId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Tag size={16} />
            </div>
            <div>
              <p className="text-gray-500">Product ID</p>
              <p className="font-medium text-gray-900">#{orderItem.productId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Package size={16} />
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">{orderItem.quantity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
