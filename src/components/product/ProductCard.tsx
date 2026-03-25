import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsWishlisted } from '../../store/slices/wishlistSlice';
import { requireAuth } from '../../utils/authGuard';
import type { ProductResponse } from '../../types/product';

interface ProductCardProps {
  product: ProductResponse;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!accessToken;
  const wishlisted = useAppSelector(selectIsWishlisted(product.productId));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth(isLoggedIn, navigate, 'Please login to add items to cart')) return;
    dispatch(
      addToCart({
        userId: user!.userId,
        data: { productId: product.productId, quantity: 1 },
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const imageUrl = product.imageUrls?.[0];

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
            <ShoppingCart size={40} className="text-violet-300" />
          </div>
        )}
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!requireAuth(isLoggedIn, navigate, 'Please login to add to wishlist')) return;
            if (wishlisted) {
              dispatch(removeFromWishlist(product.productId));
              toast.info(`${product.name} removed from wishlist`);
            } else {
              dispatch(addToWishlist(product));
              toast.success(`${product.name} added to wishlist`);
            }
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 backdrop-blur text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white'
          }`}
        >
          <Heart size={14} className={wishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide mb-1">
          {product.categoryName}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2.5">
          {product.name}
        </h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.rating} />
            <span className="text-xs font-medium text-amber-600">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-violet-600 hover:bg-violet-700 active:scale-90 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-violet-300"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
