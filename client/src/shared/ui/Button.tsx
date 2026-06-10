import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-800',
  danger: 'bg-red-500 text-white hover:bg-red-400'
};

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      fullWidth ? 'w-full' : ''
    } ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
