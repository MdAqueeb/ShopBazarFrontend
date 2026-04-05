import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Share2,
  ChevronRight,
  Package,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsWishlisted } from '../../store/slices/wishlistSlice';
import { fetchProductById, clearCurrentProduct } from '../../store/slices/productSlice';
import { fetchProductReviews } from '../../store/slices/reviewSlice';
import { requireAuth } from '../../utils/authGuard';

function StarRating({ rating, large = false }: { rating: number; large?: boolean }) {
  const size = large ? 18 : 13;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, accessToken } = useAppSelector((state) => state.auth);
  const { currentProduct: product, loading } = useAppSelector((state) => state.products);
  const { reviews } = useAppSelector((state) => state.review);
  const isLoggedIn = !!accessToken;

  const wishlisted = useAppSelector(selectIsWishlisted(product?.productId ?? 0));

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    dispatch(fetchProductById(productId));
    dispatch(fetchProductReviews({ productId, params: { page: 0, size: 10 } }));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleWishlistToggle = () => {
    if (!product) return;
    if (!requireAuth(isLoggedIn, navigate, 'Please login to add to wishlist')) return;
    if (wishlisted) {
      dispatch(removeFromWishlist(product.productId));
      toast.info(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!requireAuth(isLoggedIn, navigate, 'Please login to add items to cart')) return;
    dispatch(
      addToCart({
        userId: user!.userId,
        data: { productId: product.productId, quantity: qty },
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!requireAuth(isLoggedIn, navigate, 'Please login to continue')) return;
    dispatch(
      addToCart({
        userId: user!.userId,
        data: { productId: product.productId, quantity: qty },
      })
    );
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square rounded-3xl bg-gray-200" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-violet-600 hover:underline text-sm"
        >
          Back to products
        </button>
      </div>
    );
  }

  const images = product.imageUrls ?? [];
  const mainImage = images[selectedImage] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 animate-fade-in">
        <button
          onClick={() => navigate('/products')}
          className="hover:text-violet-600 transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Products
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-400">{product.categoryName}</span>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left: Image ─────────────────────────────────────────────────────── */}
        <div className="animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center shadow-2xl">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <Package size={80} strokeWidth={1} />
                <span className="text-sm">No image available</span>
              </div>
            )}

            {product.status && product.status !== 'ACTIVE' && (
              <div className="absolute top-5 left-5 bg-gray-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg capitalize">
                {product.status.toLowerCase()}
              </div>
            )}

            {/* Actions */}
            <div className="absolute bottom-5 right-5 flex flex-col gap-2">
              <button
                onClick={handleWishlistToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  wishlisted
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-white/90 backdrop-blur text-gray-500 hover:bg-white'
                }`}
              >
                <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur text-gray-500 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-violet-600 shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: <Shield size={16} />, label: 'Secure Payment', sub: 'SSL encrypted' },
              { icon: <Truck size={16} />, label: 'Free Delivery', sub: 'Orders over $50' },
              { icon: <RotateCcw size={16} />, label: 'Easy Returns', sub: '30-day policy' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
                <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                  {b.icon}
                </div>
                <p className="text-xs font-semibold text-gray-800">{b.label}</p>
                <p className="text-[10px] text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Info ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col animate-slide-up">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-2">
            {product.categoryName}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

          {/* Seller */}
          {product.sellerName && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
              <User size={13} />
              <span>Sold by <span className="font-medium text-gray-700">{product.sellerName}</span></span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <StarRating rating={product.rating} large />
            <span className="font-bold text-gray-900">{product.rating?.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.reviewCount?.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-4xl font-extrabold text-gray-900">${product.price?.toFixed(2)}</span>
          </div>

          {/* Stock */}
          <p className={`mt-2 text-sm font-medium ${product.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </p>

          <p className="mt-5 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-base font-bold text-gray-900">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                disabled={product.stockQuantity === 0}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              Add to Cart — ${(product.price * qty).toFixed(2)}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={product.stockQuantity === 0}
            className="mt-3 w-full py-3.5 border-2 border-violet-600 text-violet-600 hover:bg-violet-50 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* ── Reviews ──────────────────────────────────────────────────────────── */}
      {reviews && reviews.content && reviews.content.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.content.map((review) => (
              <div key={review.reviewId} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
