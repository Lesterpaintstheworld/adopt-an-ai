import { api } from './api';
import type { Team, TeamCreationData, TeamUpdateData } from '../types/teams';

export const teamsApi = {
  getAll: () => api.get<Team[]>('/api/teams'),
  getById: (id: string) => api.get<Team>(`/api/teams/${id}`),
  create: (data: TeamCreationData) => api.post<Team>('/api/teams', data),
  update: (id: string, data: TeamUpdateData) => api.put<Team>(`/api/teams/${id}`, data),
  delete: (id: string) => api.delete(`/api/teams/${id}`),
  addAgent: (teamId: string, agentId: string) => api.post(`/api/teams/${teamId}/agents`, { agentId }),
  getMembers: (teamId: string) => api.get(`/api/teams/${teamId}/members`)
};
