import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { authService } from '@/features/auth/services/authService';
import { storage } from '@/shared/lib/storage';
import type { User } from '@/shared/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  user: storage.getUser(),
  token: storage.getToken(),
  loading: false,
  initializing: Boolean(storage.getToken()),
  error: null,
  successMessage: null
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

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.login(payload.email, payload.password);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to log in'));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await authService.register(payload);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to create account'));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authService.me();
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load user'));
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: { name: string; email: string }, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(payload);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to update profile'));
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      return await authService.changePassword(payload);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Unable to change password'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      state.initializing = false;
      storage.clearSession();
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthSuccess(state) {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        state.initializing = false;
        state.successMessage = null;
        storage.setToken(action.payload.data.token);
        storage.setUser(action.payload.data.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        state.initializing = false;
        state.successMessage = null;
        storage.setToken(action.payload.data.token);
        storage.setUser(action.payload.data.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload.data;
        storage.setUser(action.payload.data);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false;
        state.user = null;
        state.token = null;
        storage.clearToken();
        storage.clearUser();
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.successMessage = action.payload.message || 'Profile updated successfully';
        storage.setUser(action.payload.data);
        storage.setAuthEmail(action.payload.data.email);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearAuthError, clearAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
