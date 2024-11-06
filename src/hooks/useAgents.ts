import { useState, useEffect } from 'react';
import { Agent } from '../types/database';
import { AgentCreationData, AgentUpdateData } from '../types/agents';
import { agentsApi } from '../utils/api';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string, details?: string} | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      const response = await agentsApi.getAll();
      console.log('Agents response:', response); // Debug log
      setAgents(response.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch agents';
      const errorDetails = err.response?.data?.details || err.message;
      setError({ message: errorMessage, details: errorDetails });
      console.error('Error fetching agents:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack // Add stack trace
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: AgentCreationData) => {
    try {
      const response = await agentsApi.create(agentData);
      const newAgent = response.data;
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err: any) {
      console.error('Error creating agent:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      throw new Error(err.response?.data?.error || 'Failed to create agent', { 
        cause: err 
      });
    }
  };

  const updateAgent = async (id: string, updateData: AgentUpdateData) => {
    try {
      const response = await agentsApi.update(id, updateData);
      const updatedAgent = response.data;
      setAgents(prev => prev.map(agent => 
        agent.id === id ? updatedAgent : agent
      ));
      return updatedAgent;
    } catch (err: any) {
      console.error('Error updating agent:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      throw new Error(err.response?.data?.error || 'Failed to update agent', {
        cause: err
      });
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
    updateAgent,
    refreshAgents: fetchAgents
  };
};
