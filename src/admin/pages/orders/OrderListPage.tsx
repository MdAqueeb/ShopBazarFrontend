import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllAdminOrders } from '../../../store/slices/adminSlice';
import type { AdminOrder } from '../../../types/admin';
import DataTable from '../../components/DataTable';
import type { ColumnDef } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import FilterBar from '../../components/FilterBar';
import useAdminPagination from '../../hooks/useAdminPagination';

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function OrderListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, ordersLoading } = useAppSelector((state) => state.admin);
  const { page, filter, params, onPageChange, onFilterChange } = useAdminPagination();

  useEffect(() => {
    dispatch(fetchAllAdminOrders(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, filter]);

  const columns: ColumnDef<AdminOrder>[] = [
    { key: 'orderId', header: 'Order ID', render: (row) => <span className="font-mono text-xs font-medium">#{row.orderId}</span> },
    {
      key: 'userId',
      header: 'User',
      render: (row) => <span className="text-sm text-gray-600">User #{row.userId}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (row) => <span className="font-medium">${row.totalAmount.toFixed(2)}</span>,
    },
    { key: 'orderStatus', header: 'Order Status', render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: 'paymentStatus', header: 'Payment', render: (row) => <StatusBadge status={row.paymentStatus} /> },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/orders/${row.orderId}`)}
          className="p-1.5 text-gray-400 hover:text-violet-600 rounded-md hover:bg-violet-50 transition-colors"
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
        <FilterBar options={filterOptions} activeFilter={filter} onFilterChange={onFilterChange} />
      </div>

      <DataTable
        columns={columns}
        data={orders?.content ?? []}
        loading={ordersLoading}
        currentPage={page}
        totalPages={orders?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No orders found"
        emptyMessage="Try adjusting your filters."
      />
    </div>
  );
}
