import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchInventories,
  increaseProductStock,
  decreaseProductStock,
} from '../../../store/slices/inventorySlice';
import type { Inventory } from '../../../types/inventory';
import DataTable from '../../../admin/components/DataTable';
import type { ColumnDef } from '../../../admin/components/DataTable';
import Button from '../../../components/ui/Button';
import useSellerAuth from '../../hooks/useSellerAuth';
import useSellerPagination from '../../hooks/useSellerPagination';

const LOW_STOCK_THRESHOLD = 5;

type StockAction = 'increase' | 'decrease';

interface QuantityModalState {
  open: boolean;
  productId: number | null;
  action: StockAction;
}

export default function InventoryPage() {
  const dispatch = useAppDispatch();
  const { sellerId } = useSellerAuth();
  const { page, size, params, onPageChange } = useSellerPagination();

  const inventories = useAppSelector((state) => state.inventory.inventories);
  const loading = useAppSelector((state) => state.inventory.loading);


  

  const [modal, setModal] = useState<QuantityModalState>({
    open: false,
    productId: null,
    action: 'increase',
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (sellerId !== null) {
      dispatch(fetchInventories({ sellerId, ...params }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sellerId, page]);

  const openModal = (row: Inventory, action: StockAction) => {
    setQuantity(1);
    setModal({ open: true, productId: row.product.productId, action });
  };

  const closeModal = () => {
    // setModal({ open: false, productId: product.productId, action: 'increase' });
    setModal({open: false, productId: null, action: 'increase'})
    setQuantity(1);
  };

  const handleConfirm = async () => {
    if (modal?.productId === null) return;

    setOperationLoading(true);
    try {
      const thunk =
        modal.action === 'increase' ? increaseProductStock : decreaseProductStock;

      const result = await dispatch(
        thunk({ productId: modal?.productId, data: { quantity } }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(
          `Stock ${modal.action === 'increase' ? 'increased' : 'decreased'} by ${quantity} for product #${modal.productId}.`,
        );
        closeModal();
        if (sellerId !== null) {
          dispatch(fetchInventories({ sellerId, page, size }));
        }
      } else {
        toast.error(
          `Failed to ${modal.action} stock. Please try again.`,
        );
      }
    } finally {
      setOperationLoading(false);
    }
  };

  const columns: ColumnDef<Inventory>[] = [
    {
      key: 'productId',
      header: 'Product ID',
      render: (row) => (
        <span className="font-mono text-gray-800">#{row?.product?.productId}</span>
      ),
    },
    {
      key: 'stockQuantity',
      header: 'Stock Qty',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span className={row.stockQuantity === 0 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
            {row.stockQuantity}
          </span>
          {row.stockQuantity <= LOW_STOCK_THRESHOLD && row.stockQuantity > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
              Low
            </span>
          )}
          {row.stockQuantity === 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
              Out of stock
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'reservedQuantity',
      header: 'Reserved Qty',
      render: (row) => (
        <span className="text-gray-700">{row.reservedQuantity}</span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (row) => {
        const available = row.stockQuantity - row.reservedQuantity;
        return (
          <span
            className={
              available > 0
                ? 'text-emerald-600 font-medium'
                : 'text-red-600 font-medium'
            }
          >
            {available}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <button
            onClick={() => openModal(row, 'increase')}
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            + Increase
          </button>
          <button
            onClick={() => openModal(row, 'decrease')}
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            - Decrease
          </button>
        </span>
      ),
    },
  ];

  const rows = inventories?.content ?? [];
  const totalPages = inventories?.totalPages ?? 0;



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      </div>

      <DataTable<Inventory>
        columns={columns}
        data={rows}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        emptyTitle="No inventory records"
        emptyMessage="Your products' inventory will appear here once stock is added."
      />

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {modal.action === 'increase' ? 'Increase Stock' : 'Decrease Stock'}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Enter the quantity to {modal.action === 'increase' ? 'add to' : 'remove from'} stock for product{' '}
              <span className="font-mono font-medium text-gray-700">#{modal?.productId}</span>.
            </p>

            <div className="mb-5">
              <label
                htmlFor="qty-input"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Quantity
              </label>
              <input
                id="qty-input"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= 100) {
                    setQuantity(val);
                  }
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Min 1 — Max 100</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={closeModal}
                disabled={operationLoading}
              >
                Cancel
              </Button>
              <Button
                variant={modal.action === 'increase' ? 'primary' : 'danger'}
                size="sm"
                type="button"
                isLoading={operationLoading}
                onClick={handleConfirm}
                className={
                  modal.action === 'increase'
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500'
                    : ''
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
