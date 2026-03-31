import { cn } from '../../utils/cn';

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 ring-green-600/20',
  APPROVED: 'bg-green-50 text-green-700 ring-green-600/20',
  SUCCESS: 'bg-green-50 text-green-700 ring-green-600/20',
  DELIVERED: 'bg-green-50 text-green-700 ring-green-600/20',

  PENDING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  UNPAID: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  IN_TRANSIT: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  PROCESSING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  PLACED: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',

  BLOCKED: 'bg-red-50 text-red-700 ring-red-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  DELETED: 'bg-red-50 text-red-700 ring-red-600/20',
  FAILED: 'bg-red-50 text-red-700 ring-red-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',

  INACTIVE: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  REFUNDED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  SHIPPED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-50 text-gray-600 ring-gray-500/20';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        style,
        className,
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
