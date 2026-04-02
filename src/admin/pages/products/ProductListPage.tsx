import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, CheckCircle, Ban } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllAdminProducts, approveAdminProduct, blockAdminProduct } from '../../../store/slices/adminSlice';
import type { AdminProduct } from '../../../types/admin';
import DataTable from '../../components/DataTable';
import type { ColumnDef } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import FilterBar from '../../components/FilterBar';
import ActionModal from '../../components/ActionModal';
import useAdminPagination from '../../hooks/useAdminPagination';
import useActionModal from '../../hooks/useActionModal';

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
];

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, productsLoading, actionLoading } = useAppSelector((state) => state.admin);
  const { page, filter, params, onPageChange, onFilterChange } = useAdminPagination();
  const { modal, openModal, closeModal } = useActionModal<AdminProduct>();

  useEffect(() => {
    dispatch(fetchAllAdminProducts(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, filter]);

  const handleAction = async (reason?: string) => {
    if (!modal.item) return;
    try {
      if (modal.action === 'approve') {
        await dispatch(approveAdminProduct(modal.item.productId)).unwrap();
        toast.success('Product approved');
      } else {
        await dispatch(blockAdminProduct({ productId: modal.item.productId, reason: reason ?? '' })).unwrap();
        toast.success('Product blocked');
      }
      dispatch(fetchAllAdminProducts(params));
    } catch {
      toast.error('Action failed');
    }
    closeModal();
  };

  const columns: ColumnDef<AdminProduct>[] = [
    { key: 'productId', header: 'ID', render: (row) => <span className="font-mono text-xs">#{row.productId}</span> },
    {
      key: 'name',
      header: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.categoryName ?? 'Uncategorized'}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-medium">${row.price.toFixed(2)}</span>,
    },
    {
      key: 'seller',
      header: 'Seller',
      render: (row) => <span className="text-sm text-gray-600">{row.sellerName ?? 'N/A'}</span>,
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/products/${row.productId}`)}
            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-md hover:bg-violet-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {(row.status === 'INACTIVE' || row.status === 'BLOCKED') && (
            <button
              onClick={() => openModal(row, 'approve')}
              className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
              title="Approve"
            >
              <CheckCircle size={16} />
            </button>
          )}
          {row.status === 'ACTIVE' && (
            <button
              onClick={() => openModal(row, 'block')}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Block"
            >
              <Ban size={16} />
            </button>
          )}
        </div>
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
        data={products?.content ?? []}
        loading={productsLoading}
        currentPage={page}
        totalPages={products?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No products found"
        emptyMessage="Try adjusting your filters."
      />

      <ActionModal
        open={modal.open}
        title={modal.action === 'approve' ? 'Approve Product' : 'Block Product'}
        description={
          modal.action === 'approve'
            ? `Approve "${modal.item?.name}" for public display?`
            : `Block "${modal.item?.name}" from the platform?`
        }
        requireReason={modal.action === 'block'}
        reasonLabel="Block Reason"
        confirmLabel={modal.action === 'approve' ? 'Approve' : 'Block'}
        confirmVariant={modal.action === 'block' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAction}
        onClose={closeModal}
      />
    </div>
  );
}
