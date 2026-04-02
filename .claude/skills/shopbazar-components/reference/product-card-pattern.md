# Product Card Pattern

The product card is the atomic unit of e-commerce UI. Every pixel affects conversion.

## Anatomy

```
┌─────────────────────────────┐
│  [Image + Badge]            │ ← Urgency (Limited, Sale, New)
├─────────────────────────────┤
│ Product Name (2 lines)      │
│ ★★★★☆ (142 reviews)        │ ← Trust signals
│ $29.99 — $39.99 (variants)  │ ← Price range
│ [Add to Cart] [♡ Wishlist]  │ ← Clear CTAs
└─────────────────────────────┘
```

## Implementation

```tsx
// components/ProductCard.tsx
import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/store/cartSlice";
import { Product } from "@/types/product";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "grid" | "compact";
}

export default function ProductCard({
  product,
  className,
  variant = "grid",
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      // Toast success handled by Redux thunk
    } catch {
      // Error toast handled by Redux thunk
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={cn(
        "group rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-gray-300",
        variant === "compact" && "flex gap-4",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square rounded-t-xl">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}

        {/* Image with lazy loading */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category (optional) */}
        {product.category && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-1.5 font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating + Review count (social proof) */}
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-sm",
                    i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"
                  )}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount ?? 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-red-600">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) *
                    100
                )}
                % off
              </span>
            </>
          )}
        </div>

        {/* Stock status */}
        {product.stock !== undefined && (
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              product.stock > 5
                ? "text-green-600"
                : product.stock > 0
                ? "text-amber-600"
                : "text-red-600"
            )}
          >
            {product.stock > 5
              ? "In Stock"
              : product.stock > 0
              ? `Only ${product.stock} left`
              : "Out of Stock"}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.stock}
            className="flex-1 btn btn-primary btn-sm"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={cn(
              "btn btn-outline btn-sm px-3",
              isFavorited && "btn-primary"
            )}
            aria-label="Add to wishlist"
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Responsive Variants

```tsx
// ProductListView.tsx — Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// ProductCompareView.tsx — Compact row layout
<div className="space-y-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} variant="compact" />
  ))}
</div>
```

## Conversion Optimization Checklist

- ✅ **Price clarity** — Show final price (including sales, excluding tax)
- ✅ **Social proof** — Ratings, review count, "bestseller" badge
- ✅ **Urgency signals** — "Only 3 left", "Sale ends Friday", limited-time badge
- ✅ **Stock status** — Green (in stock), amber (low), red (out of stock)
- ✅ **Trust** — Free shipping indicator, return policy link
- ✅ **Mobile touch** — 48px+ button, readable at small screens
- ✅ **Performance** — Lazy-loaded images, image optimization, no layout shift
- ✅ **Accessibility** — Alt text on images, clear button labels, keyboard navigation

## Performance Tips

1. **Image optimization**
   ```tsx
   // Use srcset for responsive images
   <img
     src={product.image}
     srcSet={`${product.image}?w=300 300w, ${product.image}?w=600 600w`}
     sizes="(max-width: 768px) 100vw, 50vw"
   />
   ```

2. **Lazy loading**
   ```tsx
   <img loading="lazy" /> // Native browser lazy loading
   ```

3. **Memoization** (prevent unnecessary re-renders)
   ```tsx
   export default memo(ProductCard);
   ```

4. **Intersection Observer** (for analytics tracking)
   ```tsx
   useEffect(() => {
     const observer = new IntersectionObserver(([entry]) => {
       if (entry.isIntersecting) {
         // Track product view
         trackEvent("product_view", { productId: product.id });
       }
     });
     observer.observe(ref.current!);
   }, [product.id]);
   ```
