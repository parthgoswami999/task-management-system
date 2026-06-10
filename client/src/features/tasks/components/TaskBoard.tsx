import { TaskCard } from '@/features/tasks/components/TaskCard';
import type { Task } from '@/shared/types';

interface TaskBoardProps {
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskBoard = ({ title, tasks, onEditTask, onDeleteTask }: TaskBoardProps) => (
  <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5 shadow-soft">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-brand-300">Task List</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
      </div>
      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">{tasks.length} tasks</span>
    </div>
    {tasks.length ? (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    ) : (
      <div className="rounded-3xl border border-dashed border-white/10 px-4 py-12 text-center text-sm text-slate-400">
        No tasks found in this tab.
      </div>
    )}
  </section>
);
