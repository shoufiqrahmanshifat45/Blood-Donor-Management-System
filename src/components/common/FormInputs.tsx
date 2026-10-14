import React from 'react';
import { Loader2 } from 'lucide-react';

// ==========================================
// FormField Container
// ==========================================
export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 tracking-tight"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
};

// ==========================================
// TextInput
// ==========================================
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full py-2 bg-slate-50 dark:bg-[#111c34] border rounded-xl text-[13px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#162340] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200/90 dark:border-slate-700 focus:border-red-500 focus:ring-red-500/15'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

// ==========================================
// SelectInput
// ==========================================
export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className = '', error, options, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full py-2 px-3 bg-slate-50 dark:bg-[#111c34] border rounded-xl text-[13px] text-slate-800 dark:text-slate-100 transition-all focus:outline-none focus:bg-white dark:focus:bg-[#162340] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200/90 dark:border-slate-700 focus:border-red-500 focus:ring-red-500/15'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#111c34] text-slate-800 dark:text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
SelectInput.displayName = 'SelectInput';

// ==========================================
// Button
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-sm shadow-red-500/20 focus:ring-red-500 active:scale-[0.98]',
    secondary:
      'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-slate-300 active:scale-[0.98]',
    outline:
      'bg-transparent border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-300',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-200',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-[13px] px-4 py-2 gap-2',
    lg: 'text-[14px] px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
