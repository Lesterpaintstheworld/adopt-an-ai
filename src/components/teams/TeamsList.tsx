import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Collapse
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useTeams } from '../../hooks/useTeams';
import TeamDialog from './TeamDialog';
import AddAgentToTeamDialog from './AddAgentToTeamDialog';
import type { Team } from '../../types/teams';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: 'owner' | 'admin' | 'member';
}

export default function TeamsList() {
  const { teams, loading, error, deleteTeam, refreshTeams } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false);
  const [selectedTeamForAgent, setSelectedTeamForAgent] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});

  useEffect(() => {
    teams.forEach(team => {
      loadTeamMembers(team.id);
    });
  }, [teams]);

  const loadTeamMembers = async (teamId: string) => {
    try {
      const response = await teamsApi.getMembers(teamId);
      setTeamMembers(prev => ({
        ...prev,
        [teamId]: response.data
      }));
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const handleDelete = async (team: Team) => {
    if (window.confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      try {
        await deleteTeam(team.id);
      } catch (error) {
        console.error('Failed to delete team:', error);
        alert('Failed to delete team. Please try again.');
      }
    }
  };

  const handleAddAgentClick = (teamId: string) => {
    setSelectedTeamForAgent(teamId);
    setIsAddAgentDialogOpen(true);
  };

  const handleAgentAdded = async (teamId: string) => {
    try {
      // Recharger les membres de l'équipe spécifique
      const response = await teamsApi.getMembers(teamId);
      setTeamMembers(prev => ({
        ...prev,
        [teamId]: response.data
      }));
    } catch (error) {
      console.error('Failed to refresh team members:', error);
    }
  };

  const handleCreate = () => {
    setSelectedTeam(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
        {error.details && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error.details}
          </Typography>
        )}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Teams</Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create Team
        </Button>
      </Box>

      <List>
        {teams.map((team) => (
          <ListItem
            key={team.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ListItemText
                primary={team.name}
                secondary={
                  <>
                    {team.description}
                    <br />
                    <AvatarGroup 
                      max={3} 
                      sx={{ 
                        display: 'inline-flex',
                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.875rem' }
                      }}
                    >
                      {teamMembers[team.id]?.map(member => (
                        <Avatar 
                          key={member.id}
                          src={member.picture}
                          alt={member.name}
                          sx={{ width: 24, height: 24 }}
                        />
                      ))}
                    </AvatarGroup>
                    {' • '}Role: {team.user_role}
                  </>
                }
              />
              <IconButton
                edge="end"
                aria-label="add-agent"
                onClick={() => handleAddAgentClick(team.id)}
                sx={{ ml: 1 }}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEdit(team)}
                sx={{ ml: 1 }}
              >
                <EditIcon />
              </IconButton>
              {team.user_role === 'owner' && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(team)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Members
                </Typography>
                <List dense>
                  {teamMembers[team.id]?.map(member => (
                    <ListItem key={member.id}>
                      <Avatar 
                        src={member.picture} 
                        alt={member.name}
                        sx={{ width: 32, height: 32, mr: 2 }}
                      />
                      <ListItemText 
                        primary={member.name}
                        secondary={`${member.role} • ${member.email}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
          </ListItem>
        ))}
      </List>

      <TeamDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        team={selectedTeam}
      />
      
      {selectedTeamForAgent && (
        <AddAgentToTeamDialog
          open={isAddAgentDialogOpen}
          teamId={selectedTeamForAgent}
          onClose={() => {
            setIsAddAgentDialogOpen(false);
            setSelectedTeamForAgent(null);
          }}
          onAgentAdded={() => {
            handleAgentAdded(selectedTeamForAgent);
            refreshTeams();
          }}
        />
      )}
    </Box>
  );
}
