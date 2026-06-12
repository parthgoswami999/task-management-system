interface AlertProps {
  message: string;
  tone?: 'error' | 'info' | 'success';
}

const toneClasses = {
  error: 'border-red-400/40 bg-red-500/10 text-red-100',
  info: 'border-sky-400/40 bg-sky-500/10 text-sky-100',
  success: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
};

export const Alert = ({ message, tone = 'error' }: AlertProps) => (
  <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone]}`}>{message}</div>
);
