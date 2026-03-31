# Form Patterns for E-Commerce

React Hook Form + Zod patterns for ShopBazar forms.

## Basic Form Pattern

```tsx
// schemas/contact.ts
import { z } from "zod";

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// components/ContactForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/schemas/contact";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold mb-1">
          Subject *
        </label>
        <input
          id="subject"
          type="text"
          placeholder="How can we help?"
          {...register("subject")}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.subject && (
          <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold mb-1">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Your message..."
          {...register("message")}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

## Complex Form with Redux Integration

```tsx
// schemas/profile.ts
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?[\d\s()-]{10,}$/, "Invalid phone number"),
  dateOfBirth: z.string().date("Invalid date"),
  newsletter: z.boolean().default(false),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// store/userSlice.ts
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: ProfileFormData) => {
    const res = await api.patch("/user/profile", data);
    return res.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: { /* ... */ },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        // Toast handled elsewhere
      })
      .addCase(updateProfile.rejected, (state, action) => {
        // Error handled in form
      });
  },
});

// components/ProfileForm.tsx
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateProfile } from "@/store/userSlice";
import { profileSchema, type ProfileFormData } from "@/schemas/profile";

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user, // Pre-fill with current user data
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      reset(data); // Reset form state after success
    } catch (error) {
      // Error shown inline via form state
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      {/* Form fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">First Name *</label>
          <input
            type="text"
            {...register("firstName")}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Last Name *</label>
          <input
            type="text"
            {...register("lastName")}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email, phone, etc. */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary"
      >
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
```

## Form with Dynamic Fields

```tsx
// schemas/checkout.ts (with conditional validation)
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  useBillingAddress: z.boolean(),
  billingAddress: addressSchema.optional(),
}).refine(
  (data) => {
    if (!data.useBillingAddress && !data.billingAddress) return false;
    return true;
  },
  {
    message: "Billing address required",
    path: ["billingAddress"],
  }
);

// components/CheckoutForm.tsx
import { useFieldArray, useWatch } from "react-hook-form";

export default function CheckoutForm() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  // Watch the checkbox to conditionally render billing address
  const useBillingAddress = useWatch({
    control,
    name: "useBillingAddress",
  });

  return (
    <form className="space-y-6">
      {/* Shipping Address */}
      <div>
        <h3 className="font-semibold mb-4">Shipping Address</h3>
        {/* Address fields */}
      </div>

      {/* Billing Address Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("useBillingAddress")}
          defaultChecked={true}
        />
        <span>Use different billing address</span>
      </label>

      {/* Conditional Billing Address */}
      {useBillingAddress && (
        <div>
          <h3 className="font-semibold mb-4">Billing Address</h3>
          {/* Billing address fields */}
          {errors.billingAddress && (
            <p className="text-red-600 text-sm">
              {errors.billingAddress.message}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
```

## Form with File Upload

```tsx
// schemas/review.ts
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Review must be at least 20 characters"),
  images: z
    .instanceof(FileList)
    .refine(
      (files) => files.length <= 5,
      "Maximum 5 images allowed"
    )
    .refine(
      (files) => {
        if (files.length === 0) return true;
        return Array.from(files).every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );
      },
      "Only JPEG, PNG, WebP images allowed"
    ),
});

// components/ReviewForm.tsx
export default function ReviewForm({ productId }: { productId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    const formData = new FormData();
    formData.append("rating", String(data.rating));
    formData.append("title", data.title);
    formData.append("content", data.content);

    // Add images
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block font-semibold mb-2">Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <label key={i} className="cursor-pointer">
              <input
                type="radio"
                value={i}
                {...register("rating", { valueAsNumber: true })}
                className="hidden"
              />
              <span className="text-3xl hover:scale-110 transition">★</span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block font-semibold mb-1">Review Title *</label>
        <input
          type="text"
          placeholder="Great product!"
          {...register("title")}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block font-semibold mb-1">Review *</label>
        <textarea
          rows={5}
          placeholder="Share your experience..."
          {...register("content")}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.content && (
          <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-semibold mb-2">Photos (optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images")}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
          </label>
        </div>
        {errors.images && (
          <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>
        )}
      </div>

      <button type="submit" className="w-full btn btn-primary">
        Submit Review
      </button>
    </form>
  );
}
```

## Reusable Form Components

```tsx
// components/FormField.tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Usage
<FormField label="Email" error={errors.email?.message} required>
  <input {...register("email")} type="email" />
</FormField>
```

## Form Submission Handling

```tsx
// Pattern: Show inline errors, success message, and disable button
const onSubmit = async (data: FormData) => {
  try {
    // Validation errors auto-shown by react-hook-form
    const result = await dispatch(submitForm(data)).unwrap();

    // Show success
    toast.success("Changes saved successfully");

    // Reset form or redirect
    redirect(`/order/${result.id}`);
  } catch (error) {
    // API errors
    if (error instanceof ValidationError) {
      // Server-side validation errors
      setServerErrors(error.errors);
    } else {
      // Network or other errors
      toast.error("An error occurred. Please try again.");
    }
  }
};
```

## Best Practices Checklist

- ✅ Define Zod schemas first (schema-driven development)
- ✅ Use `react-hook-form` for all forms (never raw useState)
- ✅ Show validation errors inline (never in toasts)
- ✅ Disable submit button while loading
- ✅ Disable form inputs during submission (prevent double-submit)
- ✅ Pre-fill forms with existing data when editing
- ✅ Use `useCallback` for submit handlers to prevent unnecessary renders
- ✅ Handle both client-side and server-side validation
- ✅ Show success messages (toast) after submission
- ✅ Implement debouncing for async validation (search, availability checks)
- ✅ Test forms with various input types and edge cases
