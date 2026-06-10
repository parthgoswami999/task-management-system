import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { taskService } from '@/features/tasks/services/taskService';
import type { Task, TaskFilters, TaskFormValues, TaskStatus } from '@/shared/types';

interface TasksState {
  items: Task[];
  filters: TaskFilters;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  filters: {
    status: 0,
    search: ''
  },
  loading: false,
  saving: false,
  error: null
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
    }

    if (!error.response) {
      return 'Unable to reach the server. Please check that the backend is running.';
    }

    return error.response.data?.message || fallback;
  }

  return fallback;
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (filters: TaskFilters, { rejectWithValue }) => {
    try {
      return await taskService.list(filters);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load tasks'));
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (payload: TaskFormValues, { rejectWithValue }) => {
    try {
      return await taskService.create(payload);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to create task'));
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (payload: { taskId: string; values: TaskFormValues }, { rejectWithValue }) => {
    try {
      return await taskService.update(payload.taskId, payload.values);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to update task'));
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId: string, { rejectWithValue }) => {
  try {
    return await taskService.remove(taskId);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete task'));
  }
});

export const moveTask = createAsyncThunk(
  'tasks/move',
  async (payload: { taskId: string; status: TaskStatus; position: number }, { rejectWithValue }) => {
    try {
      return await taskService.move(payload.taskId, payload.status, payload.position);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to move task'));
    }
  }
);

const upsertTask = (items: Task[], incoming: Task) => {
  const index = items.findIndex((item) => item._id === incoming._id);

  if (index === -1) {
    items.push(incoming);
  } else {
    items[index] = incoming;
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters(state, action: { payload: TaskFilters }) {
      state.filters = action.payload;
    },
    clearTaskError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.saving = false;
        state.items.push(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.saving = false;
        upsertTask(state.items, action.payload.data);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((item) => item._id !== action.payload.data.id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        upsertTask(state.items, action.payload.data);
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { setFilters, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
