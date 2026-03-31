import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Package, Tag, User } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import StatusBadge from '../../components/StatusBadge';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { products } = useAppSelector((state) => state.admin);

  const product = products?.content.find((p) => p.productId === Number(productId));

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found. Go back to the</p>
        <Link to="/admin/products" className="text-violet-600 hover:underline">product list</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Product ID: #{product.productId}</p>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <p className="text-sm text-gray-600 mb-6">{product.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <DollarSign size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Tag size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{product.categoryName ?? 'Uncategorized'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Seller</p>
              <p className="font-medium text-gray-900">{product.sellerName ?? 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Package size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Stock</p>
              <p className="font-medium text-gray-900">{product.stockQuantity ?? 'N/A'}</p>
            </div>
          </div>
        </div>

        {product.blockReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm font-medium text-red-700">Block Reason</p>
            <p className="text-sm text-red-600 mt-0.5">{product.blockReason}</p>
          </div>
        )}

        {product.imageUrls && product.imageUrls.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Images</p>
            <div className="flex gap-3 flex-wrap">
              {product.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`${product.name} ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
