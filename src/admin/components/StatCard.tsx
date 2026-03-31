import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
          <Icon size={18} className="text-violet-600" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <p className={cn('text-xs mt-1', trendUp ? 'text-green-600' : 'text-red-500')}>
          {trend}
        </p>
      )}
    </div>
  );
}
