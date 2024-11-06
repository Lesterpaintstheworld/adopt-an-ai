
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid
} from '@mui/material';
import { AI } from '../types/ai';

interface AIDetailsDialogProps {
  ai: AI | null;
  open: boolean;
  onClose: () => void;
}

const AIDetailsDialog: React.FC<AIDetailsDialogProps> = ({ ai, open, onClose }) => {
  if (!ai) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <img 
            src={ai.imageUrl} 
            alt={ai.name} 
            style={{ width: 60, height: 60, borderRadius: '50%' }}
          />
          <Typography variant="h5">{ai.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography>{ai.longDescription || ai.description}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>Characteristics</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Capability Level:</Typography>
                <Chip label={ai.capabilityLevel} size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Personality Type:</Typography>
                <Chip label={ai.personalityType} size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Resource Requirements:</Typography>
                <Chip label={ai.resourceRequirements} size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Specialization:</Typography>
                <Chip label={ai.specialization} size="small" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIDetailsDialog;
