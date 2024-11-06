import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useTeams } from '../../hooks/useTeams';
import type { Team } from '../../types/teams';

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

export default function TeamDialog({ open, onClose, team }: TeamDialogProps) {
  const { createTeam, updateTeam } = useTeams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDescription(team.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [team, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (team) {
        await updateTeam(team.id, { name, description });
      } else {
        await createTeam({ name, description });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {team ? 'Edit Team' : 'Create Team'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {team ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
