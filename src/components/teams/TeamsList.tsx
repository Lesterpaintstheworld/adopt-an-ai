import { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTeams } from '../../hooks/useTeams';
import TeamDialog from './TeamDialog';
import type { Team } from '../../types/teams';

export default function TeamsList() {
  const { teams, loading, error, deleteTeam } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={team.name}
              secondary={
                <>
                  {team.description}
                  <br />
                  Members: {team.member_count} • Role: {team.user_role}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEdit(team)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              {team.user_role === 'owner' && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(team)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <TeamDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        team={selectedTeam}
      />
    </Box>
  );
}
