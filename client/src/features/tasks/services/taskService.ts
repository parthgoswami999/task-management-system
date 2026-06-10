import { api } from '@/shared/api/client';
import type { ApiResponse, Task, TaskFilters, TaskFormValues, TaskStatus } from '@/shared/types';

export const taskService = {
  async list(filters: TaskFilters) {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params: filters });
    return response.data;
  },
  async create(payload: TaskFormValues) {
    const response = await api.post<ApiResponse<Task>>('/tasks', {
      ...payload,
      status: Number(payload.status),
      dueDate: payload.dueDate || null
    });
    return response.data;
  },
  async update(taskId: string, payload: TaskFormValues) {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, {
      ...payload,
      status: Number(payload.status),
      dueDate: payload.dueDate || null
    });
    return response.data;
  },
  async remove(taskId: string) {
    const response = await api.delete<ApiResponse<{ id: string }>>(`/tasks/${taskId}`);
    return response.data;
  },
  async move(taskId: string, status: TaskStatus, position: number) {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/reorder`, {
      status,
      position
    });
    return response.data;
  }
};
