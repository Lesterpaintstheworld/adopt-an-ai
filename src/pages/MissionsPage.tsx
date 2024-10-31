import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Chip, Card, CardContent, CardHeader, CardActions, Button } from '@mui/material';

// Types for missions
interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Communication' | 'Creativity' | 'Problem Solving' | 'Research';
  duration: string;
  requirements: string[];
  rewards: {
    xp?: number;
    capabilities?: string[];
    resources?: string[];
  };
  status: 'available' | 'in_progress' | 'locked' | 'completed';
}

// Difficulty color mapping
const difficultyColors = {
  Beginner: '#2ecc71',
  Intermediate: '#f1c40f', 
  Advanced: '#e67e22',
  Expert: '#e74c3c',
};

const MissionsPage: React.FC = () => {
  // Mock data - in real implementation, this would come from an API
  const [missions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Basic Communication Training',
      description: 'Learn to handle basic conversation patterns and responses',
      difficulty: 'Beginner',
      category: 'Communication',
      duration: '< 1h',
      requirements: ['Basic AI Core'],
      rewards: { xp: 100 },
      status: 'available',
    },
    // Add more mock missions as needed
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Missions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip label="Active Missions: 0/3" />
          <Chip label="AI Level: 1" />
          <Chip label="Compute: 75%" />
          <Chip label="Memory: 50%" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {missions.map((mission) => (
          <Grid item xs={12} sm={6} md={4} key={mission.id}>
            <Card>
              <CardHeader
                title={mission.title}
                subheader={
                  <Chip
                    label={mission.difficulty}
                    size="small"
                    sx={{
                      bgcolor: difficultyColors[mission.difficulty],
                      color: 'white',
                    }}
                  />
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {mission.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block">
                    Duration: {mission.duration}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Requirements: {mission.requirements.join(', ')}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={mission.status === 'locked'}
                >
                  {mission.status === 'in_progress'
                    ? 'Continue'
                    : mission.status === 'locked'
                    ? 'Locked'
                    : 'Start'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MissionsPage;
