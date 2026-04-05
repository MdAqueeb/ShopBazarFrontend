import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { toast } from 'react-toastify';
import { ArrowLeft, Trash2, Upload } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllCategories } from '../../../store/slices/categorySlice';
import { productApi } from '../../../api/productApi';
import type { ProductImageResponse } from '../../../types/product';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/common/Loader';

const editSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
});

type EditFormData = z.infer<typeof editSchema>;

export default function ProductEditPage() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector((state) => state.category.categories);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImageResponse[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (!productId) return;
    const id = Number(productId);

    Promise.all([
      productApi.getProductById(id),
      productApi.getProductImages(id),
      dispatch(fetchAllCategories()),
    ])
      .then(([productRes, imagesRes]) => {
        if (productRes.success) {
          const p = productRes.data;
          reset({ name: p.name, description: p.description, price: p.price });
        }
        if (imagesRes.success) {
          setImages(imagesRes.data);
        }
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setPageLoading(false));
  }, [productId, dispatch, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!productId) return;
    setSubmitting(true);
    try {
      const res = await productApi.updateProduct(Number(productId), data);
      if (res.success) {
        toast.success('Product updated successfully');
        navigate(`/seller/products/${productId}`);
      } else {
        toast.error(res.message ?? 'Failed to update product');
      }
    } catch {
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !productId) return;
    setImageUploading(true);
    try {
      const res = await productApi.uploadProductImage(Number(productId), file);
      if (res.success) {
        setImages((prev) => [...prev, res.data]);
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

  const handleDeleteImage = async (imageId: number) => {
    if (!productId) return;
    setDeletingImageId(imageId);
    try {
      await productApi.deleteProductImage(Number(productId), imageId);
      setImages((prev) => prev.filter((img) => img.imageId !== imageId));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeletingImageId(null);
    }
  };

  if (pageLoading) return <Loader fullPage text="Loading product..." />;

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => navigate(`/seller/products/${productId}`)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Product
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Product</h2>

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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/seller/products/${productId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
              isLoading={submitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Product Images</h3>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((img) => (
              <div key={img.imageId} className="relative group">
                <img
                  src={img.imageUrl}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  loading="lazy"
                />
                <button
                  onClick={() => handleDeleteImage(img.imageId)}
                  disabled={deletingImageId === img.imageId}
                  className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="Delete image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="edit-image-upload"
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

      {/* categories is loaded but only used for context; edit API doesn't accept categoryId */}
      {categories.length === 0 && null}
    </div>
  );
}
