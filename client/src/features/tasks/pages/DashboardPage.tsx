import { useMemo, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { TaskBoard } from '@/features/tasks/components/TaskBoard';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { TaskFormModal } from '@/features/tasks/components/TaskFormModal';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { createTask, deleteTask, updateTask } from '@/features/tasks/store/taskSlice';
import { AppShell } from '@/shared/layout';
import type { Task, TaskFormValues, TaskStatus } from '@/shared/types';
import { Alert, Button, Spinner } from '@/shared/ui';

const taskTabs: Array<{ key: TaskStatus; label: string; helper: string }> = [
  { key: 0, label: 'Pending', helper: 'Tasks waiting to be started' },
  { key: 1, label: 'In Progress', helper: 'Tasks currently being worked on' },
  { key: 2, label: 'Completed', helper: 'Tasks that are already finished' }
];

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { items, filters, loading, saving, error, updateFilters, refreshTasks } = useTasks();
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const activeTab = taskTabs.find((tab) => tab.key === filters.status) || taskTabs[0];
  const tasks = useMemo(() => items, [items]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveTask(null);
  };

  const handleSubmit = async (values: TaskFormValues) => {
    const result = activeTask
      ? await dispatch(updateTask({ taskId: activeTask._id, values }))
      : await dispatch(createTask(values));

    if (result.meta.requestStatus !== 'fulfilled') {
      return;
    }

    await refreshTasks();
    handleCloseModal();
  };

  const handleDelete = async (taskId: string) => {
    const result = await dispatch(deleteTask(taskId));

    if (result.meta.requestStatus !== 'fulfilled') {
      return;
    }

    await refreshTasks();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="grid gap-5 rounded-[2rem] border border-white/10 bg-slate-900/50 p-6 shadow-soft lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Delivery cockpit</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Keep every task moving with a clear, focused task flow.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Switch between tabs to load tasks by status from the API, search within the current tab, and manage work without the board layout.
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-3xl font-semibold text-white">{items.filter((task) => task.status === 0).length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Pending</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-3xl font-semibold text-white">
                  {items.filter((task) => task.status === 1).length}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">In Progress</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-3xl font-semibold text-white">{items.filter((task) => task.status === 2).length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Completed</p>
              </div>
            </div>
            <Button
              className="mt-5"
              onClick={() => {
                setActiveTask(null);
                setModalOpen(true);
              }}
            >
              Create task
            </Button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-3 shadow-soft">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid gap-2 sm:grid-cols-3 xl:w-auto">
              {taskTabs.map((tab) => {
                const isActive = filters.status === tab.key;
                const count = items.filter((task) => task.status === tab.key).length;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => updateFilters({ ...filters, status: tab.key })}
                    className={`min-w-[140px] rounded-[1rem] border px-3 py-2.5 text-left transition ${
                      isActive
                        ? 'border-brand-400 bg-brand-500/15 text-white'
                        : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{tab.label}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isActive ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <p className={`mt-0.5 text-[10px] leading-4 ${isActive ? 'text-brand-100' : 'text-slate-500'}`}>
                      {tab.helper}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="xl:w-[340px]">
              <TaskFilters filters={filters} onChange={updateFilters} />
            </div>
          </div>
        </section>

        {error ? <Alert message={error} /> : null}

        {loading ? (
          <Spinner />
        ) : (
          <TaskBoard
            title={activeTab.label}
            tasks={tasks}
            onEditTask={(task) => {
              setActiveTask(task);
              setModalOpen(true);
            }}
            onDeleteTask={handleDelete}
          />
        )}
      </div>

      <TaskFormModal
        open={isModalOpen}
        task={activeTask}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};
