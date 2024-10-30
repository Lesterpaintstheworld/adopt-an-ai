import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Tooltip,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Memory as MemoryIcon,
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import techTree from '../../content/tech/tech-tree.yml';

// Helper function to get icon by tag
const getTagIcon = (tag: string) => {
  const type = tag.split(' ')[1];
  switch(type) {
    case 'TECHNICAL': return <MemoryIcon fontSize="small" />;
    case 'COGNITIVE': return <PsychologyIcon fontSize="small" />;
    case 'SOCIAL': return <ChatIcon fontSize="small" />;
    default: return <StarIcon fontSize="small" />;
  };
};

const TechItem = ({ item, phase }: { item: any; phase: string }) => {
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">{item.description}</Typography>
          {item.prerequisites && (
            <Box mt={1}>
              <Typography variant="caption" color="textSecondary">
                Prerequisites:
              </Typography>
              {item.prerequisites.map((prereq: string) => (
                <Chip
                  key={prereq}
                  label={prereq}
                  size="small"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          )}
        </Box>
      }
      arrow
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          m: 1,
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s',
            boxShadow: 3,
          },
          backgroundColor: (theme) => 
            phase === 'phase_1' ? theme.palette.primary.light :
            phase === 'phase_2' ? theme.palette.secondary.light :
            phase === 'phase_3' ? theme.palette.success.light :
            theme.palette.warning.light,
          opacity: 0.9,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.name}
          </Typography>
          <Chip
            icon={getTagIcon(item.tag)}
            label={item.tag.split(' ')[1]}
            size="small"
            variant="outlined"
          />
        </Box>
      </Paper>
    </Tooltip>
  );
};

const LayerSection = ({ title, items, phase }: { title: string; items: any[]; phase: string }) => (
  <Box mb={3}>
    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
      {title.replace('_', ' ')}
    </Typography>
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.name}>
          <TechItem item={item} phase={phase} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const TechTreePage = () => {
  const [expandedPhase, setExpandedPhase] = useState<string>('phase_1');

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          AI Evolution Tech Tree
        </Typography>
        
        {Object.entries(techTree).map(([phaseKey, phaseData]: [string, any]) => (
          <Accordion 
            key={phaseKey}
            expanded={expandedPhase === phaseKey}
            onChange={() => setExpandedPhase(phaseKey)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: '100%' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h5">
                    {phaseData.name} ({phaseData.period})
                  </Typography>
                  <TimelineIcon />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {phaseData.description}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={
                    phaseKey === 'phase_1' ? 100 :
                    phaseKey === 'phase_2' ? 75 :
                    phaseKey === 'phase_3' ? 50 :
                    25
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(phaseData)
                .filter(([key]) => key !== 'name' && key !== 'period' && key !== 'description')
                .map(([layerKey, items]: [string, any]) => (
                  <LayerSection 
                    key={layerKey}
                    title={layerKey}
                    items={items}
                    phase={phaseKey}
                  />
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};
