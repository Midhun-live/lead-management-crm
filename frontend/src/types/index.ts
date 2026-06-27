export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  tokenVersion: number;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';
export type LeadSource = 'WEBSITE' | 'LINKEDIN' | 'REFERRAL' | 'EMAIL' | 'PHONE' | 'OTHER';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardData {
  totalLeads: number;
  statusCounts: Record<LeadStatus, number>;
}
