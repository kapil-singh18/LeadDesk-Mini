import api from './api.js';
import { ApiResponse, LoginResponseData } from '../types/index.js';

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApiClient = {
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', payload);
    if (response.data.success && response.data.data) {
      localStorage.setItem('leaddesk_admin_token', response.data.data.token);
      localStorage.setItem('leaddesk_admin_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('leaddesk_admin_token');
    localStorage.removeItem('leaddesk_admin_user');
  },

  getToken(): string | null {
    return localStorage.getItem('leaddesk_admin_token');
  },

  getUser(): { id: string; email: string } | null {
    const userStr = localStorage.getItem('leaddesk_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('leaddesk_admin_token');
  },
};
