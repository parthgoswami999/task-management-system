import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  isLoading?: boolean;
  overlay?: boolean;
}

export const Spinner = ({ isLoading = true, overlay = false }: SpinnerProps) => {
  if (!isLoading) {
    return null;
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
};
