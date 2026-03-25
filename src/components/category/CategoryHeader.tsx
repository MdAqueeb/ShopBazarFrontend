import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface CategoryHeaderProps {
  categoryName: string | null;
  totalProducts: number;
  loading: boolean;
}

export default function CategoryHeader({ categoryName, totalProducts, loading }: CategoryHeaderProps) {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-violet-600 transition-colors">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-violet-600 transition-colors">
          Products
        </Link>
        {categoryName && (
          <>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </>
        )}
      </nav>

      {/* Title */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryName ?? 'Category'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
          </p>
        </div>
      )}
    </div>
  );
}
