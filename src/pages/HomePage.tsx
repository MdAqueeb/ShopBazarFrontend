import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchFeaturedProducts,
  fetchTrendingProducts,
  fetchNewArrivals,
  fetchHomeCategories,
} from '../store/slices/homeSlice';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {
    featuredProducts,
    trendingProducts,
    newArrivals,
    categories,
    featuredLoading,
    trendingLoading,
    newArrivalsLoading,
    categoriesLoading,
    error,
  } = useAppSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchTrendingProducts());
    dispatch(fetchNewArrivals());
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error banner */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Categories */}
        <div className="mt-12">
          <CategorySection
            categories={categories}
            loading={categoriesLoading}
          />
        </div>

        {/* Featured Products */}
        <div className="mt-16">
          <ProductSection
            title="Featured Products"
            products={featuredProducts}
            loading={featuredLoading}
          />
        </div>

        {/* Promo Banner */}
        <div className="mt-16">
          <PromoBanner />
        </div>

        {/* Trending Products */}
        <div className="mt-16">
          <ProductSection
            title="Trending Now"
            products={trendingProducts}
            loading={trendingLoading}
          />
        </div>

        {/* New Arrivals */}
        <div className="mt-16 pb-16">
          <ProductSection
            title="New Arrivals"
            products={newArrivals}
            loading={newArrivalsLoading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
