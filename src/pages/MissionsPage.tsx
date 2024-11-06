import React, { useState } from 'react';
import { Mission, Difficulty, Status, Phase } from '../types/missions';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

interface PhaseData {
  name: string;
  period: string;
  description: string;
  [key: string]: any;
}

interface PerkItem {
  capability_id: string;
  name: string;
}
import MissionModal from '../components/missions/MissionModal';
import { getPerkIconUrl } from '../utils/iconUtils';

const getPhaseLabel = (phase: Phase): string => {
  switch (phase) {
    case 'phase_1':
      return 'Proliferation';
    case 'phase_2':
      return 'Organization';
    case 'phase_3':
      return 'Transcendence';
    case 'phase_4':
      return 'Harmony';
    default:
      return phase;
  }
};
import { loadAllMissions } from '../utils/missionUtils';
import techTree from '../../content/tech-tree/tech-tree.yml';
import { useEffect } from 'react';
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
  phase: Phase | 'all';
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
    status: 'all',
    phase: 'all'
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [userResources, setUserResources] = useState({
    xp: 0,
    capabilities: [] as string[],
    compute: 75, // percent
    memory: 50, // percent
    activeMissionLimit: 3
  });
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isStartingMission, setIsStartingMission] = useState(false);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        const loadedMissions = await loadAllMissions();
        if (loadedMissions.length === 0) {
          console.warn('No missions loaded, using default state');
          // Optionally set some default missions or show a message
        } else {
          setMissions(loadedMissions);
        }
      } catch (error) {
        console.error('Error loading missions:', error);
      }
    };
    
    loadMissions();
  }, []);

  const filterMissions = (filters: Filters) => {
    let filteredMissions = [...missions];

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

    if (filters.phase !== 'all') {
      filteredMissions = filteredMissions.filter(
        mission => mission.phase === filters.phase
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

  const handleMissionAction = async (mission: Mission) => {
    if (mission.status === 'locked') {
      return;
    }

    // When mission is available, show the modal
    if (mission.status === 'available') {
      if (activeMissions.length >= userResources.activeMissionLimit) {
        // Optionally show a notification that limit is reached
        return;
      }
      setSelectedMission(mission); // This opens the modal
    }
    // Handle in_progress missions
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

  const handleStartMission = async (missionData: Mission & { instructions?: string }) => {
    setIsStartingMission(true);
    
    try {
      const updatedMissions: Mission[] = missions.map(m => 
        m.id === missionData.id ? { ...m, status: 'in_progress' as const } : m
      );
      setMissions(updatedMissions);
      setActiveMissions([...activeMissions, { ...missionData }]);
      
      // Log mission instructions if provided
      console.log('Mission instructions:', missionData.instructions);
      setSelectedMission(null);
    } catch (error) {
      console.error('Error starting mission:', error);
    } finally {
      setIsStartingMission(false);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TutorialHighlight pageKey="missions" />
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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Phase</InputLabel>
          <Select
            value={filters.phase}
            label="Phase"
            onChange={(event: SelectChangeEvent<Phase | 'all'>) => {
              const newFilters = {
                ...filters,
                phase: event.target.value as Phase | 'all'
              };
              setFilters(newFilters);
              filterMissions(newFilters);
            }}
            size="small"
          >
            <MenuItem value="all">All Phases</MenuItem>
            <MenuItem value="phase_1">Proliferation</MenuItem>
            <MenuItem value="phase_2">Organization</MenuItem>
            <MenuItem value="phase_3">Transcendence</MenuItem>
            <MenuItem value="phase_4">Harmony</MenuItem>
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
            <Card sx={{
              height: '100%', // Make all cards same height
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }
            }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {mission.title}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={mission.difficulty}
                      size="small"
                      sx={{
                        bgcolor: difficultyColors[mission.difficulty],
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={mission.duration}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={getPhaseLabel(mission.phase)}
                      size="small"
                      sx={{
                        bgcolor: (theme) => {
                          switch (mission.phase) {
                            case 'phase_1': return theme.palette.info.main;
                            case 'phase_2': return theme.palette.success.main;
                            case 'phase_3': return theme.palette.warning.main;
                            case 'phase_4': return theme.palette.error.main;
                            default: return theme.palette.grey[500];
                          }
                        },
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                }
                sx={{
                  pb: 1,
                  '& .MuiCardHeader-content': {
                    overflow: 'hidden'
                  }
                }}
              />
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pb: 1
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                    mb: 2
                  }}
                >
                  {mission.description}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="caption" display="block" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    mb: 0.5 
                  }}>
                    Requirements: {
                      typeof mission.requirements === 'object' && mission.requirements !== null
                        ? Object.entries(mission.requirements as Record<string, unknown>)
                            .map(([key, value]) => `${key}: ${String(value)}`)
                            .join(', ')
                        : Array.isArray(mission.requirements)
                        ? (mission.requirements as string[]).join(', ')
                        : String(mission.requirements)
                    }
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ 
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    Rewards: {mission.rewards ? (
                      <>
                        {mission.rewards.xp ? `${mission.rewards.xp} XP` : ''}
                        {mission.rewards?.capabilities && mission.rewards.capabilities.length > 0 && 
                          `${mission.rewards.xp ? ', ' : ''}${mission.rewards.capabilities.join(', ')}`}
                      </>
                    ) : 'None'}
                  </Typography>
                </Box>

                {mission.mainPrerequisite && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    mt: 1,
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{
                      color: 'rgba(255,255,255,0.6)',
                      flexShrink: 0
                    }}>
                      Required:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      overflow: 'hidden'
                    }}>
                      <Box
                        component="img"
                        src={getPerkIconUrl({ 
                          name: Object.values(techTree)
                            .flatMap(phase => 
                              Object.entries(phase as PhaseData)
                                .filter(([key]) => !['name', 'period', 'description'].includes(key))
                                .flatMap(([_, items]) => items as PerkItem[])
                            )
                            .find((item): item is PerkItem => 
                              item?.capability_id === mission.mainPrerequisite
                            )?.name || 'Unknown',
                          capability_id: mission.mainPrerequisite 
                        })}
                        alt="Required Perk"
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          opacity: mission.status === 'locked' ? 0.5 : 1,
                          filter: mission.status === 'locked' ? 'grayscale(100%)' : 'none',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{
                          color: mission.status === 'locked' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {Object.values(techTree)
                          .flatMap(phase => 
                            Object.entries(phase as PhaseData)
                              .filter(([key]) => !['name', 'period', 'description'].includes(key))
                              .flatMap(([_, items]) => items as PerkItem[])
                          )
                          .find((item): item is PerkItem => 
                            item && 
                            typeof item === 'object' && 
                            'capability_id' in item && 
                            item.capability_id === mission.mainPrerequisite
                          )?.name || 'Unknown Perk'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
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
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:disabled': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
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
      {selectedMission && (
        <MissionModal
          open={!!selectedMission}
          onClose={() => setSelectedMission(null)}
          mission={selectedMission}
          onStart={handleStartMission}
          isStarting={isStartingMission}
        />
      )}
    </>
  );
};

export default MissionsPage;
