import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightElement, ...props }, ref) => (
    <div className="relative w-full flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'transition-colors',
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-gray-200 bg-white hover:border-gray-300',
          leftIcon ? 'pl-9' : 'pl-3.5',
          rightElement ? 'pr-10' : 'pr-3.5',
          props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {rightElement && (
        <span className="absolute right-3 flex items-center">{rightElement}</span>
      )}
    </div>
  ),
);

Input.displayName = 'Input';
export default Input;
