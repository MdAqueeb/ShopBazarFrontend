import { Link } from 'react-router-dom';
import { Percent, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-400/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:py-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
            <Percent size={30} className="text-amber-300" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Up to 50% Off
            </h3>
            <p className="text-violet-200 mt-1 text-sm sm:text-base">
              Grab the best deals before they're gone. Limited time offer on
              selected items.
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          Shop the Sale
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
