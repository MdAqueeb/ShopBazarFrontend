import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FormField from '../ui/FormField';
import { useAppDispatch } from '../../store/hooks';
import { createNewAddress } from '../../store/slices/addressSlice';
import type { Address } from '../../types/address';

const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelect: (addressId: number) => void;
  userId: number;
  loading: boolean;
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  userId,
  loading,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  const onAddAddress = async (data: AddressFormData) => {
    const result = await dispatch(
      createNewAddress({ userId, data: { ...data, isDefault: addresses.length === 0 } })
    );
    if (createNewAddress.fulfilled.match(result)) {
      onSelect(result.payload.addressId);
      setShowForm(false);
      reset();
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-100 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin size={16} className="text-violet-600" />
        Delivery Address
      </h3>

      {/* Existing addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <button
              key={addr.addressId}
              onClick={() => onSelect(addr.addressId)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                selectedAddressId === addr.addressId
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-violet-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-violet-100 text-violet-700 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                </div>
                {selectedAddressId === addr.addressId && (
                  <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add new address toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
        >
          <Plus size={16} />
          Add New Address
        </button>
      ) : (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">New Address</h4>
          <form onSubmit={handleSubmit(onAddAddress)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Full Name" htmlFor="addr-name" error={errors.name?.message}>
                <Input id="addr-name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
              </FormField>
              <FormField label="Phone" htmlFor="addr-phone" error={errors.phone?.message}>
                <Input id="addr-phone" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
              </FormField>
            </div>

            <FormField label="Street Address" htmlFor="addr-street" error={errors.street?.message}>
              <Input id="addr-street" placeholder="123 Main St" error={errors.street?.message} {...register('street')} />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="City" htmlFor="addr-city" error={errors.city?.message}>
                <Input id="addr-city" placeholder="Mumbai" error={errors.city?.message} {...register('city')} />
              </FormField>
              <FormField label="State" htmlFor="addr-state" error={errors.state?.message}>
                <Input id="addr-state" placeholder="Maharashtra" error={errors.state?.message} {...register('state')} />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Postal Code" htmlFor="addr-postal" error={errors.postalCode?.message}>
                <Input id="addr-postal" placeholder="400001" error={errors.postalCode?.message} {...register('postalCode')} />
              </FormField>
              <FormField label="Country" htmlFor="addr-country" error={errors.country?.message}>
                <Input id="addr-country" placeholder="India" error={errors.country?.message} {...register('country')} />
              </FormField>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" size="sm" isLoading={isSubmitting}>
                Save Address
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setShowForm(false); reset(); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
