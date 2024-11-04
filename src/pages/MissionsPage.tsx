import React, { useState } from 'react';
import { Mission, Difficulty, Status } from '../types/missions';
import { mockMissions } from '../data/mockMissions';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Chip, 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions, 
  Button,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface Filters {
  category: string | null;
  difficulty: Difficulty | 'all';
  status: Status | 'all';
}


// Category configuration
const categories = [
  { id: 'Communication', icon: '💬', color: '#3498db' },
  { id: 'Creativity', icon: '🎨', color: '#e74c3c' },
  { id: 'Problem Solving', icon: '🧩', color: '#2ecc71' },
  { id: 'Research', icon: '🔬', color: '#9b59b6' },
] as const;

// Difficulty color mapping
const difficultyColors = {
  Beginner: '#2ecc71',
  Intermediate: '#f1c40f',
  Advanced: '#e67e22',
  Expert: '#e74c3c',
};


const MissionsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    category: null,
    difficulty: 'all',
    status: 'all'
  });
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [userResources, setUserResources] = useState({
    xp: 0,
    capabilities: [] as string[],
    compute: 75, // percent
    memory: 50, // percent
    activeMissionLimit: 3
  });

  const filterMissions = (filters: Filters) => {
    let filteredMissions = [...mockMissions];

    if (filters.category) {
      filteredMissions = filteredMissions.filter(
        mission => mission.category === filters.category
      );
    }

    if (filters.difficulty !== 'all') {
      filteredMissions = filteredMissions.filter(
        mission => mission.difficulty === filters.difficulty
      );
    }

    if (filters.status !== 'all') {
      filteredMissions = filteredMissions.filter(
        mission => mission.status === filters.status
      );
    }

    setMissions(filteredMissions);
  };

  const handleCategoryChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: string | null,
  ) => {
    const newFilters = {
      ...filters,
      category: newCategory
    };
    setFilters(newFilters);
    filterMissions(newFilters);
  };

  const handleDifficultyChange = (event: SelectChangeEvent<Difficulty | 'all'>) => {
    const newFilters = {
      ...filters,
      difficulty: event.target.value as Difficulty | 'all'
    };
    setFilters(newFilters);
    filterMissions(newFilters);
  };

  const handleStatusChange = (event: SelectChangeEvent<Status | 'all'>) => {
    const newFilters = {
      ...filters,
      status: event.target.value as Status | 'all'
    };
    setFilters(newFilters);
    filterMissions(newFilters);
  };

  const handleMissionAction = (mission: Mission) => {
    if (mission.status === 'locked') {
      return;
    }

    if (mission.status === 'available') {
      if (activeMissions.length >= userResources.activeMissionLimit) {
        return;
      }

      const updatedMissions: Mission[] = missions.map(m => 
        m.id === mission.id ? { ...m, status: 'in_progress' as const } : m
      );
      setMissions(updatedMissions);
      setActiveMissions([...activeMissions, mission]);
    }
    else if (mission.status === 'in_progress') {
      const updatedMissions: Mission[] = missions.map(m => 
        m.id === mission.id ? { ...m, status: 'completed' as const } : m
      );
      setMissions(updatedMissions);
      setActiveMissions(activeMissions.filter(m => m.id !== mission.id));
      
      setUserResources(prev => ({
        ...prev,
        xp: prev.xp + (mission.rewards.xp || 0),
        capabilities: [
          ...prev.capabilities,
          ...(mission.rewards.capabilities || [])
        ]
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Missions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label={`Active Missions: ${activeMissions.length}/${userResources.activeMissionLimit}`}
            color={activeMissions.length >= userResources.activeMissionLimit ? "warning" : "default"}
          />
          <Chip 
            label={`XP: ${userResources.xp}`}
            color="primary"
          />
          <Chip 
            label={`Compute: ${userResources.compute}%`}
            color={userResources.compute < 20 ? "error" : "default"}
          />
          <Chip 
            label={`Memory: ${userResources.memory}%`}
            color={userResources.memory < 20 ? "error" : "default"}
          />
        </Box>
        {userResources.capabilities.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {userResources.capabilities.map((capability, index) => (
              <Chip
                key={index}
                label={capability}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={filters.category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="mission categories"
          sx={{ mb: 3 }}
        >
          {categories.map((category) => (
            <ToggleButton 
              key={category.id} 
              value={category.id}
              sx={{ 
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: `${category.color}20`,
                  '&:hover': {
                    backgroundColor: `${category.color}30`,
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{category.icon}</span>
                <span>{category.id}</span>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={filters.difficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={handleStatusChange}
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="locked">Locked</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Active Missions
          </Typography>
          <Grid container spacing={2}>
            {activeMissions.map((mission) => (
              <Grid item xs={12} sm={6} md={4} key={mission.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      {mission.title}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.random() * 100}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleMissionAction(mission)}
                      fullWidth
                    >
                      Complete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Missions Grid */}
      {missions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No missions match the selected filters
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
        {missions.map((mission) => (
          <Grid item xs={12} sm={6} md={4} key={mission.id}>
            <Card>
              <CardHeader
                title={mission.title}
                subheader={
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={mission.difficulty}
                      size="small"
                      sx={{
                        bgcolor: difficultyColors[mission.difficulty],
                        color: 'white',
                      }}
                    />
                    <Chip
                      label={mission.duration}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {mission.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block">
                    Requirements: {mission.requirements.join(', ')}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Rewards: {mission.rewards.xp} XP
                    {mission.rewards.capabilities && 
                      `, ${mission.rewards.capabilities.join(', ')}`}
                  </Typography>
                  {mission.mainPrerequisite && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      mt: 1
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        Required Perk:
                      </Typography>
                      <Box
                        component="img"
                        src={getPerkIconUrl({ capability_id: mission.mainPrerequisite })}
                        alt="Required Perk"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '4px',
                          objectFit: 'cover',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          opacity: mission.status === 'locked' ? 0.5 : 1,
                          filter: mission.status === 'locked' ? 'grayscale(100%)' : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color={mission.status === 'in_progress' ? 'secondary' : 'primary'}
                  disabled={
                    mission.status === 'locked' ||
                    (mission.status === 'available' && 
                     activeMissions.length >= userResources.activeMissionLimit)
                  }
                  onClick={() => handleMissionAction(mission)}
                  fullWidth
                >
                  {mission.status === 'in_progress'
                    ? 'Complete'
                    : mission.status === 'locked'
                    ? 'Locked'
                    : mission.status === 'completed'
                    ? 'Completed'
                    : activeMissions.length >= userResources.activeMissionLimit
                    ? 'Mission Limit Reached'
                    : 'Start'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}
    </Container>
  );
};

export default MissionsPage;
