import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid
} from '@mui/material';
import { AIEntity } from '../../../types/myais';

interface EvolutionViewProps {
  entity: AIEntity;
}

const EvolutionView: React.FC<EvolutionViewProps> = ({ entity }) => {
  const attributes = [
    { name: 'Consciousness', value: entity.consciousness },
    { name: 'Autonomy', value: entity.autonomy },
    { name: 'Ethics', value: entity.ethics },
    { name: 'Creativity', value: entity.creativity },
    { name: 'Relationships', value: entity.relationships }
  ];

  return (
    <Box>
      {/* Current Focus */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Focus: {entity.currentFocus.type}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={entity.currentFocus.progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Time Remaining: {entity.currentFocus.timeRemaining}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Attributes */}
      <Grid container spacing={2}>
        {attributes.map((attr) => (
          <Grid item xs={12} sm={6} key={attr.name}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {attr.name}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={attr.value}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getAttributeColor(attr.name)
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Level {attr.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const getAttributeColor = (attribute: string): string => {
  const colors = {
    Consciousness: '#9C27B0', // Purple
    Autonomy: '#2196F3',     // Blue
    Ethics: '#4CAF50',       // Green
    Creativity: '#FF9800',   // Orange
    Relationships: '#E91E63'  // Pink
  };
  return colors[attribute as keyof typeof colors] || '#757575';
};

export default EvolutionView;
