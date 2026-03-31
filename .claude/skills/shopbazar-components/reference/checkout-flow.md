# Checkout Flow Architecture

The checkout flow is where intention converts to revenue. Every step must reduce friction.

## Flow Overview

```
1. Cart Review
   ↓
2. Shipping Address (with auto-complete)
   ↓
3. Shipping Method (with price, timeline)
   ↓
4. Payment Method
   ↓
5. Order Review
   ↓
6. Order Confirmation
```

## State Management (Redux)

```tsx
// store/checkoutSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import { api } from "@/services/api";

// Schemas
export const addressSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone required"),
  street: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  zipCode: z.string().regex(/^\d{5}(?:-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(2, "Country required"),
});

export const shippingMethodSchema = z.object({
  methodId: z.string(),
  price: z.number().positive(),
  estimatedDays: z.number(),
});

export const paymentSchema = z.object({
  method: z.enum(["card", "paypal", "apple_pay"]),
  cardToken: z.string().optional(),
  billingAddress: addressSchema.optional(),
});

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  shippingMethod: shippingMethodSchema,
  payment: paymentSchema,
  promoCode: z.string().optional(),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

// Async thunks
export const submitCheckout = createAsyncThunk(
  "checkout/submit",
  async (data: CheckoutData) => {
    const res = await api.post("/orders", data);
    return res.data;
  }
);

export const validatePromoCode = createAsyncThunk(
  "checkout/validatePromo",
  async (code: string) => {
    const res = await api.get(`/promos/${code}`);
    return res.data;
  }
);

// Slice
interface CheckoutState {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  formData: Partial<CheckoutData>;
  shippingMethods: ShippingMethod[];
  promoDiscount: number | null;
  isLoading: boolean;
  error: string | null;
  orderId: string | null;
}

const initialState: CheckoutState = {
  step: 1,
  formData: {},
  shippingMethods: [],
  promoDiscount: null,
  isLoading: false,
  error: null,
  orderId: null,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.step < 6) state.step = (state.step + 1) as typeof state.step;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step = (state.step - 1) as typeof state.step;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setShippingMethods: (state, action) => {
      state.shippingMethods = action.payload;
    },
    setPromoDiscount: (state, action) => {
      state.promoDiscount = action.payload;
    },
    resetCheckout: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCheckout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.step = 6;
        state.orderId = action.payload.id;
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Checkout failed";
      })
      .addCase(validatePromoCode.fulfilled, (state, action) => {
        state.promoDiscount = action.payload.discount;
      });
  },
});

export const {
  nextStep,
  prevStep,
  updateFormData,
  setShippingMethods,
  setPromoDiscount,
  resetCheckout,
} = checkoutSlice.actions;
```

## Step-by-Step Components

### Step 1: Cart Review

```tsx
// pages/checkout/CartReviewStep.tsx
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { nextStep } from "@/store/checkoutSlice";
import { selectCartTotal, selectCartItems } from "@/store/cartSlice";

export default function CartReviewStep() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 border-t pt-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Estimated Tax</span>
          <span>${(total * 0.08).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>${(total * 1.08).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => dispatch(nextStep())}
        className="w-full btn btn-primary"
      >
        Continue to Shipping
      </button>
    </div>
  );
}
```

### Step 2: Shipping Address

```tsx
// pages/checkout/ShippingAddressStep.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/redux";
import { nextStep, updateFormData } from "@/store/checkoutSlice";
import { addressSchema } from "@/store/checkoutSlice";

type AddressFormData = z.infer<typeof addressSchema>;

export default function ShippingAddressStep() {
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (data: AddressFormData) => {
    dispatch(updateFormData({ shippingAddress: data }));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Full Name *
          </label>
          <input
            {...register("fullName")}
            placeholder="John Doe"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Additional fields: email, phone, street, city, state, zip, country */}
        {/* ... */}

        <button type="submit" className="w-full btn btn-primary">
          Continue to Shipping Method
        </button>
      </div>
    </form>
  );
}
```

### Step 3: Shipping Method

```tsx
// pages/checkout/ShippingMethodStep.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { nextStep, setShippingMethods } from "@/store/checkoutSlice";
import { fetchShippingMethods } from "@/store/checkoutSlice"; // async thunk

export default function ShippingMethodStep() {
  const dispatch = useAppDispatch();
  const methods = useAppSelector((state) => state.checkout.shippingMethods);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchShippingMethods());
  }, []);

  const handleContinue = () => {
    if (selected) {
      dispatch(updateFormData({ shippingMethod: selected }));
      dispatch(nextStep());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>

      <div className="space-y-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={selected === method.id}
              onChange={(e) => setSelected(e.target.value)}
              className="mr-4"
            />
            <div className="flex-1">
              <p className="font-semibold">{method.name}</p>
              <p className="text-sm text-gray-600">
                Arrives {method.estimatedDays} business days
              </p>
            </div>
            <p className="font-bold text-lg">${method.price.toFixed(2)}</p>
          </label>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full mt-6 btn btn-primary"
      >
        Continue to Payment
      </button>
    </div>
  );
}
```

### Step 4: Payment

```tsx
// pages/checkout/PaymentStep.tsx
// Similar pattern: form with React Hook Form + Zod
// Integrate Stripe/PayPal via createAsyncThunk
```

### Step 5: Order Review

```tsx
// pages/checkout/OrderReviewStep.tsx
// Display all entered data with edit links
// Final totals with breakdown (subtotal, tax, shipping)
// "Place Order" button → submitCheckout thunk
```

### Step 6: Order Confirmation

```tsx
// pages/checkout/OrderConfirmationStep.tsx
export default function OrderConfirmationStep() {
  const orderId = useAppSelector((state) => state.checkout.orderId);

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-3xl font-bold text-green-600 mb-2">
        Order Confirmed!
      </h2>
      <p className="text-gray-600 mb-6">
        Order #{orderId} placed successfully.
      </p>
      <p className="text-gray-600 mb-8">
        Confirmation email sent to your inbox.
      </p>
      <div className="space-y-3">
        <button className="w-full btn btn-primary">
          Track Your Order
        </button>
        <button className="w-full btn btn-outline">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
```

## Progress Indicator

```tsx
// components/CheckoutProgress.tsx
const steps = ["Cart", "Shipping", "Method", "Payment", "Review", "Confirm"];

export default function CheckoutProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex-1">
          <div
            className={cn(
              "h-1 rounded-full transition-colors",
              i < currentStep ? "bg-blue-600" : "bg-gray-200"
            )}
          />
          <p className="text-xs mt-1 text-center text-gray-600">{step}</p>
        </div>
      ))}
    </div>
  );
}
```

## Conversion Optimization

- **Guest checkout** — Don't force account creation
- **Auto-fill** — Use browser auto-complete for address
- **Address validation** — Real-time validation with Google Places API
- **Promo code** — Show discount immediately after validation
- **Error handling** — Highlight errors inline, provide clear recovery steps
- **Security trust** — Show SSL badge, payment provider logos
- **Exit prevention** — Warn if user navigates away with unsaved data
