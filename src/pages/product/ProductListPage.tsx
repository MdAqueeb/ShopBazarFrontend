// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ShoppingCart,
//   Heart,
//   Star,
//   SlidersHorizontal,
//   ChevronDown,
//   Search,
//   Sparkles,
//   TrendingUp,
//   Tag,
// } from 'lucide-react';



// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   originalPrice?: number;
//   rating: number;
//   reviews: number;
//   badge?: string;
//   gradient: string;
//   icon: string;
// }

// const PRODUCTS: Product[] = [
//   { id: 1, name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 79.99, originalPrice: 129.99, rating: 4.8, reviews: 2341, badge: 'Sale', gradient: 'from-blue-400 to-indigo-600', icon: '🎧' },
//   { id: 2, name: 'Premium Leather Wallet', category: 'Fashion', price: 34.99, rating: 4.6, reviews: 892, badge: 'New', gradient: 'from-amber-400 to-orange-500', icon: '👛' },
//   { id: 3, name: 'Smart Fitness Tracker', category: 'Electronics', price: 59.99, originalPrice: 89.99, rating: 4.7, reviews: 1567, badge: 'Hot', gradient: 'from-emerald-400 to-teal-600', icon: '⌚' },
//   { id: 4, name: 'Scented Soy Candle Set', category: 'Home', price: 24.99, rating: 4.9, reviews: 431, gradient: 'from-pink-400 to-rose-500', icon: '🕯️' },
//   { id: 5, name: 'Running Shoes Pro', category: 'Sports', price: 94.99, rating: 4.5, reviews: 3210, gradient: 'from-violet-400 to-purple-600', icon: '👟' },
//   { id: 6, name: 'Stainless Steel Water Bottle', category: 'Sports', price: 19.99, originalPrice: 29.99, rating: 4.8, reviews: 5621, badge: 'Sale', gradient: 'from-cyan-400 to-sky-600', icon: '🧴' },
//   { id: 7, name: 'Minimalist Desk Lamp', category: 'Home', price: 44.99, rating: 4.4, reviews: 768, gradient: 'from-yellow-400 to-amber-500', icon: '💡' },
//   { id: 8, name: 'Organic Face Serum', category: 'Beauty', price: 38.99, badge: 'New', rating: 4.7, reviews: 1203, gradient: 'from-fuchsia-400 to-pink-600', icon: '✨' },
// ];

// const CATEGORIES = [
//   { name: 'All',         emoji: '🛍️', active: 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200' },
//   { name: 'Electronics', emoji: '💻', active: 'bg-blue-600   text-white border-blue-600   shadow-lg shadow-blue-200' },
//   { name: 'Fashion',     emoji: '👗', active: 'bg-amber-500  text-white border-amber-500  shadow-lg shadow-amber-200' },
//   { name: 'Home',        emoji: '🏠', active: 'bg-pink-500   text-white border-pink-500   shadow-lg shadow-pink-200' },
//   { name: 'Sports',      emoji: '⚽', active: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200' },
//   { name: 'Beauty',      emoji: '💄', active: 'bg-fuchsia-500 text-white border-fuchsia-500 shadow-lg shadow-fuchsia-200' },
// ];

// const BADGE_STYLES: Record<string, string> = {
//   Sale: 'bg-red-500 text-white',
//   New:  'bg-emerald-500 text-white',
//   Hot:  'bg-orange-500 text-white',
// };

// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <Star
//           key={i}
//           size={12}
//           className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
//         />
//       ))}
//     </div>
//   );
// }

// export default function ProductListPage() {
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [wishlist, setWishlist]     = useState<number[]>([]);
//   const navigate = useNavigate();

//   const filtered = activeCategory === 'All'
//     ? PRODUCTS
//     : PRODUCTS.filter((p) => p.category === activeCategory);

//   const toggleWishlist = (id: number) =>
//     setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

//   return (
//     <div>
//       {/* ── Hero ──────────────────────────────────────────────────────────────── */}
//       <section className="relative bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-900 overflow-hidden">
//         {/* Dot grid */}
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',
//             backgroundSize: '32px 32px',
//           }}
//         />
//         {/* Glowing orbs */}
//         <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute top-1/2 right-10 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl pointer-events-none" />

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
//           <div className="max-w-2xl">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
//               <Sparkles size={14} className="text-amber-300" />
//               <span className="text-white/90 text-sm font-medium">New arrivals every week</span>
//             </div>

//             {/* Headline */}
//             <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] animate-slide-up">
//               Discover{' '}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300">
//                 Amazing
//               </span>
//               <br />Products
//             </h1>
//             <p className="mt-5 text-lg text-violet-200 animate-slide-up delay-100">
//               Shop from thousands of curated products at unbeatable prices, delivered fast.
//             </p>

//             {/* Search */}
//             <div className="mt-8 flex gap-3 animate-slide-up delay-200">
//               <div className="relative flex-1">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   type="search"
//                   placeholder="Search products, brands…"
//                   className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xl"
//                 />
//               </div>
//               <button className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-xl shadow-amber-500/20">
//                 Search
//               </button>
//             </div>

//             {/* Stats */}
//             <div className="mt-10 flex gap-8 animate-fade-in delay-300">
//               {[['10K+', 'Products'], ['50K+', 'Happy Customers'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
//                 <div key={label}>
//                   <p className="text-2xl font-extrabold text-white">{val}</p>
//                   <p className="text-sm text-violet-300 mt-0.5">{label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom wave */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
//             <path d="M0 48L1440 48L1440 12C1200 44 960 56 720 44C480 32 240 4 0 12L0 48Z" fill="rgb(249 250 251)" />
//           </svg>
//         </div>
//       </section>

//       {/* ── Promo banners ─────────────────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up delay-100">
//           {[
//             { icon: <TrendingUp size={18} />, label: 'Trending Deals',   sub: 'Up to 50% off',   bg: 'from-violet-500 to-indigo-600' },
//             { icon: <Tag         size={18} />, label: 'Flash Sale Today', sub: 'Ends in 4h 20m',  bg: 'from-rose-500   to-pink-600'   },
//             { icon: <Sparkles    size={18} />, label: 'New Arrivals',     sub: '500+ new items',  bg: 'from-amber-400  to-orange-500' },
//           ].map((item) => (
//             <button
//               key={item.label}
//               className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${item.bg} text-white text-left hover:scale-[1.02] transition-transform shadow-lg`}
//             >
//               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
//                 {item.icon}
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">{item.label}</p>
//                 <p className="text-xs text-white/80 mt-0.5">{item.sub}</p>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* ── Categories ──────────────────────────────────────────────────────── */}
//         <section className="mt-10">
//           <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
//           <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
//             {CATEGORIES.map((cat, i) => (
//               <button
//                 key={cat.name}
//                 onClick={() => setActiveCategory(cat.name)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all animate-slide-up ${
//                   activeCategory === cat.name
//                     ? cat.active
//                     : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:scale-105'
//                 }`}
//                 style={{ animationDelay: `${i * 60}ms` }}
//               >
//                 <span>{cat.emoji}</span>
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* ── Filter bar ──────────────────────────────────────────────────────── */}
//         <div className="flex items-center justify-between mt-8 mb-6">
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
//           </p>
//           <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm">
//               <SlidersHorizontal size={14} />
//               Filters
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors shadow-sm">
//               Sort by
//               <ChevronDown size={14} />
//             </button>
//           </div>
//         </div>

//         {/* ── Product grid ────────────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
//           {filtered.map((product, i) => (
//             <div
//               key={product.id}
//               className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-slide-up"
//               style={{ animationDelay: `${i * 80}ms` }}
//               onClick={() => navigate(`/products/${product.id}`)}
//             >
//               {/* Image */}
//               <div className={`relative h-48 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}>
//                 <span className="text-6xl animate-float" style={{ animationDelay: `${i * 200}ms` }}>
//                   {product.icon}
//                 </span>
//                 {/* Shine effect */}
//                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                 {product.badge && (
//                   <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge]}`}>
//                     {product.badge}
//                   </span>
//                 )}
//                 <button
//                   onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
//                   className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
//                     wishlist.includes(product.id)
//                       ? 'bg-red-500 text-white scale-110'
//                       : 'bg-white/80 backdrop-blur text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white'
//                   }`}
//                 >
//                   <Heart size={14} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
//                 </button>
//               </div>

//               {/* Info */}
//               <div className="p-4">
//                 <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
//                 <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2.5">{product.name}</h3>

//                 <div className="flex items-center gap-1.5 mb-3">
//                   <StarRating rating={product.rating} />
//                   <span className="text-xs font-medium text-amber-600">{product.rating}</span>
//                   <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-baseline gap-1.5">
//                     <span className="text-lg font-extrabold text-gray-900">${product.price}</span>
//                     {product.originalPrice && (
//                       <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
//                     )}
//                   </div>
//                   <button
//                     onClick={(e) => e.stopPropagation()}
//                     className="w-9 h-9 bg-violet-600 hover:bg-violet-700 active:scale-90 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-violet-300"
//                   >
//                     <ShoppingCart size={15} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
} from 'lucide-react';

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/slices/productSlice";
import type { RootState, AppDispatch } from "../../store/store";

interface UIProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  gradient: string;
  icon: string;
}

const CATEGORIES = [
  { name: 'All', emoji: '🛍️', active: 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200' },
  { name: 'Electronics', emoji: '💻', active: 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' },
  { name: 'Fashion', emoji: '👗', active: 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200' },
  { name: 'Home', emoji: '🏠', active: 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200' },
  { name: 'Sports', emoji: '⚽', active: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200' },
  { name: 'Beauty', emoji: '💄', active: 'bg-fuchsia-500 text-white border-fuchsia-500 shadow-lg shadow-fuchsia-200' },
];

const BADGE_STYLES: Record<string, string> = {
  Sale: 'bg-red-500 text-white',
  New: 'bg-emerald-500 text-white',
  Hot: 'bg-orange-500 text-white',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ProductListPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // 🔥 Backend → UI mapping
  const mappedProducts: UIProduct[] = products.map((p) => ({
    id: p.productId,
    name: p.name,
    category: p.categoryName,
    price: p.price,
    originalPrice: undefined,
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? 0,
    badge: p.rating >= 4.7 ? "Hot" : undefined,
    gradient: "from-blue-400 to-indigo-600",
    icon: "📦",
  }));

  const filtered =
    activeCategory === "All"
      ? mappedProducts
      : mappedProducts.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  if (loading) {
    return <div className="text-center py-20 text-lg font-semibold">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-900 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-white/90 text-sm font-medium">New arrivals every week</span>
            </div>

            {/* Headline */}
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

            {/* Search */}
            <div className="mt-8 flex gap-3 animate-slide-up delay-200">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search products, brands…"
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xl"
                />
              </div>
              <button className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-xl shadow-amber-500/20">
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8 animate-fade-in delay-300">
              {[['10K+', 'Products'], ['50K+', 'Happy Customers'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-white">{val}</p>
                  <p className="text-sm text-violet-300 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
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
            { icon: <TrendingUp size={18} />, label: 'Trending Deals',   sub: 'Up to 50% off',   bg: 'from-violet-500 to-indigo-600' },
            { icon: <Tag         size={18} />, label: 'Flash Sale Today', sub: 'Ends in 4h 20m',  bg: 'from-rose-500   to-pink-600'   },
            { icon: <Sparkles    size={18} />, label: 'New Arrivals',     sub: '500+ new items',  bg: 'from-amber-400  to-orange-500' },
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
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all animate-slide-up ${
                  activeCategory === cat.name
                    ? cat.active
                    : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:scale-105'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

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
              Sort by
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* ── Product grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Image */}
              <div className={`relative h-48 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}>
                <span className="text-6xl animate-float" style={{ animationDelay: `${i * 200}ms` }}>
                  {product.icon}
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {product.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    wishlist.includes(product.id)
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-white/80 backdrop-blur text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-white'
                  }`}
                >
                  <Heart size={14} className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2.5">{product.name}</h3>

                <div className="flex items-center gap-1.5 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-xs font-medium text-amber-600">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 bg-violet-600 hover:bg-violet-700 active:scale-90 rounded-xl flex items-center justify-center text-white transition-all shadow-md shadow-violet-300"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}