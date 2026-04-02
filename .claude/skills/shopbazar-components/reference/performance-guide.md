# Performance Optimization Guide

E-commerce sites live or die by speed. Every 100ms delay costs conversions.

## Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s

Run Lighthouse audits regularly. Target 90+.

## Image Optimization

### 1. Format & Size

```tsx
// ❌ Don't: Load full-resolution images
<img src="/products/shoe-1.jpg" /> // 3MB!

// ✅ Do: Use next-gen formats with fallbacks
<picture>
  <source srcSet="/products/shoe-1.webp?w=400 400w" type="image/webp" />
  <source srcSet="/products/shoe-1.jpg?w=400 400w" type="image/jpeg" />
  <img src="/products/shoe-1.jpg?w=400" alt="Shoe" />
</picture>
```

### 2. Responsive Images

```tsx
<img
  src="/products/shoe-1.jpg?w=600"
  srcSet="
    /products/shoe-1.jpg?w=300 300w,
    /products/shoe-1.jpg?w=600 600w,
    /products/shoe-1.jpg?w=1200 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Shoe"
/>
```

### 3. Lazy Loading

```tsx
// Native lazy loading (browser handles it)
<img src="..." loading="lazy" />

// For older browsers + analytics tracking
import { useEffect, useRef } from "react";

export function LazyImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current) {
        ref.current.src = src;
        observer.unobserve(ref.current);
        // Track image view
        trackEvent("image_view", { url: src });
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={ref}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3C/svg%3E"
      alt={alt}
      className="aspect-video bg-gray-200"
    />
  );
}
```

### 4. Image CDN Integration

```tsx
// Use a CDN (Cloudinary, Imgix, AWS CloudFront) for automatic optimization
const imageUrl = (path: string, options: { w?: number; q?: number; f?: string }) => {
  const baseUrl = "https://cdn.shopbazar.com";
  const params = new URLSearchParams(options as any);
  return `${baseUrl}/${path}?${params.toString()}`;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <img
      src={imageUrl(product.image, { w: 600, q: 80, f: "webp" })}
      srcSet={`
        ${imageUrl(product.image, { w: 300, q: 80 })} 300w,
        ${imageUrl(product.image, { w: 600, q: 80 })} 600w
      `}
      alt={product.name}
    />
  );
}
```

## Code Splitting & Route-Based Lazy Loading

```tsx
// routes.tsx
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

// Loading fallback
function PageLoader() {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProductPage />
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <CheckoutPage />
      </Suspense>
    ),
  },
]);
```

## React Render Optimization

### 1. Memoization (Prevent Unnecessary Re-renders)

```tsx
// ❌ Bad: Re-renders on every parent update
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div>
      {/* ... */}
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
    </div>
  );
}

// ✅ Good: Only re-renders if props actually change
import { memo } from "react";

export const ProductCard = memo(
  function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
      <div>
        {/* ... */}
        <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
      </div>
    );
  },
  (prev, next) => {
    // Custom comparison: return true if no re-render needed
    return prev.product.id === next.product.id;
  }
);
```

### 2. useCallback (Stable Function References)

```tsx
// ❌ Bad: New function on every render
export function ProductList() {
  const handleAddToCart = (productId: string) => {
    // API call
  };

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}

// ✅ Good: Stable reference across renders
export function ProductList() {
  const dispatch = useAppDispatch();
  const handleAddToCart = useCallback(
    (productId: string) => {
      dispatch(addToCart({ productId, quantity: 1 }));
    },
    [dispatch]
  );

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

### 3. useMemo (Expensive Calculations)

```tsx
// Redux selectors already handle this, but for other expensive operations:
export function ProductList({ products }: { products: Product[] }) {
  // ✅ Only recalculates if products array changes
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating),
    [products]
  );

  const groupedByCategory = useMemo(
    () =>
      sortedProducts.reduce(
        (acc, product) => {
          acc[product.category] ??= [];
          acc[product.category].push(product);
          return acc;
        },
        {} as Record<string, Product[]>
      ),
    [sortedProducts]
  );

  return (
    // ...
  );
}
```

### 4. Virtual Scrolling (Large Lists)

```tsx
// For product listings with hundreds of items, use virtual scrolling
import { FixedSizeList } from "react-window";

export function ProductListVirtualized({ products }: { products: Product[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={350} // Height of each row
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Bundle Size Analysis

```bash
# Analyze bundle size
npm install -D @vite/plugin-visualizer

# vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    // ...
    visualizer({ open: true })
  ]
});

# Run build
npm run build
# Opens bundle analysis in browser
```

## Font Loading

```tsx
// index.css
/* Load fonts with display: swap to prevent layout shift */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap");

/* Or use font-face with font-display: swap */
@font-face {
  font-family: "CustomFont";
  src: url("/fonts/custom.woff2") format("woff2");
  font-display: swap; /* Show fallback while loading */
}
```

## Network Optimization

```tsx
// Prefetch next routes
import { useEffect } from "react";

export function ProductCard({ productId, nextProductId }: any) {
  useEffect(() => {
    // Prefetch next product details
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `/api/products/${nextProductId}`;
    document.head.appendChild(link);
  }, [nextProductId]);

  return (
    // ...
  );
}

// Or use React Router's action prefetch
<Link prefetch="intent" to={`/products/${product.id}`}>
  {product.name}
</Link>
```

## Performance Monitoring

```tsx
// Track Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte

// Send to analytics
function handleMetric(metric: any) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon("https://analytics.shopbazar.com/vitals", body);
}

getLCP(handleMetric);
getFID(handleMetric);
getCLS(handleMetric);
```

## Caching Strategy

```tsx
// Service worker caching (optional)
// Use Workbox for intelligent caching

// Browser cache headers (configure on server)
// Cache static assets: 1 year
// Cache API responses: 5 minutes
// Never cache HTML: no-cache

// Redux persist (optional)
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

## Monitoring Checklist

- ✅ Run Lighthouse audit weekly
- ✅ Monitor Core Web Vitals with analytics
- ✅ Profile React renders with DevTools Profiler
- ✅ Analyze bundle size regularly
- ✅ Set performance budgets (e.g., JS bundle < 150KB gzip)
- ✅ Test on slow networks (Chrome DevTools throttling)
- ✅ Monitor real-world metrics (Sentry, LogRocket, etc.)
