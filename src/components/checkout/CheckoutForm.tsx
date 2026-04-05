import { useState, useEffect } from 'react';
import { CreditCard, Banknote, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import AddressSelector from './AddressSelector';
import type { Address } from '../../types/address';

type PaymentMethod = 'COD' | 'ONLINE';

interface CheckoutFormProps {
  addresses: Address[];
  addressLoading: boolean;
  userId: number;
  onPlaceOrder: (addressId: number, paymentMethod: string) => void;
  placingOrder: boolean;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'COD',
    label: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: <Banknote size={20} />,
  },
  {
    value: 'ONLINE',
    label: 'Online Payment',
    description: 'Pay securely via card or UPI',
    icon: <CreditCard size={20} />,
  },
];

export default function CheckoutForm({
  addresses,
  addressLoading,
  userId,
  onPlaceOrder,
  placingOrder,
}: CheckoutFormProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    addresses && Array.isArray(addresses) ? addresses.find((a) => a.isDefault)?.addressId ?? null : null
  );

  useEffect(() => {
    if (!selectedAddressId && addresses && Array.isArray(addresses) && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.addressId);
      } else if (addresses[0]) {
        setSelectedAddressId(addresses[0].addressId);
      }
    }
  }, [addresses, selectedAddressId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const canSubmit = selectedAddressId !== null && !placingOrder;

  const handlePlaceOrderClick = () => {
    if (!selectedAddressId) return;
    onPlaceOrder(selectedAddressId, paymentMethod);
  };

  return (
    <div className="space-y-8">
      {/* Address Section */}
      <AddressSelector
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={setSelectedAddressId}
        userId={userId}
        loading={addressLoading}
      />

      {/* Payment Method Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CreditCard size={16} className="text-violet-600" />
          Payment Method
        </h3>
        <div className="space-y-3">
          {PAYMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPaymentMethod(option.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                paymentMethod === option.value
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-violet-300'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  paymentMethod === option.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
              {paymentMethod === option.value && (
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handlePlaceOrderClick}
        type="button"
        size="lg"
        className="w-full"
        disabled={!canSubmit}
        isLoading={placingOrder}
      >
        Place Order
      </Button>

      {!selectedAddressId && (
        <p className="text-xs text-center text-amber-600">
          Please select or add a delivery address to continue
        </p>
      )}
    </div>
  );
}
