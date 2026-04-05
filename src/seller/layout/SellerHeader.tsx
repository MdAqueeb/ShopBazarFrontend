import { useLocation, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

const pageTitles: Record<string, string> = {
  '/seller': 'Dashboard',
  '/seller/products': 'Products',
  '/seller/products/new': 'Add Product',
  '/seller/orders': 'Orders',
  '/seller/inventory': 'Inventory',
  '/seller/settings': 'Settings',
};

export default function SellerHeader() {
  const { pathname } = useLocation();
  const seller = useAppSelector((state) => state.seller.currentSeller);

  const title = pageTitles[pathname] ?? pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Seller';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 capitalize">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {seller?.storeName && (
          <span className="text-sm text-gray-500">{seller.storeName}</span>
        )}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <LogOut size={16} />
          <span>Exit to Shop</span>
        </Link>
      </div>
    </header>
  );
}
