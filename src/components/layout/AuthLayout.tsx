import { Outlet } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-white/5 rounded-full" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <ShoppingBag size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">ShopBazar</span>
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold text-white leading-tight">
          Shop smarter,<br />live better.
        </h2>
        <p className="mt-4 text-violet-200 text-base leading-relaxed max-w-xs">
          Discover thousands of products at unbeatable prices from verified sellers — all in one place.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            { emoji: '🛍️', label: '10,000+ curated products' },
            { emoji: '🔒', label: 'Secure & encrypted payments' },
            { emoji: '🚚', label: 'Fast & reliable delivery' },
            { emoji: '↩️', label: 'Hassle-free returns' },
          ].map(({ emoji, label }) => (
            <li key={label} className="flex items-center gap-3 text-violet-100">
              <span className="text-xl leading-none">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-violet-300 text-sm">
        Trusted by <span className="font-semibold text-white">50,000+</span> happy customers
      </p>
    </div>
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel />
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
