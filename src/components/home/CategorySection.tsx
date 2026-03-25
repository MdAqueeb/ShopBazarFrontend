import CategoryCard from '../category/CategoryCard';
import type { Category } from '../../types/category';

interface CategorySectionProps {
  categories: Category[];
  loading: boolean;
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-gray-200" />
      <div className="w-16 h-4 rounded bg-gray-200" />
    </div>
  );
}

export default function CategorySection({ categories, loading }: CategorySectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No categories available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.categoryId}
              category={category}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
