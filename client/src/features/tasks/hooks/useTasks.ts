import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTasks, setFilters } from '@/features/tasks/store/taskSlice';
import type { TaskFilters } from '@/shared/types';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  useEffect(() => {
    void dispatch(fetchTasks(tasks.filters));
  }, [dispatch, tasks.filters]);

  return {
    ...tasks,
    updateFilters: (filters: TaskFilters) => dispatch(setFilters(filters)),
    refreshTasks: () => dispatch(fetchTasks(tasks.filters))
  };
};
