import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSellerOrders } from '../../../store/slices/sellerSlice';
import type { OrderItem } from '../../../types/seller';
import DataTable from '../../../admin/components/DataTable';
import type { ColumnDef } from '../../../admin/components/DataTable';
import useSellerAuth from '../../hooks/useSellerAuth';
import useSellerPagination from '../../hooks/useSellerPagination';

export default function OrderListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellerId } = useSellerAuth();
  const { orders, loading } = useAppSelector((state) => state.seller);
  const { page, params, onPageChange } = useSellerPagination();

  useEffect(() => {
    if (sellerId !== null) {
      dispatch(fetchSellerOrders({ sellerId, params }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sellerId, page]);

  const columns: ColumnDef<OrderItem>[] = [
    {
      key: 'orderItemId',
      header: 'Order Item ID',
      render: (row) => (
        <span className="font-mono text-xs font-medium">#{row.orderItemId}</span>
      ),
    },
    {
      key: 'productId',
      header: 'Product ID',
      render: (row) => (
        <span className="text-sm text-gray-600">#{row.productId}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => (
        <span className="text-sm text-gray-700">{row.quantity}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/seller/orders/${row.orderItemId}`)}
          className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
      </div>

      <DataTable
        columns={columns}
        data={orders?.content ?? []}
        loading={loading}
        currentPage={page}
        totalPages={orders?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No orders found"
        emptyMessage="You have not received any orders yet."
      />
    </div>
  );
}
