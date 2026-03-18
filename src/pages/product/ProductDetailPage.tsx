import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Share2,
  ChevronRight,
} from 'lucide-react';

interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  gradient: string;
  icon: string;
  badge?: string;
  colors: string[];
  sizes: string[];
}

const PRODUCT_MAP: Record<string, ProductData> = {
  '1': { id: 1, name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 79.99, originalPrice: 129.99, rating: 4.8, reviews: 2341, badge: 'Sale', gradient: 'from-blue-400 to-indigo-600', icon: '🎧', colors: ['#1e1e2e', '#e2e8f0', '#3b82f6'], sizes: [], description: 'Experience crystal-clear audio with industry-leading noise cancellation. Up to 30 hours of battery life, premium comfort ear cushions, and USB-C fast charging.' },
  '2': { id: 2, name: 'Premium Leather Wallet', category: 'Fashion', price: 34.99, rating: 4.6, reviews: 892, badge: 'New', gradient: 'from-amber-400 to-orange-500', icon: '👛', colors: ['#92400e', '#1e1e1e', '#374151'], sizes: [], description: 'Handcrafted from full-grain Italian leather. Slim profile with 6 card slots, 2 cash compartments, and RFID-blocking protection.' },
  '3': { id: 3, name: 'Smart Fitness Tracker', category: 'Electronics', price: 59.99, originalPrice: 89.99, rating: 4.7, reviews: 1567, badge: 'Hot', gradient: 'from-emerald-400 to-teal-600', icon: '⌚', colors: ['#111827', '#d1d5db', '#10b981'], sizes: ['S/M', 'L/XL'], description: 'Track your health 24/7 — heart rate, SpO2, sleep quality, and 20+ workout modes. 7-day battery life, waterproof up to 50m.' },
  '4': { id: 4, name: 'Scented Soy Candle Set', category: 'Home', price: 24.99, rating: 4.9, reviews: 431, gradient: 'from-pink-400 to-rose-500', icon: '🕯️', colors: ['#fce7f3', '#fff1f2', '#fdf4ff'], sizes: [], description: 'Set of 3 hand-poured soy wax candles in premium glass jars. Scents: Lavender Bliss, Cedarwood & Amber, Fresh Linen. 45h burn time each.' },
  '5': { id: 5, name: 'Running Shoes Pro', category: 'Sports', price: 94.99, rating: 4.5, reviews: 3210, gradient: 'from-violet-400 to-purple-600', icon: '👟', colors: ['#7c3aed', '#1e1e2e', '#f0f9ff'], sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'], description: 'Engineered for performance. Responsive foam midsole, breathable mesh upper, and carbon-fibre plate for maximum energy return.' },
  '6': { id: 6, name: 'Stainless Steel Water Bottle', category: 'Sports', price: 19.99, originalPrice: 29.99, rating: 4.8, reviews: 5621, badge: 'Sale', gradient: 'from-cyan-400 to-sky-600', icon: '🧴', colors: ['#0e7490', '#1e3a5f', '#f0f9ff'], sizes: ['500ml', '750ml', '1L'], description: 'Triple-wall vacuum insulation keeps drinks cold 24h or hot 12h. BPA-free, leak-proof, and dishwasher safe. 500ml / 750ml / 1L options.' },
  '7': { id: 7, name: 'Minimalist Desk Lamp', category: 'Home', price: 44.99, rating: 4.4, reviews: 768, gradient: 'from-yellow-400 to-amber-500', icon: '💡', colors: ['#fafafa', '#1e1e2e', '#d97706'], sizes: [], description: 'Eye-care LED lamp with 5 colour temperatures and 10 brightness levels. USB-A charging port, touch controls, and flexible gooseneck.' },
  '8': { id: 8, name: 'Organic Face Serum', category: 'Beauty', price: 38.99, badge: 'New', rating: 4.7, reviews: 1203, gradient: 'from-fuchsia-400 to-pink-600', icon: '✨', colors: ['#f5f0ff', '#fdf2f8', '#fef9ee'], sizes: ['30ml', '50ml'], description: '100% organic, vegan-certified vitamin C and hyaluronic acid serum. Brightens skin, reduces fine lines, and delivers deep hydration.' },
};

const FALLBACK: ProductData = {
  id: 0, name: 'Product Not Found', category: '', price: 0, rating: 0, reviews: 0,
  description: '', gradient: 'from-gray-400 to-gray-600', icon: '📦', colors: [], sizes: [],
};

function StarRating({ rating, large = false }: { rating: number; large?: boolean }) {
  const size = large ? 18 : 13;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = (id && PRODUCT_MAP[id]) ? PRODUCT_MAP[id] : FALLBACK;

  const [qty, setQty]         = useState(1);
  const [wishlisted, setWish] = useState(false);
  const [selectedColor, setColor]   = useState(0);
  const [selectedSize, setSize]     = useState(0);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 animate-fade-in">
        <button onClick={() => navigate('/products')} className="hover:text-violet-600 transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Products
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-400">{product.category}</span>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left: Image ─────────────────────────────────────────────────────── */}
        <div className="animate-scale-in">
          <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${product.gradient} aspect-square flex items-center justify-center shadow-2xl`}>
            {/* Dot overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <span className="text-[9rem] animate-float relative z-10 drop-shadow-2xl">
              {product.icon}
            </span>

            {product.badge && (
              <div className="absolute top-5 left-5 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                {product.badge}
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur text-red-600 text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discount}%
              </div>
            )}

            {/* Actions */}
            <div className="absolute bottom-5 right-5 flex flex-col gap-2">
              <button
                onClick={() => setWish((w) => !w)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  wishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white/90 backdrop-blur text-gray-500 hover:bg-white'
                }`}
              >
                <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur text-gray-500 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: <Shield size={16} />,      label: 'Secure Payment',    sub: 'SSL encrypted' },
              { icon: <Truck size={16} />,        label: 'Free Delivery',     sub: 'Orders over $50' },
              { icon: <RotateCcw size={16} />,    label: 'Easy Returns',      sub: '30-day policy' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
                <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                  {b.icon}
                </div>
                <p className="text-xs font-semibold text-gray-800">{b.label}</p>
                <p className="text-[10px] text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Info ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col animate-slide-up">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <StarRating rating={product.rating} large />
            <span className="font-bold text-gray-900">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-4xl font-extrabold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-2.5">Colour</p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setColor(i)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === i ? 'border-violet-600 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-2.5">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSize(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSize === i
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-violet-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-base font-bold text-gray-900">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-300">
              <ShoppingCart size={18} />
              Add to Cart — ${(product.price * qty).toFixed(2)}
            </button>
          </div>

          <button className="mt-3 w-full py-3.5 border-2 border-violet-600 text-violet-600 hover:bg-violet-50 font-semibold rounded-xl transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
