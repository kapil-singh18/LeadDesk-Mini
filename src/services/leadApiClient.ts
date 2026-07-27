import api from './api.js';
import { ApiResponse, LeadsResponseData, Lead } from '../types/index.js';

export interface CreateLeadPayload {
  name: string;
  email: string;
  budget: string;
  message: string;
}

export interface GetLeadsQuery {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const leadApiClient = {
  async submitLead(payload: CreateLeadPayload): Promise<ApiResponse<Lead>> {
    const response = await api.post<ApiResponse<Lead>>('/leads', payload);
    return response.data;
  },

  async getLeads(params: GetLeadsQuery = {}): Promise<ApiResponse<LeadsResponseData>> {
    const response = await api.get<ApiResponse<LeadsResponseData>>('/leads', { params });
    return response.data;
  },

  async updateLeadStatus(id: string, status: 'New' | 'Contacted' | 'Closed'): Promise<ApiResponse<Lead>> {
    const response = await api.patch<ApiResponse<Lead>>(`/leads/${id}/status`, { status });
    return response.data;
  },
};
