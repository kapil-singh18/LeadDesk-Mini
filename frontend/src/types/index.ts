export type LeadStatus = 'New' | 'Contacted' | 'Closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponseData {
  leads: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    all: number;
    new: number;
    contacted: number;
    closed: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | { message?: string; fields?: Record<string, string> };
}

export interface AdminUser {
  id: string;
  email: string;
}

export interface LoginResponseData {
  user: AdminUser;
  token: string;
}
