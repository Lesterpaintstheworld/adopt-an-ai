import { useState, useEffect } from 'react';
import { Agent } from '../types/database';
import { AgentCreationData, AgentUpdateData } from '../types/agents';
import { mockAgents } from '../data/mockAgents';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAgents(mockAgents);
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
      // Simulate agent creation with generated ID
      const newAgent = {
        ...agentData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      setError('Failed to create agent');
      console.error('Error creating agent:', err);
      throw err;
    }
  };

  const updateAgent = async (id: string, updateData: AgentUpdateData) => {
    try {
      // Simulate agent update
      const updatedAgent = {
        ...agents.find(a => a.id === id),
        ...updateData,
        updated_at: new Date().toISOString()
      };
      setAgents(prev => prev.map(agent => 
        agent.id === id ? updatedAgent : agent
      ));
      return updatedAgent;
    } catch (err) {
      setError('Failed to update agent');
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
