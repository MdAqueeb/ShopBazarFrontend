import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCategoryTree, createNewCategory, removeCategory } from '../../../store/slices/categorySlice';
import type { CategoryTree } from '../../../types/category';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import useActionModal from '../../hooks/useActionModal';
import ActionModal from '../../components/ActionModal';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  parentCategoryId: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const { categoryTree, categories, loading } = useAppSelector((state) => state.category);
  const { modal, openModal, closeModal } = useActionModal<CategoryTree>();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    dispatch(fetchCategoryTree());
  }, [dispatch]);

  const onSubmit = async (data: CategoryForm) => {
    try {
      await dispatch(createNewCategory({
        name: data.name,
        parentId: data.parentCategoryId ? Number(data.parentCategoryId) : undefined,
      })).unwrap();
      toast.success('Category created');
      reset();
      dispatch(fetchCategoryTree());
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async () => {
    if (!modal.item) return;
    try {
      await dispatch(removeCategory(modal.item.categoryId)).unwrap();
      toast.success('Category deleted');
      dispatch(fetchCategoryTree());
    } catch {
      toast.error('Failed to delete category');
    }
    closeModal();
  };

  const renderCategory = (cat: CategoryTree, depth = 0) => (
    <div key={cat.categoryId}>
      <div
        className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openModal(cat, 'delete')}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {cat.subCategories?.map((sub) => renderCategory(sub, depth + 1))}
    </div>
  );

  if (loading) return <Loader fullPage text="Loading categories..." />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Category</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Input {...register('name')} placeholder="Category name" error={errors.name?.message} />
            </div>
            <div>
              <select
                {...register('parentCategoryId')}
                className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">No parent (root category)</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" size="sm" className="w-full">
              <Plus size={16} />
              Add Category
            </Button>
          </form>
        </div>
      </div>

      {/* Category tree */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
          {categoryTree.length === 0 ? (
            <EmptyState title="No categories" message="Create your first category to get started." />
          ) : (
            <div className="divide-y divide-gray-100">
              {categoryTree.map((cat) => renderCategory(cat))}
            </div>
          )}
        </div>
      </div>

      <ActionModal
        open={modal.open && modal.action === 'delete'}
        title="Delete Category"
        description={`Are you sure you want to delete "${modal.item?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
