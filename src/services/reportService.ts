import api from './api';
import type { Report, PaginatedResponse, ApiResponse } from '../types/index';

export const getReports = async (
  page = 1,
  limit = 10,
  type = '',
  search = ''
): Promise<PaginatedResponse<Report>> => {
  const response = await api.get<PaginatedResponse<Report>>('/reports', {
    params: { page, limit, type, search },
  });
  return response.data;
};

export const getReportById = async (id: string): Promise<Report> => {
  const response = await api.get<ApiResponse<Report>>(`/reports/${id}`);
  return response.data.data;
};

export const createReport = async (report: Omit<Report, 'id' | 'createdAt'>): Promise<Report> => {
  const response = await api.post<ApiResponse<Report>>('/reports', report);
  return response.data.data;
};

export const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/reports/${id}`);
};

// Generate reports
export const generateInventoryReport = async (
  filters: {
    categories?: string[];
    status?: string[];
    dateRange?: { start: string; end: string };
  } = {}
): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/reports/generate/inventory', filters);
  return response.data.data;
};

export const generateProcurementReport = async (
  filters: {
    suppliers?: string[];
    status?: string[];
    dateRange?: { start: string; end: string };
  } = {}
): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/reports/generate/procurement', filters);
  return response.data.data;
};

export const generateShipmentReport = async (
  filters: {
    status?: string[];
    origin?: string;
    destination?: string;
    dateRange?: { start: string; end: string };
  } = {}
): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/reports/generate/shipment', filters);
  return response.data.data;
};

export const generateCustomReport = async (
  parameters: Record<string, any>
): Promise<any> => {
  const response = await api.post<ApiResponse<any>>('/reports/generate/custom', parameters);
  return response.data.data;
};

// Export reports
export const exportReport = async (
  id: string,
  format: 'pdf' | 'csv' | 'excel'
): Promise<Blob> => {
  const response = await api.get(`/reports/${id}/export`, {
    params: { format },
    responseType: 'blob',
  });
  return response.data;
};
