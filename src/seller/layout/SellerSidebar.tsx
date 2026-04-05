import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/products', icon: Package, label: 'Products' },
  { to: '/seller/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/seller/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/seller/settings', icon: Settings, label: 'Settings' },
];

export default function SellerSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-200 z-30',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
          <Store size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
            ShopBazar Seller
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
