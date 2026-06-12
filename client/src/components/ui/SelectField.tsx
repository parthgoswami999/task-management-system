import { useEffect, useRef, useState } from 'react';

interface SelectFieldProps {
  label: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const SelectField = ({
  label,
  error,
  value,
  onValueChange,
  options
}: SelectFieldProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm font-medium text-slate-100 outline-none transition hover:border-brand-400"
          aria-expanded={menuOpen}
          aria-label={`Select ${label}`}
        >
          <span>{selectedOption?.label || 'Select an option'}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-slate-300">
            <path
              d="M6 8.5L10 12.5L14 8.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-12 z-30 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-soft backdrop-blur">
            <ul>
              {options.map((option, index) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onValueChange(option.value);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm font-medium transition ${
                      option.value === value
                        ? 'bg-white/10 text-white'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.value === value ? (
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-brand-300">
                        <path
                          d="M4.5 10.5L8 14L15.5 6.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                  {index < options.length - 1 ? <div className="h-px bg-white/10" /> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-sm text-red-300">{error}</span> : null}
    </label>
  );
};
