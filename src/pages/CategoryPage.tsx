import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategoryById, fetchCategoryProducts } from '../store/slices/categorySlice';
import CategoryHeader from '../components/category/CategoryHeader';
import FilterSidebar, { DEFAULT_FILTERS, type Filters } from '../components/category/FilterSidebar';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown, { type SortOption } from '../components/common/SortDropdown';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';

const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCategory, categoryProducts, loading, error } = useAppSelector(
    (state) => state.category
  );

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);

  const categoryId = Number(id);

  // Fetch category info + products when categoryId or page changes
  useEffect(() => {
    if (!categoryId || isNaN(categoryId)) return;
    dispatch(fetchCategoryById(categoryId));
    dispatch(fetchCategoryProducts({ categoryId, params: { page, size: PAGE_SIZE } }));
  }, [dispatch, categoryId, page]);

  // Reset state when category changes
  useEffect(() => {
    setPage(0);
    setSort('newest');
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  }, [categoryId]);

  const products = categoryProducts?.content ?? [];
  const totalPages = categoryProducts?.totalPages ?? 0;
  const totalElements = categoryProducts?.totalElements ?? 0;

  // Client-side filtering and sorting
  const displayProducts = useMemo(() => {
    let filtered = [...products];

    // Price filter
    const minPrice = appliedFilters.minPrice ? parseFloat(appliedFilters.minPrice) : null;
    const maxPrice = appliedFilters.maxPrice ? parseFloat(appliedFilters.maxPrice) : null;
    if (minPrice !== null && !isNaN(minPrice)) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Rating filter
    if (appliedFilters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= appliedFilters.minRating);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  }, [products, appliedFilters, sort]);

  const handleApplyFilters = (newFilters: Filters) => {
    setAppliedFilters(newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full-page loader on initial load (no data yet)
  if (loading && !categoryProducts) {
    return <Loader fullPage size="lg" text="Loading category..." />;
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => {
              dispatch(fetchCategoryById(categoryId));
              dispatch(fetchCategoryProducts({ categoryId, params: { page, size: PAGE_SIZE } }));
            }}
            className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <CategoryHeader
        categoryName={currentCategory?.name ?? null}
        totalProducts={totalElements}
        loading={loading && !categoryProducts}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mt-6 mb-6 gap-4">
        {/* Mobile filter toggle (hidden on lg+, rendered by FilterSidebar) */}
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="hidden sm:block text-sm text-gray-500">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {displayProducts.length}
            </span>{' '}
            products
          </span>
          <SortDropdown
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      {/* Main content: Sidebar + Products */}
      <div className="flex gap-8">
        {/* Desktop sidebar (hidden on mobile, rendered by FilterSidebar) */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size="lg" text="Loading products..." />
            </div>
          ) : displayProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your filters or browse a different category."
            />
          ) : (
            <ProductGrid products={displayProducts} />
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
