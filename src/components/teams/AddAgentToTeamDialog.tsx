import { useState, useEffect } from 'react';
import { teamsApi } from '../../utils/teamsApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Agent } from '../../types/database';
import { agentsApi } from '../../utils/api';
import { teamsApi } from '../../utils/teamsApi';

interface AddAgentToTeamDialogProps {
  open: boolean;
  teamId: string;
  onClose: () => void;
  onAgentAdded: () => void;
}

export default function AddAgentToTeamDialog({ 
  open, 
  teamId, 
  onClose, 
  onAgentAdded 
}: AddAgentToTeamDialogProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadAgents();
    }
  }, [open]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentsApi.getAll();
      setAgents(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (agentId: string) => {
    try {
      await teamsApi.addAgent(teamId, agentId);
      onAgentAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add agent to team');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Agent to Team</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {agent.system_prompt.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleAddAgent(agent.id)}
                    >
                      Add to Team
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
