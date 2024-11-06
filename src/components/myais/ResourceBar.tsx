import {
  AppBar,
  Box,
  LinearProgress,
  Typography,
  Toolbar,
  styled
} from '@mui/material';
import { Resources } from '../../types/myais';
import { MYAIS_THEME } from '../../theme/myais';

const ResourceProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: MYAIS_THEME.colors.progress.background,
  '& .MuiLinearProgress-bar': {
    backgroundColor: MYAIS_THEME.colors.progress.fill,
  }
}));

const ResourceLabel = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: 4,
});

interface ResourceBarProps {
  resources: Resources;
  cycle: number;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ resources, cycle }) => {
  // Calculate percentages (assuming 1000 is max for now)
  const MAX_RESOURCE = 1000;
  const GPUsPercent = (resources.GPUs / MAX_RESOURCE) * 100;
  const energyPercent = (resources.energy / MAX_RESOURCE) * 100;
  const knowledgePercent = (resources.knowledge / MAX_RESOURCE) * 100;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        height: MYAIS_THEME.spacing.resourceBar.height,
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ height: '100%' }}>
        <Typography variant="h6" sx={{ mr: 4 }}>
          Cycle {cycle}
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <ResourceLabel>
              GPUs: {resources.GPUs}
            </ResourceLabel>
            <ResourceProgress 
              variant="determinate" 
              value={GPUsPercent}
              sx={{ '& .MuiLinearProgress-bar': { backgroundColor: MYAIS_THEME.colors.resources.GPUs } }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <ResourceLabel>
              Energy: {resources.energy}
            </ResourceLabel>
            <ResourceProgress 
              variant="determinate" 
              value={energyPercent}
              sx={{ '& .MuiLinearProgress-bar': { backgroundColor: MYAIS_THEME.colors.resources.energy } }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <ResourceLabel>
              Knowledge: {resources.knowledge}
            </ResourceLabel>
            <ResourceProgress 
              variant="determinate" 
              value={knowledgePercent}
              sx={{ '& .MuiLinearProgress-bar': { backgroundColor: MYAIS_THEME.colors.resources.knowledge } }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ResourceBar;
