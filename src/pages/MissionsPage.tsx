import React, { useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

// Types for missions
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type Status = 'available' | 'in_progress' | 'locked' | 'completed';

interface Filters {
  category: string | null;
  difficulty: Difficulty | 'all';
  status: Status | 'all';
}

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

// Mock missions data
const mockMissions: Mission[] = [
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
  {
    id: '2',
    title: 'Creative Writing Exercise',
    description: 'Generate creative stories based on prompts',
    difficulty: 'Intermediate',
    category: 'Creativity',
    duration: '2h',
    requirements: ['Basic AI Core', 'Language Module'],
    rewards: { xp: 200, capabilities: ['Creative Writing'] },
    status: 'locked',
  },
  {
    id: '3',
    title: 'Logic Puzzle Challenge',
    description: 'Solve complex logical puzzles and explain reasoning',
    difficulty: 'Advanced',
    category: 'Problem Solving',
    duration: '4h',
    requirements: ['Logic Module'],
    rewards: { xp: 300 },
    status: 'available',
  },
  {
    id: '4',
    title: 'Data Analysis Project',
    description: 'Analyze datasets and generate insights',
    difficulty: 'Expert',
    category: 'Research',
    duration: '8h',
    requirements: ['Analysis Module', 'Advanced AI Core'],
    rewards: { xp: 500, capabilities: ['Data Analysis'] },
    status: 'locked',
  },
  {
    id: '5',
    title: 'Advanced Communication Patterns',
    description: 'Master complex dialogue flows and context switching',
    difficulty: 'Advanced',
    category: 'Communication',
    duration: '6h',
    requirements: ['Advanced Language Module'],
    rewards: { xp: 400, capabilities: ['Context Mastery'] },
    status: 'in_progress',
  },
  {
    id: '6',
    title: 'Research Methodology',
    description: 'Learn systematic approaches to gathering and analyzing information',
    difficulty: 'Intermediate',
    category: 'Research',
    duration: '3h',
    requirements: ['Basic Research Module'],
    rewards: { xp: 250, capabilities: ['Research Methods'] },
    status: 'completed',
  }
];

const MissionsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    category: null,
    difficulty: 'all',
    status: 'all'
  });
  const [missions, setMissions] = useState<Mission[]>(mockMissions);

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

      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={selectedCategory}
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
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={mission.status === 'locked'}
                  fullWidth
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
      )}
    </Container>
  );
};

export default MissionsPage;
