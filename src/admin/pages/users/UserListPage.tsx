import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Ban, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllAdminUsers, blockAdminUser, unblockAdminUser } from '../../../store/slices/adminSlice';
import type { AdminUser } from '../../../types/admin';
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
  { label: 'Blocked', value: 'BLOCKED' },
  { label: 'Deleted', value: 'DELETED' },
];

export default function UserListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users, usersLoading, actionLoading } = useAppSelector((state) => state.admin);
  const { page, filter, params, onPageChange, onFilterChange } = useAdminPagination();
  const { modal, openModal, closeModal } = useActionModal<AdminUser>();

  useEffect(() => {
    dispatch(fetchAllAdminUsers(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, filter]);

  const handleAction = async (reason?: string) => {
    if (!modal.item) return;
    try {
      if (modal.action === 'block') {
        await dispatch(blockAdminUser({ userId: modal.item.userId, reason: reason ?? '' })).unwrap();
        toast.success('User blocked');
      } else {
        await dispatch(unblockAdminUser(modal.item.userId)).unwrap();
        toast.success('User unblocked');
      }
      dispatch(fetchAllAdminUsers(params));
    } catch {
      toast.error('Action failed');
    }
    closeModal();
  };

  const columns: ColumnDef<AdminUser>[] = [
    { key: 'userId', header: 'ID', render: (row) => <span className="font-mono text-xs">#{row.userId}</span> },
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <span className="text-xs text-gray-600">{row.role?.roleName ?? 'N/A'}</span>,
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/users/${row.userId}`)}
            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-md hover:bg-violet-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {row.status === 'ACTIVE' ? (
            <button
              onClick={() => openModal(row, 'block')}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Block"
            >
              <Ban size={16} />
            </button>
          ) : row.status === 'BLOCKED' ? (
            <button
              onClick={() => openModal(row, 'unblock')}
              className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
              title="Unblock"
            >
              <CheckCircle size={16} />
            </button>
          ) : null}
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
        data={users?.content ?? []}
        loading={usersLoading}
        currentPage={page}
        totalPages={users?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No users found"
        emptyMessage="Try adjusting your filters."
      />

      <ActionModal
        open={modal.open}
        title={modal.action === 'block' ? 'Block User' : 'Unblock User'}
        description={
          modal.action === 'block'
            ? `Are you sure you want to block ${modal.item?.firstName} ${modal.item?.lastName}?`
            : `Are you sure you want to unblock ${modal.item?.firstName} ${modal.item?.lastName}?`
        }
        requireReason={modal.action === 'block'}
        reasonLabel="Block Reason"
        confirmLabel={modal.action === 'block' ? 'Block User' : 'Unblock User'}
        confirmVariant={modal.action === 'block' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={handleAction}
        onClose={closeModal}
      />
    </div>
  );
}
