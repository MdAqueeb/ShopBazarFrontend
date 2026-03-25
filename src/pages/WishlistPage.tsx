import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { selectWishlistItems, selectWishlistCount } from '../store/slices/wishlistSlice';
import WishlistGrid from '../components/wishlist/WishlistGrid';
import EmptyState from '../components/common/EmptyState';

export default function WishlistPage() {
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-scale-in">
        <EmptyState
          title="Your wishlist is empty"
          message="Browse products and tap the heart icon to save items you love."
          icon={<Heart size={40} className="text-rose-400" />}
        />
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          <ArrowLeft size={16} /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">
            {count} item{count !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      <WishlistGrid items={items} />
    </div>
  );
}
