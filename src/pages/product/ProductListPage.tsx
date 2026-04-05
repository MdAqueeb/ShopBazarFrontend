import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Sparkles,
  TrendingUp,
  Tag,
  Package,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { requireAuth } from '../../utils/authGuard';
import type { ProductResponse } from '../../types/product';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  product: ProductResponse;
  onAddToCart: (p: ProductResponse) => void;
  onToggleWishlist: (p: ProductResponse) => void;
  isWishlisted: boolean;
}) {
  const navigate = useNavigate();
  const image = product.imageUrls?.[0];

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Package size={48} strokeWidth={1} className="text-gray-300" />
        )}

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {product.stockQuantity === 0 && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-700 text-white">
            Out of Stock
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 backdrop-blur text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white'
          }`}
        >
          <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
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

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating ?? 0} />
          <span className="text-xs font-medium text-amber-600">{(product.rating ?? 0).toFixed(1)}</span>
          <span className="text-xs text-gray-400">({(product.reviewCount ?? 0).toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold text-gray-900">${product.price?.toFixed(2)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={product.stockQuantity === 0}
            className="w-9 h-9 bg-violet-600 hover:bg-violet-700 active:scale-90 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-violet-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, accessToken } = useAppSelector((state) => state.auth);
  const { products, loading, error } = useAppSelector((state) => state.products);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isLoggedIn = !!accessToken;

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  const productList: ProductResponse[] = products?.content ?? [];

  // Derive unique categories from API data
  const categories = ['All', ...Array.from(new Set(productList.map((p) => p.categoryName).filter(Boolean)))];

  const filtered = productList.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.categoryName === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: ProductResponse) => {
    if (!requireAuth(isLoggedIn, navigate, 'Please login to add items to cart')) return;
    dispatch(addToCart({ userId: user!.userId, data: { productId: product.productId, quantity: 1 } }));
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (product: ProductResponse) => {
    if (!requireAuth(isLoggedIn, navigate, 'Please login to manage wishlist')) return;
    const isWishlisted = wishlistItems.some((i) => i.productId === product.productId);
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.productId));
      toast.info(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-white/90 text-sm font-medium">New arrivals every week</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] animate-slide-up">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300">
                Amazing
              </span>
              <br />Products
            </h1>
            <p className="mt-5 text-lg text-violet-200 animate-slide-up delay-100">
              Shop from thousands of curated products at unbeatable prices, delivered fast.
            </p>
            <div className="mt-8 flex gap-3 animate-slide-up delay-200">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search products, brands…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xl"
                />
              </div>
            </div>
            <div className="mt-10 flex gap-8 animate-fade-in delay-300">
              {[
                [String(products?.totalElements ?? '...'), 'Products'],
                ['50K+', 'Happy Customers'],
                ['4.9★', 'Avg Rating'],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="text-sm text-violet-300 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L1440 48L1440 12C1200 44 960 56 720 44C480 32 240 4 0 12L0 48Z" fill="rgb(249 250 251)" />
          </svg>
        </div>
      </section>

      {/* ── Promo banners ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up delay-100">
          {[
            { icon: <TrendingUp size={18} />, label: 'Trending Deals',   sub: 'Up to 50% off',  bg: 'from-violet-500 to-indigo-600' },
            { icon: <Tag        size={18} />, label: 'Flash Sale Today', sub: 'Ends in 4h 20m', bg: 'from-rose-500 to-pink-600' },
            { icon: <Sparkles   size={18} />, label: 'New Arrivals',     sub: '500+ new items', bg: 'from-amber-400 to-orange-500' },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${item.bg} text-white text-left hover:scale-[1.02] transition-transform shadow-lg`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-white/80 mt-0.5">{item.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Categories ──────────────────────────────────────────────────────── */}
        {categories.length > 1 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:scale-105'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Filter bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm">
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm">
              Sort by <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* ── Product grid ────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} strokeWidth={1} className="mx-auto mb-4" />
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
            {filtered.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some((i) => i.productId === product.productId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
