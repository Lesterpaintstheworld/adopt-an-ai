import { useState, useEffect } from 'react';
import { Team, TeamCreationData, TeamUpdateData } from '../types/teams';
import { teamsApi } from '../utils/teamsApi';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string, details?: string} | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsApi.getAll();
      setTeams(response.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch teams';
      const errorDetails = err.response?.data?.details || err.message;
      setError({ message: errorMessage, details: errorDetails });
      console.error('Error fetching teams:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: TeamCreationData) => {
    try {
      const response = await teamsApi.create(teamData);
      const newTeam = response.data;
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err: any) {
      console.error('Error creating team:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      throw new Error(err.response?.data?.error || 'Failed to create team');
    }
  };

  const updateTeam = async (id: string, updateData: TeamUpdateData) => {
    try {
      const response = await teamsApi.update(id, updateData);
      const updatedTeam = response.data;
      setTeams(prev => prev.map(team => 
        team.id === id ? updatedTeam : team
      ));
      return updatedTeam;
    } catch (err: any) {
      console.error('Error updating team:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      throw new Error(err.response?.data?.error || 'Failed to update team');
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      await teamsApi.delete(id);
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (err: any) {
      console.error('Error deleting team:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      throw new Error(err.response?.data?.error || 'Failed to delete team');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refreshTeams: fetchTeams
  };
};
