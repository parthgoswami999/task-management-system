import { TaskCard } from '@/features/tasks/components/TaskCard';
import type { Task } from '@/shared/types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskColumn = ({ title, tasks, onEdit, onDelete }: TaskColumnProps) => {
  return (
    <section className="flex min-h-[28rem] flex-col rounded-[2rem] border border-white/10 bg-slate-900/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{tasks.length}</span>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-400">
            No tasks in this column yet.
          </div>
        ) : null}
      </div>
    </section>
  );
};
