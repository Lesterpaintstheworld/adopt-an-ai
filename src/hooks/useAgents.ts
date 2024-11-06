import { useState, useEffect } from 'react';
import { Agent } from '../types/database';
import { AgentCreationData, AgentUpdateData } from '../types/agents';
import { agentsApi } from '../utils/api';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await agentsApi.getAll();
      setAgents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error('Error fetching agents:', err);
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
    } catch (err) {
      console.error('Error creating agent:', err);
      throw err;
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
    } catch (err) {
      console.error('Error updating agent:', err);
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
    updateAgent,
    refreshAgents: fetchAgents
  };
};
