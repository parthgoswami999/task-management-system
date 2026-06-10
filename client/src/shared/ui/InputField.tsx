import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  textarea?: false;
  rightAdornment?: ReactNode;
  enablePasswordToggle?: boolean;
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  textarea: true;
}

type Props = InputProps | TextareaProps;

export const InputField = (props: Props) => {
  const commonClasses =
    'w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400';
  const [showPassword, setShowPassword] = useState(false);

  if (props.textarea) {
    const textareaProps = {
      ...props,
      textarea: undefined
    };

    return (
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">{props.label}</span>
        <textarea className={`${commonClasses} min-h-28 resize-none`} {...textareaProps} />
        {props.error ? <span className="text-sm text-red-300">{props.error}</span> : null}
      </label>
    );
  }

  const { label, error, rightAdornment, enablePasswordToggle, type, ...inputProps } = props;
  const isPasswordField = type === 'password';
  const effectiveRightAdornment =
    enablePasswordToggle && isPasswordField ? (
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path
              d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.88 5.09C10.56 4.9 11.27 4.8 12 4.8C16.5 4.8 20.14 8.36 21 12C20.67 13.39 19.93 14.69 18.87 15.72"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.12 18.91C13.44 19.1 12.73 19.2 12 19.2C7.5 19.2 3.86 15.64 3 12C3.33 10.61 4.07 9.31 5.13 8.28"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M2.25 12C3.34 8.47 7.37 5.25 12 5.25C16.63 5.25 20.66 8.47 21.75 12C20.66 15.53 16.63 18.75 12 18.75C7.37 18.75 3.34 15.53 2.25 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    ) : (
      rightAdornment
    );

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <div className="relative">
        <input
          className={`${commonClasses} ${effectiveRightAdornment ? 'pr-14' : ''}`}
          type={enablePasswordToggle && isPasswordField && showPassword ? 'text' : type}
          {...inputProps}
        />
        {effectiveRightAdornment ? (
          <div className="absolute inset-y-0 right-3 flex items-center">{effectiveRightAdornment}</div>
        ) : null}
      </div>
      {error ? <span className="text-sm text-red-300">{error}</span> : null}
    </label>
  );
};
