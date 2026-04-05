import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { modifySellerProfile, deactivateSeller } from '../../../store/slices/sellerSlice';
import useSellerAuth from '../../hooks/useSellerAuth';
import useActionModal from '../../../admin/hooks/useActionModal';
import type { Seller } from '../../../types/seller';

import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import ActionModal from '../../../admin/components/ActionModal';
import StatusBadge from '../../../admin/components/StatusBadge';

const settingsSchema = z.object({
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .optional()
    .or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sellerId, seller } = useSellerAuth();
  const loading = useAppSelector((state) => state.seller.loading);
  const { modal, openModal, closeModal } = useActionModal<Seller>();
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { storeName: '', description: '' },
  });

  useEffect(() => {
    if (seller) {
      reset({ storeName: seller.storeName, description: '' });
    }
  }, [seller, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!sellerId) return;
    try {
      await dispatch(modifySellerProfile({ sellerId, data })).unwrap();
      toast.success('Store profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleDeactivate = async () => {
    if (!sellerId) return;
    setDeactivateLoading(true);
    try {
      await dispatch(deactivateSeller(sellerId)).unwrap();
      toast.success('Store deactivated');
      navigate('/');
    } catch {
      toast.error('Failed to deactivate store');
    } finally {
      setDeactivateLoading(false);
      closeModal();
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Store Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Store Profile</h2>
          {seller?.status && <StatusBadge status={seller.status} />}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            label="Store Name"
            htmlFor="storeName"
            error={errors.storeName?.message}
          >
            <Input
              id="storeName"
              placeholder="Enter your store name"
              error={errors.storeName?.message}
              {...register('storeName')}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
          >
            <textarea
              id="description"
              rows={4}
              placeholder="Describe your store..."
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
              {...register('description')}
            />
          </FormField>

          <div className="pt-1">
            <Button type="submit" isLoading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone card */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Deactivating your store will make it invisible to customers. This action can be
          reversed by contacting support.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (seller) openModal(seller, 'deactivate');
          }}
          disabled={!seller}
        >
          Deactivate Store
        </Button>
      </div>

      <ActionModal
        open={modal.open}
        title="Deactivate Store"
        description="Are you sure? This will hide your store from all customers."
        confirmLabel="Deactivate"
        confirmVariant="danger"
        loading={deactivateLoading}
        onConfirm={handleDeactivate}
        onClose={closeModal}
      />
    </div>
  );
}
