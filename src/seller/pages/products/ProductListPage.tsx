import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSellerProducts } from '../../../store/slices/sellerSlice';
import { productApi } from '../../../api/productApi';
import type { ProductResponse } from '../../../types/product';
import DataTable from '../../../admin/components/DataTable';
import type { ColumnDef } from '../../../admin/components/DataTable';
import StatusBadge from '../../../admin/components/StatusBadge';
import FilterBar from '../../../admin/components/FilterBar';
import ActionModal from '../../../admin/components/ActionModal';
import useActionModal from '../../../admin/hooks/useActionModal';
import useSellerAuth from '../../hooks/useSellerAuth';
import useSellerPagination from '../../hooks/useSellerPagination';
import Button from '../../../components/ui/Button';

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Pending', value: 'PENDING' },
];

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellerId } = useSellerAuth();
  const { products, loading } = useAppSelector((state) => state.seller);
  const { page, filter, params, onPageChange, onFilterChange } = useSellerPagination();
  const { modal, openModal, closeModal } = useActionModal<ProductResponse>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerProducts({ sellerId, params }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sellerId, page, filter]);

  const handleDelete = async () => {
    if (!modal.item) return;
    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(modal.item.productId);
      toast.success('Product deleted successfully');
      if (sellerId) {
        dispatch(fetchSellerProducts({ sellerId, params }));
      }
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
      closeModal();
    }
  };

  const columns: ColumnDef<ProductResponse>[] = [
    {
      key: 'productId',
      header: 'ID',
      render: (row) => <span className="font-mono text-xs">#{row.productId}</span>,
    },
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
      header: 'Price (₹)',
      render: (row) => <span className="font-medium">₹{row.price.toFixed(2)}</span>,
    },
    {
      key: 'stockQuantity',
      header: 'Stock',
      render: (row) => (
        <span className={row.stockQuantity === 0 ? 'text-red-600 font-medium' : 'text-gray-700'}>
          {row.stockQuantity}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/seller/products/${row.productId}`)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => navigate(`/seller/products/${row.productId}/edit`)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => openModal(row, 'delete')}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FilterBar options={filterOptions} activeFilter={filter} onFilterChange={onFilterChange} />
        <Button
          onClick={() => navigate('/seller/products/new')}
          className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
          size="sm"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products?.content ?? []}
        loading={loading}
        currentPage={page}
        totalPages={products?.totalPages ?? 0}
        onPageChange={onPageChange}
        emptyTitle="No products found"
        emptyMessage="Add your first product to get started."
      />

      <ActionModal
        open={modal.open}
        title="Delete Product"
        description={`Are you sure you want to delete "${modal.item?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
