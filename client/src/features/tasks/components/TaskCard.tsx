import type { Task } from '@/shared/types';
import { Button } from '@/shared/ui';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityClasses = {
  low: 'bg-emerald-500/10 text-emerald-200',
  medium: 'bg-amber-500/10 text-amber-100',
  high: 'bg-red-500/10 text-red-100'
};

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-soft transition hover:border-brand-400/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{task.description || 'No description added.'}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${priorityClasses[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{task.userID?.name}</span>
        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1" onClick={() => onDelete(task._id)}>
          Delete
        </Button>
      </div>
    </article>
  );
};
