import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Star, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { productApi } from '../../../api/productApi';
import type { ProductResponse, ProductImageResponse } from '../../../types/product';
import StatusBadge from '../../../admin/components/StatusBadge';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/ui/Button';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [images, setImages] = useState<ProductImageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const id = Number(productId);

    Promise.all([productApi.getProductById(id), productApi.getProductImages(id)])
      .then(([productRes, imagesRes]) => {
        if (productRes.success) setProduct(productRes.data);
        if (imagesRes.success) setImages(imagesRes.data);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <Loader fullPage text="Loading product..." />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-2">Product not found.</p>
        <Link to="/seller/products" className="text-emerald-600 hover:underline text-sm">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/seller/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Product ID: #{product.productId}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={product.status} />
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
              onClick={() => navigate(`/seller/products/${productId}/edit`)}
            >
              <Pencil size={14} />
              Edit
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">{product.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 font-medium">₹</span>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Tag size={16} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{product.categoryName ?? 'Uncategorized'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Package size={16} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-gray-500">Stock</p>
              <p className={`font-medium ${product.stockQuantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {product.stockQuantity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Star size={16} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="font-medium text-gray-900">
                {product?.rating?.toFixed(1)} ({product?.reviewCount} reviews)
              </p>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Images</p>
            <div className="flex gap-3 flex-wrap">
              {images.map((img, i) => (
                <img
                  key={img.imageId}
                  src={img.imageUrl}
                  alt={`${product.name} ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
