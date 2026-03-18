import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register as registerUser } from '../../store/slices/authSlice';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Please check your email to verify.');
    } else {
      toast.error((result.payload as string) || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="mt-2 text-gray-500">Join ShopBazar and start shopping today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <Input
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              error={errors.firstName?.message}
              leftIcon={<User size={15} />}
              {...register('firstName')}
            />
          </FormField>

          <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <Input
              id="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              error={errors.lastName?.message}
              leftIcon={<User size={15} />}
              {...register('lastName')}
            />
          </FormField>
        </div>

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            leftIcon={<Mail size={15} />}
            {...register('email')}
          />
        </FormField>

        <FormField label="Phone number (optional)" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            leftIcon={<Phone size={15} />}
            {...register('phone')}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register('password')}
          />
        </FormField>

        <p className="text-xs text-gray-400">
          By creating an account you agree to our{' '}
          <a href="#" className="text-violet-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-violet-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-violet-600 hover:text-violet-700 font-semibold"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
