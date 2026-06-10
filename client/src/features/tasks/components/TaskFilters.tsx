import type { ChangeEvent } from 'react';
import type { TaskFilters as TaskFiltersType } from '@/shared/types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters = ({ filters, onChange }: TaskFiltersProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: event.target.value });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-soft">
      <input
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search tasks by title or description"
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-brand-400"
      />
    </div>
  );
};
