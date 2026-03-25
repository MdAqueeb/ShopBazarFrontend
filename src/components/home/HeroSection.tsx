import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-900 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <Sparkles size={14} className="text-amber-300" />
            <span className="text-white/90 text-sm font-medium">
              New arrivals every week
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] animate-slide-up">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300">
              ShopBazar
            </span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-violet-200 animate-slide-up delay-100 max-w-lg">
            Discover thousands of curated products at unbeatable prices,
            delivered fast to your doorstep.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4 animate-slide-up delay-200">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-xl shadow-amber-500/20"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Browse All
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8 animate-fade-in delay-300">
            {[
              ['10K+', 'Products'],
              ['50K+', 'Happy Customers'],
              ['4.9', 'Avg Rating'],
            ].map(([val, label]) => (
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
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 48L1440 48L1440 12C1200 44 960 56 720 44C480 32 240 4 0 12L0 48Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </section>
  );
}
