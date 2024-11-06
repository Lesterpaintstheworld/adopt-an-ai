import axios from 'axios';
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

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gérer l'expiration du token
      localStorage.removeItem('token');
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
