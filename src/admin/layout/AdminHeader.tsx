import { useLocation, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/sellers': 'Seller Management',
  '/admin/products': 'Product Moderation',
  '/admin/orders': 'Order Monitoring',
  '/admin/categories': 'Category Management',
};

export default function AdminHeader() {
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  const title = pageTitles[pathname] ?? pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Admin';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 capitalize">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {user?.firstName} {user?.lastName}
        </span>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <LogOut size={16} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </header>
  );
}
