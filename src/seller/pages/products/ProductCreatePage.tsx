import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { toast } from 'react-toastify';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllCategories } from '../../../store/slices/categorySlice';
import { productApi } from '../../../api/productApi';
import { inventoryApi } from '../../../api/inventoryApi';
import useSellerAuth from '../../hooks/useSellerAuth';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  categoryId: z.number().int().min(1, 'Select a category'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  initialStock: z.number().int().min(0, 'Stock cannot be negative'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellerId } = useSellerAuth();
  const categories = useAppSelector((state) => state.category.categories);

  const [submitting, setSubmitting] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: 'ACTIVE', initialStock: 0 },
  });

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const onSubmit = async (data: ProductFormData) => {
    if (!sellerId) return;
    setSubmitting(true);
    try {
      const { initialStock, ...productData } = data;
      const res = await productApi.createProduct({ sellerId, ...productData });
      if (res.success && res.data) {
        const productId = res.data.productId;
        await inventoryApi.createInventory({ productId, stock: initialStock });
        toast.success('Product created successfully');
        setCreatedProductId(productId);
      } else {
        toast.error(res.message ?? 'Failed to create product');
      }
    } catch {
      toast.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !createdProductId) return;
    setImageUploading(true);
    try {
      const res = await productApi.uploadProductImage(createdProductId, file);
      if (res.success) {
        setUploadedImages((prev) => [...prev, res.data.imageUrl]);
        toast.success('Image uploaded');
      } else {
        toast.error('Image upload failed');
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => navigate('/seller/products')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Product</h2>

        {!createdProductId ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Product Name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                placeholder="Enter product name"
                error={errors.name?.message}
                {...register('name')}
              />
            </FormField>

            <FormField label="Description" htmlFor="description" error={errors.description?.message}>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe your product..."
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                {...register('description')}
              />
            </FormField>

            <FormField label="Price (₹)" htmlFor="price" error={errors.price?.message}>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
              <select
                id="categoryId"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${errors.categoryId ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                {...register('categoryId', { setValueAs: (v: string) => (v === '' ? 0 : Number(v)) })}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Initial Stock" htmlFor="initialStock" error={errors.initialStock?.message}>
              <Input
                id="initialStock"
                type="number"
                min="0"
                placeholder="0"
                error={errors.initialStock?.message}
                {...register('initialStock', { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Status" htmlFor="status" error={errors.status?.message}>
              <select
                id="status"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors hover:border-gray-300"
                {...register('status')}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/seller/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
                isLoading={submitting}
              >
                Create Product
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-700 font-medium">
                Product created successfully. You can now upload images.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Product Images</p>
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {uploadedImages.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Product image ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                aria-label="Upload product image"
              />
              <Button
                type="button"
                variant="secondary"
                isLoading={imageUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                Upload Image
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
                onClick={() => navigate('/seller/products')}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
