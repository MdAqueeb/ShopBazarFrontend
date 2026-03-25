import { useNavigate } from 'react-router-dom';
import { Grid3X3 } from 'lucide-react';
import type { Category } from '../../types/category';

const CATEGORY_COLORS = [
  'from-violet-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-cyan-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-400 to-blue-500',
  'from-lime-500 to-green-600',
];

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const navigate = useNavigate();
  const gradient = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

  return (
    <button
      onClick={() => navigate(`/category/${category.categoryId}`)}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Grid3X3 size={24} />
      </div>
      <span className="text-sm font-semibold text-gray-800 text-center line-clamp-1">
        {category.name}
      </span>
    </button>
  );
}
