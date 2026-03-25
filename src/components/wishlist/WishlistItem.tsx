import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import type { ProductResponse } from '../../types/product';

interface WishlistItemProps {
  product: ProductResponse;
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const imageUrl = product.imageUrls?.[0];

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(product.productId));
    toast.info(`${product.name} removed from wishlist`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(
      addToCart({
        userId: user.userId,
        data: { productId: product.productId, quantity: 1 },
      })
    );
    toast.success(`${product.name} added to cart`);
  };

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

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
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
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>
            <span className="text-xs font-medium text-amber-600">
              {product.rating.toFixed(1)}
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
