import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Calendar } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import StatusBadge from '../../components/StatusBadge';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { orders } = useAppSelector((state) => state.admin);

  const order = orders?.content.find((o) => o.orderId === Number(orderId));

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Order not found. Go back to the</p>
        <Link to="/admin/orders" className="text-violet-600 hover:underline">order list</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.orderId}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">User</p>
              <p className="font-medium text-gray-900">User #{order.userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <DollarSign size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {order.orderItems && order.orderItems.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Order Items</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems.map((item) => (
                    <tr key={item.orderItemId}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
