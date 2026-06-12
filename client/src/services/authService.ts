import { api } from '@/api/client';
import type { ApiResponse, AuthResponse, ChangePasswordPayload, User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return response.data;
  },
  async register(payload: { name: string; email: string; password: string }) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return response.data;
  },
  async me() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
  async updateProfile(payload: { name: string; email: string }) {
    const response = await api.patch<ApiResponse<User>>('/auth/profile', payload);
    return response.data;
  },
  async changePassword(payload: ChangePasswordPayload) {
    const response = await api.patch<ApiResponse<{ success: boolean }>>('/auth/change-password', payload);
    return response.data;
  }
};
