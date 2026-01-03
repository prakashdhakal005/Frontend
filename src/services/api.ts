import axios from 'axios';
import type { AuthResponse, LoginData, RegisterData, Bug, CreateBugData, UpdateBugStatusData } from '../types';

//const API_URL = 'https://localhost:5001/api';
//const API_URL = 'http://prakash.runasp.net/api'
const API_URL='https://prakashdhakal.bsite.net/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

export const bugService = {
  getAllBugs: async (): Promise<Bug[]> => {
    const response = await api.get<Bug[]>('/bugs');
    return response.data;
  },

  getBugById: async (id: number): Promise<Bug> => {
    const response = await api.get<Bug>(`/bugs/${id}`);
    return response.data;
  },

  createBug: async (data: CreateBugData): Promise<Bug> => {
    const response = await api.post<Bug>('/bugs', data);
    return response.data;
  },

  getMyReportedBugs: async (): Promise<Bug[]> => {
    const response = await api.get<Bug[]>('/bugs/my-reported');
    return response.data;
  },

  getMyAssignedBugs: async (): Promise<Bug[]> => {
    const response = await api.get<Bug[]>('/bugs/my-assigned');
    return response.data;
  },

  getUnassignedBugs: async (): Promise<Bug[]> => {
    const response = await api.get<Bug[]>('/bugs/unassigned');
    return response.data;
  },

  searchBugs: async (searchTerm: string): Promise<Bug[]> => {
    const response = await api.get<Bug[]>('/bugs/search', {
      params: { searchTerm },
    });
    return response.data;
  },

  assignBug: async (id: number): Promise<Bug> => {
    const response = await api.post<Bug>(`/bugs/${id}/assign`);
    return response.data;
  },

  updateBugStatus: async (id: number, data: UpdateBugStatusData): Promise<Bug> => {
    const response = await api.patch<Bug>(`/bugs/${id}/status`, data);
    return response.data;
  },

  uploadAttachment: async (id: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/bugs/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAttachmentUrl: (filePath: string): string => {
    // Backend serves files from wwwroot via static files
    // filePath is like "uploads/bug-1/filename.jpg"
    return `https://localhost:5001/${filePath}`;
  },
};

export default api;
