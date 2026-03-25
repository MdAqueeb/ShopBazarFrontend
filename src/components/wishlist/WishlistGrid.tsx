import WishlistItem from './WishlistItem';
import type { ProductResponse } from '../../types/product';

interface WishlistGridProps {
  items: ProductResponse[];
}

export default function WishlistGrid({ items }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((product, i) => (
        <div
          key={product.productId}
          className="animate-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <WishlistItem product={product} />
        </div>
      ))}
    </div>
  );
}
