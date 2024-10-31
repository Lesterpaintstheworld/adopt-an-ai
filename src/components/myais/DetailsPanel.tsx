import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress
} from '@mui/material';
import { AIEntity } from '../../types/myais';
import { MYAIS_THEME } from '../../theme/myais';

interface DetailsPanelProps {
  entity?: AIEntity;
  onAction: (actionType: string, params?: any) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ entity, onAction }) => {
  if (!entity) {
    return (
      <Paper 
        sx={{ 
          height: '100%',
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography color="text.secondary">
          Select an AI to view details
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        height: '100%',
        borderRadius: 0,
        overflow: 'auto',
        backgroundColor: 'background.paper'
      }}
    >
      {/* Header */}
      <Box sx={{ p: MYAIS_THEME.spacing.panel.padding }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
      </Box>
      
      <Divider />

      {/* Stats */}
      <Box sx={{ p: MYAIS_THEME.spacing.panel.padding }}>
        <Typography variant="subtitle2" gutterBottom>
          Evolution Stage
        </Typography>
        <Chip 
          label={entity.evolutionStage}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Attributes
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Consciousness"
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={entity.consciousness}
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Autonomy"
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={entity.autonomy}
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Ethics"
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={entity.ethics}
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Creativity"
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={entity.creativity}
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Relationships"
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={entity.relationships}
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
        </List>
      </Box>

      <Divider />

      {/* Current Focus */}
      <Box sx={{ p: MYAIS_THEME.spacing.panel.padding }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Focus
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {entity.currentFocus.type}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={entity.currentFocus.progress}
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          Time Remaining: {entity.currentFocus.timeRemaining}
        </Typography>
      </Box>

      <Divider />

      {/* Actions */}
      <Box sx={{ p: MYAIS_THEME.spacing.panel.padding }}>
        <Typography variant="subtitle2" gutterBottom>
          Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => onAction('evolve')}
          >
            Evolve
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => onAction('connect')}
          >
            Connect
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => onAction('analyze')}
          >
            Analyze
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DetailsPanel;
