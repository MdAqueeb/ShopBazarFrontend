import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllAdminSellers, approveAdminSeller, rejectAdminSeller } from '../../../store/slices/adminSlice';
import type { AdminSeller } from '../../../types/admin';
import DataTable from '../../components/DataTable';
import type { ColumnDef } from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import FilterBar from '../../components/FilterBar';
import ActionModal from '../../components/ActionModal';
import useAdminPagination from '../../hooks/useAdminPagination';
import useActionModal from '../../hooks/useActionModal';

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function SellerListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellers, sellersLoading, actionLoading } = useAppSelector((state) => state.admin);
  const { page, filter, params, onPageChange, onFilterChange } = useAdminPagination();
  const { modal, openModal, closeModal } = useActionModal<AdminSeller>();

  useEffect(() => {
    dispatch(fetchAllAdminSellers(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, filter]);

  const handleAction = async (reason?: string) => {
    if (!modal.item) return;
    try {
      if (modal.action === 'approve') {
        await dispatch(approveAdminSeller(modal.item.sellerId)).unwrap();
        toast.success('Seller approved');
      } else {
        await dispatch(rejectAdminSeller({ sellerId: modal.item.sellerId, reason: reason ?? '' })).unwrap();
        toast.success('Seller rejected');
      }
      dispatch(fetchAllAdminSellers(params));
    } catch {
      toast.error('Action failed');
    }
    closeModal();
  };

  const columns: ColumnDef<AdminSeller>[] = [
    { key: 'sellerId', header: 'ID', render: (row) => <span className="font-mono text-xs">#{row.sellerId}</span> },
    {
      key: 'storeName',
      header: 'Store',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.storeName}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'gstNumber', header: 'GST', render: (row) => <span className="text-xs text-gray-600 font-mono">{row.gstNumber ?? 'N/A'}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/sellers/${row.sellerId}`)}
            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-md hover:bg-violet-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => openModal(row, 'approve')}
                className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => openModal(row, 'reject')}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
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
        data={sellers?.content ?? []}
        loading={sellersLoading}
        currentPage={page}
        totalPages={sellers?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No sellers found"
        emptyMessage="Try adjusting your filters."
      />

      <ActionModal
        open={modal.open}
        title={modal.action === 'approve' ? 'Approve Seller' : 'Reject Seller'}
        description={
          modal.action === 'approve'
            ? `Approve ${modal.item?.storeName} as a seller?`
            : `Reject ${modal.item?.storeName}'s application?`
        }
        requireReason={modal.action === 'reject'}
        reasonLabel="Rejection Reason"
        confirmLabel={modal.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={modal.action === 'reject' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAction}
        onClose={closeModal}
      />
    </div>
  );
}
