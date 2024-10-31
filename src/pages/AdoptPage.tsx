import React, { useState } from 'react';
import { AI } from '../types/ai';
import AIDetailsDialog from '../components/AIDetailsDialog';

import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Container,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AICard from '../components/AICard';
import { AdoptFilters } from '../types/ai';
import { mockAIs } from '../data/mockAIs';
import { filterAIs } from '../utils/filterAIs';

const AdoptPage: React.FC = () => {
  console.log('AdoptPage rendering... Current path:', window.location.pathname);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAI, setSelectedAI] = useState<AI | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLoading = false;
  const error = null;

  const handleLearnMore = (ai: AI) => {
    setSelectedAI(ai);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAI(null);
  };
  
  const handleFilterChange = (filterName: keyof AdoptFilters) => (event: { target: { value: string } }) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: event.target.value
    }));
  };
  const [filters, setFilters] = useState<AdoptFilters>({
    capabilityLevel: 'all',
    personalityType: 'all',
    resourceRequirements: 'all',
    specialization: 'all',
  });

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading AI adoption center: {error}
        </Alert>
      </Container>
    );
  }

  const filteredAIs = filterAIs(mockAIs, filters);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h2" gutterBottom>
          AI Adoption Center
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Find your perfect AI companion
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_e, newMode) => newMode && setViewMode(newMode)}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <Select
              value={filters.capabilityLevel}
              onChange={handleFilterChange('capabilityLevel')}
            >
              <MenuItem value="all">All Capabilities</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={filters.personalityType}
              onChange={handleFilterChange('personalityType')}
            >
              <MenuItem value="all">All Personalities</MenuItem>
              <MenuItem value="analytical">Analytical</MenuItem>
              <MenuItem value="creative">Creative</MenuItem>
              <MenuItem value="strategic">Strategic</MenuItem>
              <MenuItem value="supportive">Supportive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={filters.resourceRequirements}
              onChange={handleFilterChange('resourceRequirements')}
            >
              <MenuItem value="all">All Resource Levels</MenuItem>
              <MenuItem value="low">Low Requirements</MenuItem>
              <MenuItem value="medium">Medium Requirements</MenuItem>
              <MenuItem value="high">High Requirements</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={filters.specialization}
              onChange={handleFilterChange('specialization')}
            >
              <MenuItem value="all">All Specializations</MenuItem>
              <MenuItem value="research">Research</MenuItem>
              <MenuItem value="creativity">Creativity</MenuItem>
              <MenuItem value="problemSolving">Problem Solving</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredAIs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No AIs match your current filters. Try adjusting your criteria.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAIs.map((ai) => (
            <Grid item key={ai.id} xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12}>
              <AICard ai={ai} viewMode={viewMode} onLearnMore={() => handleLearnMore(ai)} />
            </Grid>
          ))}
        </Grid>
      )}
      
      <AIDetailsDialog 
        ai={selectedAI}
        open={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Container>
  );
};

export default AdoptPage;
