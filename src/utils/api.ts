import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { AgentCreationData, AgentUpdateData } from '../types/agents';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration
console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Request interceptor to add auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request headers:', config.headers);
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Only redirect if:
    // 1. It's a 401 error
    // 2. We have a token (meaning our token is invalid/expired)
    // 3. We're not already on the login page
    if (error.response?.status === 401 && 
        localStorage.getItem('token') && 
        !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Agent API endpoints
export const agentsApi = {
  getAll: () => api.get('/api/agents'),
  getById: (id: string) => api.get(`/api/agents/${id}`),
  create: (data: AgentCreationData) => api.post('/api/agents', data),
  update: (id: string, data: AgentUpdateData) => api.put(`/api/agents/${id}`, data),
  delete: (id: string) => api.delete(`/api/agents/${id}`)
};
