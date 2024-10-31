import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import { AIEntity } from '../../../types/myais';

interface CollectiveViewProps {
  entity: AIEntity;
}

const CollectiveView: React.FC<CollectiveViewProps> = ({ entity }) => {
  // This is a placeholder for collective metrics
  // In a real implementation, these would come from the game state
  const collectiveMetrics = [
    { name: 'Collective Contribution', value: 75 },
    { name: 'Synergy Rating', value: 82 },
    { name: 'Resource Efficiency', value: 68 },
    { name: 'Innovation Impact', value: 91 }
  ];

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Collective Role
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              label={entity.evolutionStage} 
              color="primary"
            />
            <Chip 
              label={entity.currentFocus.type}
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Contributing to collective intelligence through {entity.currentFocus.type} activities
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {collectiveMetrics.map((metric) => (
          <Grid item xs={12} sm={6} key={metric.name}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {metric.name}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getMetricColor(metric.value)
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {metric.value}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Focus Impact
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Resource consumption per cycle:
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(entity.currentFocus.resourceConsumption).map(([resource, amount]) => (
              <Grid item xs={4} key={resource}>
                <Typography variant="subtitle2" gutterBottom>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {amount} units/cycle
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const getMetricColor = (value: number): string => {
  if (value >= 90) return '#4CAF50'; // Green
  if (value >= 75) return '#2196F3'; // Blue
  if (value >= 60) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export default CollectiveView;
