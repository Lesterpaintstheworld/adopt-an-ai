import { useState, useEffect } from 'react';
import { Agent } from '../types/database';
import { api } from '../utils/api';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agents');
      setAgents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Partial<Agent>) => {
    try {
      const response = await api.post('/agents', agentData);
      setAgents(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create agent');
      console.error('Error creating agent:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    createAgent,
    refreshAgents: fetchAgents
  };
};
