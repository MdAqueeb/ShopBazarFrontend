import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';

const reasonSchema = z.object({
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
});

type ReasonForm = z.infer<typeof reasonSchema>;

interface ActionModalProps {
  open: boolean;
  title: string;
  description?: string;
  requireReason?: boolean;
  reasonLabel?: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
}

export default function ActionModal({
  open,
  title,
  description,
  requireReason = false,
  reasonLabel = 'Reason',
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onClose,
}: ActionModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReasonForm>({
    resolver: requireReason ? zodResolver(reasonSchema) : undefined,
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ReasonForm) => {
    onConfirm(data.reason);
    reset();
  };

  const handleConfirmWithoutReason = () => {
    onConfirm();
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        {requireReason ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {reasonLabel}
              </label>
              <textarea
                {...register('reason')}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder={`Enter ${reasonLabel.toLowerCase()}...`}
              />
              {errors.reason && (
                <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant={confirmVariant} size="sm" type="submit" isLoading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant={confirmVariant}
              size="sm"
              onClick={handleConfirmWithoutReason}
              isLoading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
