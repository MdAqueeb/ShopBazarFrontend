import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { User, Mail, Phone, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile, modifyUserProfile } from '../../store/slices/userSlice';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileProps {
  userId: number;
}

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: 'bg-blue-100 text-blue-700',
  SELLER: 'bg-amber-100 text-amber-700',
  ADMIN: 'bg-rose-100 text-rose-700',
};

export default function UserProfile({ userId }: UserProfileProps) {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone ?? '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const result = await dispatch(modifyUserProfile({ userId, data }));
    if (modifyUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
    } else {
      toast.error(error ?? 'Failed to update profile');
    }
  };

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : '??';

  const roleName = (currentUser as any)?.role?.roleName ?? 'CUSTOMER';
  const roleColor = ROLE_COLORS[roleName] ?? 'bg-gray-100 text-gray-700';

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Profile header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover strip */}
        <div className="h-28 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-violet-100 border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-extrabold text-violet-700 tracking-tight">
                {initials}
              </span>
            </div>

            {/* Badges */}
            <div className="flex gap-2 pb-1">
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${roleColor}`}>
                {roleName}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  currentUser?.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {currentUser?.status ?? '—'}
              </span>
            </div>
          </div>

          {/* Name & meta */}
          <h2 className="text-xl font-bold text-gray-900">
            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '—'}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Mail size={13} className="text-gray-400" />
              {currentUser?.email ?? '—'}
            </span>

            {(currentUser as any)?.emailVerified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle size={13} /> Email verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                <AlertCircle size={13} /> Email not verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <ShieldCheck size={15} className="text-violet-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input
                id="firstName"
                placeholder="John"
                error={errors.firstName?.message}
                leftIcon={<User size={14} />}
                {...register('firstName')}
              />
            </FormField>

            <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input
                id="lastName"
                placeholder="Doe"
                error={errors.lastName?.message}
                leftIcon={<User size={14} />}
                {...register('lastName')}
              />
            </FormField>
          </div>

          <FormField label="Email address" htmlFor="email-ro">
            <Input
              id="email-ro"
              type="email"
              value={currentUser?.email ?? ''}
              leftIcon={<Mail size={14} />}
              disabled
              readOnly
            />
            <p className="mt-1 text-xs text-gray-400">Email address cannot be changed.</p>
          </FormField>

          <FormField label="Phone number" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={14} />}
              {...register('phone')}
            />
          </FormField>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" isLoading={loading} size="lg" disabled={!isDirty}>
              Save Changes
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() =>
                  currentUser &&
                  reset({
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    phone: currentUser.phone ?? '',
                  })
                }
              >
                Discard
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
