import { useState } from 'react';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

export interface Filters {
  minPrice: string;
  maxPrice: string;
  minRating: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
}

export const DEFAULT_FILTERS: Filters = {
  minPrice: '',
  maxPrice: '',
  minRating: 0,
};

export default function FilterSidebar({ filters, onApply, onReset }: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [local, setLocal] = useState<Filters>(filters);

  const hasActiveFilters =
    local.minPrice !== '' || local.maxPrice !== '' || local.minRating > 0;

  const handleApply = () => {
    onApply(local);
    setMobileOpen(false);
  };

  const handleReset = () => {
    setLocal(DEFAULT_FILTERS);
    onReset();
    setMobileOpen(false);
  };

  const content = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={local.minPrice}
            onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <span className="text-gray-400 text-sm shrink-0">to</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={local.maxPrice}
            onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setLocal({
                  ...local,
                  minRating: local.minRating === rating ? 0 : rating,
                })
              }
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                local.minRating === rating
                  ? 'bg-violet-50 border border-violet-200 text-violet-700'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-violet-300'
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 fill-gray-300'
                    }
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={handleApply} size="md" className="w-full">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleReset} size="md" className="w-full">
            Reset All
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm"
      >
        <SlidersHorizontal size={14} />
        Filters
        {hasActiveFilters && (
          <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-violet-600 hover:text-violet-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filters
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto h-[calc(100%-65px)]">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
