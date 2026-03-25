import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';
import type { ProductResponse } from '../../types/product';

interface ProductSectionProps {
  title: string;
  products: ProductResponse[];
  loading: boolean;
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="w-20 h-3 rounded bg-gray-200" />
        <div className="w-full h-4 rounded bg-gray-200" />
        <div className="w-2/3 h-4 rounded bg-gray-200" />
        <div className="flex items-center justify-between pt-1">
          <div className="w-16 h-5 rounded bg-gray-200" />
          <div className="w-9 h-9 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({
  title,
  products,
  loading,
}: ProductSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
